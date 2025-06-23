import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, date, travellers } = await req.json();

    // Validate required parameters
    if (!origin || !destination || !date || !travellers) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Execute all searches in parallel
    const [flightsRes, hotelsRes, activitiesRes] = await Promise.all([
      fetch(`${req.nextUrl.origin}/api/amadeus/flights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, date, travellers }),
      }),
      fetch(`${req.nextUrl.origin}/api/amadeus/hotels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, date, travellers }),
      }),
      fetch(`${req.nextUrl.origin}/api/amadeus/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination }),
      }),
    ]);

    const [flightsData, hotelsData, activitiesData] = await Promise.all([
      flightsRes.json(),
      hotelsRes.json(),
      activitiesRes.json(),
    ]);

    return NextResponse.json({
      flights: flightsData.flights || [],
      hotels: hotelsData.hotels || [],
      activities: activitiesData.activities || [],
    });
  } catch (error) {
    console.error('Error in search orchestration:', error);
    return NextResponse.json(
      { error: 'Failed to search travel options' },
      { status: 500 }
    );
  }
} 