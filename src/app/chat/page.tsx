// src/app/chat/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl?: string;
};

export default function ChatPage() {
  // ───────────────────────────────────────────────────────────────────────────
  // Chat state
  // ───────────────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your travel assistant. I can help you find real-time travel packages, including flights, hotels, and vacation deals. What kind of travel package are you looking for?",
    },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      const botMessage: Message = {
        role: 'assistant',
        content: data.reply as string,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMsg: Message = {
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble finding travel packages right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const formatMessage = (text: string) =>
    text.split('\n').map((line, i) =>
      /Price: \$|Book Now:/.test(line) ? (
        <div key={i} className="font-semibold text-blue-600">
          {line}
        </div>
      ) : (
        <div key={i}>{line}</div>
      )
    );

  // ───────────────────────────────────────────────────────────────────────────
  // Trip-planner search state
  // ───────────────────────────────────────────────────────────────────────────
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [date, setDate] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const [results, setResults] = useState<{
    flights: SearchResult[];
    hotels: SearchResult[];
    activities: SearchResult[];
  }>({ flights: [], hotels: [], activities: [] });

  const handleSearch = async () => {
    if (!origin || !destination || !date || travellers < 1) {
      alert('Please fill in all required fields');
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, travellers, date }),
      });

      if (!res.ok) {
        throw new Error('Search failed');
      }

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search for travel options. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // "My Trips" dropdown state
  // ───────────────────────────────────────────────────────────────────────────
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [trips, setTrips] = useState<{ id: string; tripName: string }[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Whenever auth state changes, load all trips where I'm in members[]
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        // Query top-level /trips where members array contains this user's UID
        const tripsRef = collection(db, 'trips');
        const tripsQuery = query(
          tripsRef,
          where('members', 'array-contains', u.uid)
        );
        const tripSnap = await getDocs(tripsQuery);

        const myTrips = tripSnap.docs.map((d) => ({
          id: d.id,
          tripName: (d.data().tripName as string) || 'Unnamed Trip',
        }));
        setTrips(myTrips);
      } else {
        setTrips([]);
      }
    });

    return () => unsub();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // Save a search result into /trips/{tripId}/itinerary
  // ───────────────────────────────────────────────────────────────────────────
  const saveToItinerary = async (
    item: SearchResult,
    type: 'flight' | 'stays' | 'activity'
  ) => {
    if (!user || !selectedTrip) {
      alert('Please select a trip first.');
      return;
    }

    try {
      // NEW: reference top-level /trips/{selectedTrip}/itinerary
      const itineraryRef = collection(
        doc(db, 'trips', selectedTrip),
        'itinerary'
      );
      await addDoc(itineraryRef, {
        ...item,
        type,
        savedAt: new Date(),
      });
      alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} added to itinerary!`
      );
    } catch (err) {
      console.error('Failed to save to itinerary:', err);
      alert('Failed to save to itinerary.');
    }
  };

  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ─── LEFT: CHAT ───────────────────────────────────────────────────────── */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white shadow-lg h-full">
        {/* ─── Chat Header Additions ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            {/* Select Trip Dropdown */}
            <div className="relative">
              <select
                className="flex items-center px-4 py-2 rounded-xl border border-gray-200 bg-white text-lg font-medium shadow-sm hover:border-blue-400 transition-all duration-200"
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                disabled={!user || trips.length === 0}
              >
                <option value="" disabled>
                  {trips.length === 0 ? 'No Trips' : 'Select Trip'}
                </option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.tripName}
                  </option>
                ))}
              </select>
            </div>
            {/* Create New Trip Button */}
            <button
              className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-all duration-200 bg-transparent border-none p-0 focus:outline-none"
              onClick={() => router.push('/trips/new')}
            >
              +
            </button>
          </div>
          {/* User Preferences Button */}
          <button
            className="text-gray-500 text-lg font-medium hover:text-blue-600 transition-all duration-200"
            onClick={() => router.push('/preferences')}
          >
            User Preferences
          </button>
        </div>
        {/* ─── End Chat Header Additions ──────────────────────────────────────── */}

        <div className="flex flex-col flex-1 min-h-0 h-full">
          <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-2xl px-5 py-4 max-w-[80%] shadow-sm text-base whitespace-pre-line transition-all duration-200 ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-100'
                  }`}
                >
                  {formatMessage(m.content)}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-5 py-4 max-w-[80%] bg-white text-gray-700 shadow-sm text-base animate-pulse">
                  Searching for available travel packages...
                </div>
              </div>
            )}
          </main>

          <form
            onSubmit={sendMessage}
            className="px-4 py-3 border-t bg-white flex items-center gap-3"
          >
            <input
              type="text"
              className="flex-1 rounded-full border border-gray-200 px-6 py-3 text-base outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Ask me about travel…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
              disabled={chatLoading || !input.trim()}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-send"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* ─── RIGHT: TRIP PLANNER ──────────────────────────────────────────────── */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="p-8 bg-white flex flex-col gap-6">
          <div className="flex gap-4">
            <input
              type="text"
              className="flex-1 rounded-xl border border-gray-200 px-6 py-3 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Origin (e.g., NYC)"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            />
            <input
              type="text"
              className="flex-1 rounded-xl border border-gray-200 px-6 py-3 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Destination (e.g., LON)"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
            />
            <input
              type="number"
              min={1}
              className="w-32 rounded-xl border border-gray-200 px-6 py-3 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Travelers"
              value={travellers}
              onChange={(e) => setTravellers(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex items-center gap-4">
            <input
              type="date"
              className="flex-1 rounded-xl border border-gray-200 px-6 py-3 outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
              {searchLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-0">
          {/* ══════════ Flights ══════════ */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
            <h2 className="font-bold p-4 border-b bg-gradient-to-r from-gray-50 to-white">Flights</h2>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {searchLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              ) : results.flights.length > 0 ? (
                results.flights.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    {f.imageUrl && (
                      <Image
                        src={f.imageUrl}
                        alt={f.title}
                        width={72}
                        height={72}
                        className="rounded-lg object-cover mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{f.title}</div>
                      <div className="text-sm text-gray-600">{f.subtitle}</div>
                      <div className="text-sm font-semibold text-blue-600 mt-2">
                        {formatPrice(f.price)}
                      </div>
                    </div>
                    <button
                      className="ml-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 text-xl font-bold shadow"
                      title="Add to itinerary"
                      onClick={() => saveToItinerary(f, 'flight')}
                    >
                      +
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No flights found
                </div>
              )}
            </div>
          </div>

          {/* ══════════ Hotels ══════════ */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
            <h2 className="font-bold p-4 border-b bg-gradient-to-r from-gray-50 to-white">Stays</h2>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {searchLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              ) : results.hotels.length > 0 ? (
                results.hotels.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    {h.imageUrl && (
                      <Image
                        src={h.imageUrl}
                        alt={h.title}
                        width={72}
                        height={72}
                        className="rounded-lg object-cover mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{h.title}</div>
                      <div className="text-sm text-gray-600">{h.subtitle}</div>
                      <div className="text-sm font-semibold text-blue-600 mt-2">
                        {formatPrice(h.price)}
                      </div>
                    </div>
                    <button
                      className="ml-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 text-xl font-bold shadow"
                      title="Add to itinerary"
                      onClick={() => saveToItinerary(h, 'stays')}
                    >
                      +
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No stays found
                </div>
              )}
            </div>
          </div>

          {/* ══════════ Activities ══════════ */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
            <h2 className="font-bold p-4 border-b bg-gradient-to-r from-gray-50 to-white">Activities</h2>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {searchLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                  ))}
                </div>
              ) : results.activities.length > 0 ? (
                results.activities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    {a.imageUrl && (
                      <Image
                        src={a.imageUrl}
                        alt={a.title}
                        width={72}
                        height={72}
                        className="rounded-lg object-cover mr-4"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{a.title}</div>
                      <div className="text-sm text-gray-600">{a.subtitle}</div>
                      <div className="text-sm font-semibold text-blue-600 mt-2">
                        {formatPrice(a.price)}
                      </div>
                    </div>
                    <button
                      className="ml-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 text-xl font-bold shadow"
                      title="Add to itinerary"
                      onClick={() => saveToItinerary(a, 'activity')}
                    >
                      +
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No activities found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}