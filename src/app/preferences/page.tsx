"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const travelGroups = [
  "Solo Traveler",
  "Family Group",
  "Large Friend Group",
  "Small Friend Group",
  "Companion",
  "Parent & Kids",
];
const travelExperiences = [
  "Tropical Weather",
  "History & Culture",
  "Natural Wonders",
  "Social/Party",
  "Wildlife/Adventure",
];
const travelActivities = [
  "Tourist Attractions",
  "Explore Nature",
  "Social/Nightlife",
  "Sports/Recreation",
  "Relaxation/Leisure",
  "Arts/History",
];
const dreamDestTypes = [
  "The Pursuit of Serenity and Pampering",
  "The Call of Adventure and Challenge",
  "Immersion in Culture and History",
  "Connection with Nature and Wildlife",
  "Laid-Back Exploration and Beauty",
  "Unique Transformative Encounters",
];

export default function PreferencesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [city, setCity] = useState("");
  const [group, setGroup] = useState("");
  const [experiences, setExperiences] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [dreamType, setDreamType] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace("/login");
        return;
      }
      setUser(u);
      // Fetch preferences
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setCity(data.city || "");
        setGroup(data.group || "");
        setExperiences(data.experiences || []);
        setActivities(data.activities || []);
        setDreamType(data.dreamType || "");
      }
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
      await setDoc(doc(db, "users", user.uid), {
        city,
        group,
        experiences,
        activities,
        dreamType,
        email: user.email,
      });
      setSuccess("Preferences saved!");
    } catch {
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Tell us about Yourself So We Can Plan Your Perfect Trip</h1>
      <form onSubmit={handleSave} className="w-full max-w-2xl bg-white rounded-2xl shadow p-8 flex flex-col gap-8">
        <div>
          <label className="block text-xl font-semibold mb-2">Your Home City</label>
          <input
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city name"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Preferred Travel group</label>
          <div className="flex flex-wrap gap-3">
            {travelGroups.map(g => (
              <button
                type="button"
                key={g}
                className={`px-5 py-2 rounded-full border text-base font-medium transition ${group === g ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                onClick={() => setGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Travel Experiences</label>
          <div className="flex flex-wrap gap-3">
            {travelExperiences.map(exp => (
              <button
                type="button"
                key={exp}
                className={`px-5 py-2 rounded-full border text-base font-medium transition ${experiences.includes(exp) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                onClick={() => setExperiences(experiences.includes(exp) ? experiences.filter(e => e !== exp) : [...experiences, exp])}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Travel Activities</label>
          <div className="flex flex-wrap gap-3">
            {travelActivities.map(act => (
              <button
                type="button"
                key={act}
                className={`px-5 py-2 rounded-full border text-base font-medium transition ${activities.includes(act) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                onClick={() => setActivities(activities.includes(act) ? activities.filter(a => a !== act) : [...activities, act])}
              >
                {act}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Dream Destination Type</label>
          <select
            className="w-full rounded-xl border border-gray-200 px-6 py-3 text-lg outline-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={dreamType}
            onChange={e => setDreamType(e.target.value)}
            required
          >
            <option value="" disabled>Select a type</option>
            {dreamDestTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold text-lg shadow-sm hover:from-teal-600 hover:to-blue-600 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </form>
      {/* Display current selections in an intuitive way */}
      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Current Preferences</h2>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
          <div><span className="font-medium">Home City:</span> {city || <span className="text-gray-400">Not set</span>}</div>
          <div><span className="font-medium">Travel Group:</span> {group || <span className="text-gray-400">Not set</span>}</div>
          <div><span className="font-medium">Experiences:</span> {experiences.length ? experiences.join(", ") : <span className="text-gray-400">None selected</span>}</div>
          <div><span className="font-medium">Activities:</span> {activities.length ? activities.join(", ") : <span className="text-gray-400">None selected</span>}</div>
          <div><span className="font-medium">Dream Destination Type:</span> {dreamType || <span className="text-gray-400">Not set</span>}</div>
        </div>
      </div>
    </div>
  );
} 