import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error('Missing Amadeus API credentials');
}

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
});

interface FlightSegment {
  carrierCode: string;
  number: string;
  departure: {
    iataCode: string;
  };
  arrival: {
    iataCode: string;
  };
}

interface FlightOffer {
  id: string;
  itineraries: Array<{
    segments: FlightSegment[];
  }>;
  price: {
    total: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const { origin, destination, date, travellers } = await req.json();

    if (!origin || !destination || !date || !travellers) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: date,
      adults: travellers,
      max: 5,
    });

    const flights = response.data.map((offer: FlightOffer) => ({
      id: offer.id,
      title: `${offer.itineraries[0].segments[0].carrierCode} ${offer.itineraries[0].segments[0].number}`,
      subtitle: `${offer.itineraries[0].segments[0].departure.iataCode} → ${offer.itineraries[0].segments[0].arrival.iataCode}`,
      price: parseFloat(offer.price.total),
      imageUrl: `/images/airlines/${offer.itineraries[0].segments[0].carrierCode.toLowerCase()}.png`,
    }));

    return NextResponse.json({ flights });
  } catch (error) {
    console.error('Error searching flights:', error);
    return NextResponse.json(
      { error: 'Failed to search flights' },
      { status: 500 }
    );
  }
} 