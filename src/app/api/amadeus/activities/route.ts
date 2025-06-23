import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error('Missing Amadeus API credentials');
}

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
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
    const body = await req.json();
    const destination = typeof body.destination === 'string' ? body.destination : null;

    if (!destination) {
      return NextResponse.json(
        { error: 'Missing required parameter: destination' },
        { status: 400 }
      );
    }

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
    if (!city.geoCode || typeof city.geoCode.latitude !== 'number' || typeof city.geoCode.longitude !== 'number') {
      return NextResponse.json(
        { error: 'City geo coordinates not available' },
        { status: 404 }
      );
    }

    const { latitude, longitude } = city.geoCode;

    const activitiesResponse = await amadeus.shopping.activities.get({
      latitude,
      longitude,
      radius: 5,
      radiusUnit: 'KM',
    });

    const activities = Array.isArray(activitiesResponse.data)
      ? activitiesResponse.data.map((activity: Activity) => ({
          id: activity.id,
          title: activity.name,
          subtitle: activity.shortDescription || 'Activity',
          price: parseFloat(activity.price.amount),
          imageUrl: activity.pictures?.[0]?.url,
        }))
      : [];

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error searching activities:', error);
    return NextResponse.json(
      { error: 'Failed to search activities' },
      { status: 500 }
    );
  }
}
