import { NextRequest, NextResponse } from 'next/server';
import * as Amadeus from 'amadeus';

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error('Missing Amadeus API credentials');
}

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID as string,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET as string,
});


interface Hotel {
  hotelId: string;
  name: string;
  rating?: string;
  address?: {
    lines?: string[];
  };
  media?: Array<{ uri: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const { destination, date, travellers } = await req.json();

    if (!destination || !date || !travellers) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: destination,
    });

    const hotels = response.data.map((hotel: Hotel) => ({
      id: hotel.hotelId,
      title: hotel.name,
      subtitle: `${hotel.rating || 'N/A'} stars - ${hotel.address?.lines?.[0] || 'Address not available'}`,
      price: Math.floor(Math.random() * 200) + 100, // Placeholder price since we need a separate call for prices
      imageUrl: hotel.media?.[0]?.uri,
    }));

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Error searching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    );
  }
} 