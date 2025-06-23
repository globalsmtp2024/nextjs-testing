import Amadeus from 'amadeus';

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error('Missing Amadeus API credentials');
}

// Initialize Amadeus client
let amadeus: Amadeus | null = null;

async function initAmadeus(): Promise<Amadeus> {
  if (!amadeus) {
    amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID!,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
    });
  }
  if (!amadeus) {
    throw new Error('Amadeus client initialization failed.');
  }
  return amadeus;
}

export type SearchParams = {
  origin: string;
  destination: string;
  date: string;
  travellers: number;
};

export type FlightOffer = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl?: string;
};

export type HotelOffer = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl?: string;
};

export type ActivityOffer = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  imageUrl?: string;
};

interface FlightResponse {
  id: string;
  itineraries: Array<{
    segments: Array<{
      carrierCode: string;
      number: string;
      departure: { iataCode: string };
      arrival: { iataCode: string };
    }>;
  }>;
  price: { total: string };
}

interface HotelResponse {
  hotel: {
    hotelId: string;
    name: string;
    rating: string;
    address: { lines: string[] };
    media?: Array<{ uri: string }>;
  };
  offers: Array<{
    price: { total: string };
  }>;
}

interface ActivityResponse {
  id: string;
  name: string;
  shortDescription?: string;
  price: { amount: string };
  pictures?: Array<{ url: string }>;
}

export async function searchFlights(params: SearchParams): Promise<FlightOffer[]> {
  try {
    const client = await initAmadeus();
    const response = await client.shopping.flightOffersSearch.get({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.date,
      adults: params.travellers,
      max: 5, // Limit to 5 results
    });

    return response.data.map((offer: FlightResponse) => ({
      id: offer.id,
      title: `${offer.itineraries[0].segments[0].carrierCode} ${offer.itineraries[0].segments[0].number}`,
      subtitle: `${offer.itineraries[0].segments[0].departure.iataCode} → ${offer.itineraries[0].segments[0].arrival.iataCode}`,
      price: parseFloat(offer.price.total),
      imageUrl: `/images/airlines/${offer.itineraries[0].segments[0].carrierCode.toLowerCase()}.png`,
    }));
  } catch (error) {
    console.error('Error searching flights:', error);
    return [];
  }
}

export async function searchHotels(params: SearchParams): Promise<HotelOffer[]> {
  try {
    const client = await initAmadeus();
    const response = await client.shopping.hotelOffersSearch.get({
      cityCode: params.destination,
      checkInDate: params.date,
      adults: params.travellers,
      radius: 5, // 5km radius
      radiusUnit: 'KM',
      max: 5, // Limit to 5 results
    });

    return response.data.map((offer: HotelResponse) => ({
      id: offer.hotel.hotelId,
      title: offer.hotel.name,
      subtitle: `${offer.hotel.rating} stars - ${offer.hotel.address.lines[0]}`,
      price: parseFloat(offer.offers[0].price.total),
      imageUrl: offer.hotel.media?.[0]?.uri,
    }));
  } catch (error) {
    console.error('Error searching hotels:', error);
    return [];
  }
}

export async function searchActivities(params: SearchParams): Promise<ActivityOffer[]> {
  try {
    const client = await initAmadeus();
    // First, get city coordinates
    const cityResp = await client.referenceData.locations.get({
      keyword: params.destination,
      subType: 'CITY',
    });
    if (!cityResp.data || cityResp.data.length === 0) {
      return [];
    }
    const city = cityResp.data[0];
    const { latitude, longitude } = city.geoCode;
    const response = await client.shopping.activities.get({
      latitude,
      longitude,
      radius: 5,
      radiusUnit: 'KM',
    });

    return response.data.map((activity: ActivityResponse) => ({
      id: activity.id,
      title: activity.name,
      subtitle: activity.shortDescription || 'Activity',
      price: parseFloat(activity.price.amount),
      imageUrl: activity.pictures?.[0]?.url,
    }));
  } catch (error) {
    console.error('Error searching activities:', error);
    return [];
  }
} 