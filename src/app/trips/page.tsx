// File: app/trips/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";

//
// 1) Each itinerary item lives under /trips/{tripId}/itinerary/{itemId}
//
type ItineraryItem = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  type: "flight" | "stays" | "activity";
};

//
// 2) A "traveller" state object is simply name + email.
//
type Traveller = {
  name: string;
  email: string;
};

//
// 3) We'll store two things about each trip in our "trips" array:
//    • id       = Firestore doc ID (under top-level /trips)
//    • tripName = user-friendly name
//
type TripInfo = {
  id: string;
  tripName: string;
};

export default function TripsPage() {
  // ───────────────────────────────────────────────────────────────────────────
  // Auth State and "My Trips" (all trips where current user is in members[])
  // ───────────────────────────────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<TripInfo[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>(""); // tripId as string

  // ───────────────────────────────────────────────────────────────────────────
  // Itinerary items for the currently selected trip
  // ───────────────────────────────────────────────────────────────────────────
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  // ───────────────────────────────────────────────────────────────────────────
  // Travellers list for the currently selected trip (fetched from members[])
  // ───────────────────────────────────────────────────────────────────────────
  const [travellers, setTravellers] = useState<Traveller[]>([]);

  // ───────────────────────────────────────────────────────────────────────────
  // Search Bar State (to look up existing users by email prefix)
  // ───────────────────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    { uid: string; email: string }[]
  >([]);
  const [hasSearched, setHasSearched] = useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // 1) Listen for onAuthStateChanged → load all trips where
  //    members array-contains the current user's UID.
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Query top-level /trips where members array contains this user
        const tripsRef = collection(db, "trips");
        const tripsQuery = query(
          tripsRef,
          where("members", "array-contains", firebaseUser.uid)
        );
        const snap = await getDocs(tripsQuery);

        const myTrips: TripInfo[] = snap.docs.map((d) => ({
          id: d.id,
          tripName: (d.data().tripName as string) || "Unnamed Trip",
        }));
        setTrips(myTrips);
      } else {
        // Not signed in → clear state
        setTrips([]);
        setSelectedTrip("");
        setItinerary([]);
        setTravellers([]);
      }
    });

    return () => unsub();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // 2) Whenever selectedTrip changes (and user is signed in), fetch:
  //    a) /trips/{tripId}/itinerary
  //    b) The trip doc's members[] → then look up each user's profile to get email
  // ───────────────────────────────────────────────────────────────────────────
  const fetchTripData = useCallback(async () => {
    if (!user || !selectedTrip) {
      setItinerary([]);
      setTravellers([]);
      return;
    }

    // 2.a) Fetch itinerary items under /trips/{selectedTrip}/itinerary
    {
      const itColRef = collection(db, "trips", selectedTrip, "itinerary");
      const snap = await getDocs(itColRef);
      const items: ItineraryItem[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: typeof data.title === "string" ? data.title : "",
          subtitle: typeof data.subtitle === "string" ? data.subtitle : "",
          price: typeof data.price === "number" ? data.price : 0,
          type: (data.type as "flight" | "stays" | "activity") || "activity",
        };
      });
      setItinerary(items);
    }

    // 2.b) Fetch the trip document's members[] array, then look up each user's email
    {
      const tripDocRef = doc(db, "trips", selectedTrip);
      const tripSnapshot = await getDoc(tripDocRef);

      if (tripSnapshot.exists()) {
        const data = tripSnapshot.data();
        const memberUids: string[] = Array.isArray(data.members)
          ? (data.members as string[])
          : [];

        const travellerPromises = memberUids.map(async (memberUid) => {
          const userDoc = await getDoc(doc(db, "users", memberUid));
          if (userDoc.exists()) {
            const udata = userDoc.data() as { email?: string };
            const email = udata.email || "";
            return {
              name: email.split("@")[0],
              email,
            } as Traveller;
          } else {
            // If profile doc is missing, skip it
            return null;
          }
        });

        const maybeTravellers = await Promise.all(travellerPromises);
        const finalTravellers: Traveller[] = maybeTravellers.filter(
          (t): t is Traveller => t !== null
        );
        setTravellers(finalTravellers);
      } else {
        // Trip was deleted or doesn't exist
        setTravellers([]);
      }
    }
  }, [user, selectedTrip]);

  useEffect(() => {
    fetchTripData();
  }, [fetchTripData]);

  // ───────────────────────────────────────────────────────────────────────────
  // 3) Delete one itinerary item under /trips/{tripId}/itinerary/{itemId}
  // ───────────────────────────────────────────────────────────────────────────
  const handleDeleteItem = async (itemId: string) => {
    if (!user || !selectedTrip) return;
    try {
      const itemDocRef = doc(
        db,
        "trips",
        selectedTrip,
        "itinerary",
        itemId
      );
      await deleteDoc(itemDocRef);

      // Optionally verify:
      const after = await getDoc(itemDocRef);
      if (after.exists()) {
        console.error("Item still exists after delete:", itemId);
        throw new Error("Deletion failed");
      }

      // Remove from local state immediately
      setItinerary((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.error("Error deleting itinerary item:", err);
      alert("Could not delete that item. Check console for details.");
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 4) Search existing users in /users by email prefix
  // ───────────────────────────────────────────────────────────────────────────
  const handleSearchUsers = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setSearchResults([]);
      setHasSearched(true);
      return;
    }
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("email", ">=", trimmed),
        where("email", "<=", trimmed + "\uf8ff")
      );
      const snap = await getDocs(q);
      const results = snap.docs.map((d) => ({
        uid: d.id,
        email: (d.data().email as string) || "",
      }));
      setSearchResults(results);
      setHasSearched(true);
    } catch (err) {
      console.error("Error searching users by email:", err);
      setSearchResults([]);
      setHasSearched(true);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 5) "Hard-add" a searched user into the trip's members[] via arrayUnion
  // ───────────────────────────────────────────────────────────────────────────
  const handleAddTraveller = async (u: { uid: string; email: string }) => {
    if (!user || !selectedTrip) {
      alert("Please select a trip first.");
      return;
    }
    try {
      const tripDocRef = doc(db, "trips", selectedTrip);
      await updateDoc(tripDocRef, {
        members: arrayUnion(u.uid),
      });
    } catch (err) {
      console.error("Error adding member:", err);
      alert("Could not add that user. Check console for details.");
      return;
    }

    // Immediately update local Travellers
    const derivedName = u.email.split("@")[0];
    if (!travellers.some((t) => t.email === u.email)) {
      setTravellers((prev) => [
        ...prev,
        { name: derivedName, email: u.email },
      ]);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Trigger search on Enter key
  // ───────────────────────────────────────────────────────────────────────────
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
      <h1 className="text-5xl font-bold text-center text-gray-700 mt-8 mb-8">
        Trips
      </h1>
      <div className="flex justify-center gap-8 w-full max-w-7xl mx-auto px-4">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* Main Card (center): Trip selector + Itinerary list            */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="relative flex-1 max-w-2xl bg-white rounded-2xl shadow p-10 min-h-[400px]">
          {/* Trip Dropdown */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Select Trip</label>
            <select
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedTrip}
              onChange={(e) => {
                setSelectedTrip(e.target.value);
                setItinerary([]);
                setTravellers([]);
              }}
              disabled={!user || trips.length === 0}
            >
              <option value="" disabled>
                {trips.length === 0 ? "No Trips Found" : "Choose a Trip"}
              </option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tripName}
                </option>
              ))}
            </select>
          </div>

          {/* Itinerary Sections */}
          <div className="space-y-8">
            {["flight", "stays", "activity"].map((type) => (
              <div key={type}>
                <span className="font-bold text-2xl capitalize">
                  {type === "activity"
                    ? "Activities"
                    : type === "stays"
                    ? "Stays"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <div className="mt-2 text-lg">
                  {itinerary.filter((item) => item.type === type).length === 0 ? (
                    <span className="text-gray-400">
                      No {type === "activity" ? "activities" : type === "stays" ? "stays" : type + "s"} saved.
                    </span>
                  ) : (
                    itinerary
                      .filter((item) => item.type === type)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="mb-2 p-3 rounded bg-gray-50 border border-gray-100 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-semibold">{item.title}</div>
                            <div className="text-sm text-gray-600">
                              {item.subtitle}
                            </div>
                            <div className="text-blue-600 font-bold">
                              ${item.price}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10
                                       8.586l4.293-4.293a1 1 0
                                       111.414 1.414L11.414 10l4.293
                                       4.293a1 1 0 01-1.414
                                       1.414L10 11.414l-4.293
                                       4.293a1 1 0
                                       01-1.414-1.414L8.586
                                       10 4.293 5.707a1 1 0
                                       010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* Sidebar (right): Search users & Travellers list                */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <aside className="w-80 bg-[#fafbfc] rounded-2xl shadow p-8 flex flex-col gap-6">
          {/* ===== Search Bar ===== */}
          <div>
            <label className="block font-semibold mb-2">
              Find Existing Users
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter user email…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (hasSearched) {
                    setHasSearched(false);
                    setSearchResults([]);
                  }
                }}
                onKeyPress={handleSearchKeyPress}
                className="flex-1 px-4 py-2 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={handleSearchUsers}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 rounded transition"
              >
                Search
              </button>
            </div>

            {hasSearched && (
              <div className="mt-4 max-h-48 overflow-auto border border-gray-200 rounded-lg bg-white">
                {searchResults.length > 0 ? (
                  searchResults.map((u) => {
                    const derivedName = u.email.split("@")[0];
                    return (
                      <div
                        key={u.uid}
                        className="flex justify-between items-center px-4 py-2 hover:bg-gray-50"
                      >
                        <div>
                          <div className="font-semibold">{derivedName}</div>
                          <div className="text-sm text-gray-600">{u.email}</div>
                        </div>
                        <button
                          onClick={() => handleAddTraveller(u)}
                          className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0
                                 110 2h-3v3a1 1 0
                                 11-2 0v-3H6a1 1 0
                                 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-2 text-gray-500">No users found.</div>
                )}
              </div>
            )}
          </div>

          {/* ===== Travellers List ===== */}
          <div>
            <span className="font-bold text-2xl">Travellers</span>
            <div className="mt-4 flex flex-col gap-3 max-h-60 overflow-auto">
              {travellers.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg px-4 py-2 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold">{t.name}</span>
                    <div className="text-gray-500 text-sm">{t.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== (Optional) "Send/Re-Send Invites" Button ===== */}
          <button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-2 rounded transition">
            Send / Re-Send Invites
          </button>
        </aside>
      </div>
    </div>
  );
}