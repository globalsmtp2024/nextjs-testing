// File: app/trips/new/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NewTripPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [tripName, setTripName] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Redirect to /login if not signed in
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // 1) Reference the top‐level 'trips' collection
      const tripsRef = collection(db, "trips");

      // 2) Create a new trip doc under /trips
      await addDoc(tripsRef, {
        tripName: tripName.trim(),
        budget: parseFloat(budget) || 0,
        travelers: parseInt(String(travelers)) || 1,
        origin: origin.trim(),
        destination: destination.trim(),
        startDate: startDate || null,
        endDate: endDate || null,
        owner: user.uid,              // Who created this trip
        members: [user.uid],          // Start with the creator as the only member
        createdAt: serverTimestamp(),
      });

      setSuccess("Trip saved!");
      // After a brief delay, navigate to /trips
      setTimeout(() => {
        router.push("/trips");
      }, 1200);
    } catch (err) {
      console.error("Failed to save trip:", err);
      setError("Failed to save trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Tell us about Yourself So We Can Plan Your Perfect Trip
      </h1>
      <form
        onSubmit={handleSave}
        className="w-full max-w-md bg-white rounded-2xl shadow p-8 flex flex-col gap-8"
      >
        {/* Trip Name */}
        <div>
          <label className="block text-xl font-semibold mb-2">Name Trip</label>
          <input
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter trip name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xl font-semibold mb-2">
            Travel Budget
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="$ 0.00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        {/* Number of Travelers */}
        <div>
          <label className="block text-xl font-semibold mb-2">
            Number of Travelers
          </label>
          <input
            type="number"
            min="1"
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            value={travelers}
            onChange={(e) => setTravelers(Number(e.target.value))}
            required
          />
        </div>

        {/* Origin */}
        <div>
          <label className="block text-xl font-semibold mb-2">
            Where are You Flying From
          </label>
          <input
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter origin city"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xl font-semibold mb-2">
            Travel Destination (Optional)
          </label>
          <input
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Dates */}
        <div>
          <label className="block text-xl font-semibold mb-2">
            Trip Dates (Optional)
          </label>
          <div className="flex gap-4">
            <input
              type="date"
              className="flex-1 rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="flex-1 rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Error / Success Messages */}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold text-lg shadow-sm hover:from-teal-600 hover:to-blue-600 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </div>
  );
}