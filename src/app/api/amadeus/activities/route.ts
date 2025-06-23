import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error('Missing Amadeus API credentials');
}

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});

interface Activity {
  id: string;
  name: string;
  shortDescription?: string;
  price: {
    amount: string;
  };
  pictures?: Array<{ url: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const { destination } = await req.json();

    if (!destination) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // First, get the city coordinates
    const cityResponse = await amadeus.referenceData.locations.get({
      keyword: destination,
      subType: 'CITY',
    });

    if (!cityResponse.data || cityResponse.data.length === 0) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    const city = cityResponse.data[0];
    const { latitude, longitude } = city.geoCode;

    // Then, search for activities using the coordinates
    const activitiesResponse = await amadeus.shopping.activities.get({
      latitude,
      longitude,
      radius: 5,
      radiusUnit: 'KM',
    });

    const activities = activitiesResponse.data.map((activity: Activity) => ({
      id: activity.id,
      title: activity.name,
      subtitle: activity.shortDescription || 'Activity',
      price: parseFloat(activity.price.amount),
      imageUrl: activity.pictures?.[0]?.url,
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error searching activities:', error);
    return NextResponse.json(
      { error: 'Failed to search activities' },
      { status: 500 }
    );
  }
} 