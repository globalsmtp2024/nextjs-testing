declare module 'amadeus' {
  class Amadeus {
    constructor(config: { clientId: string; clientSecret: string });
    shopping: {
      flightOffersSearch: {
        get(params: {
          originLocationCode: string;
          destinationLocationCode: string;
          departureDate: string;
          adults: number;
          max?: number;
        }): Promise<{
          data: Array<{
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
          }>;
        }>;
      };
      hotelOffersSearch: {
        get(params: {
          cityCode: string;
          checkInDate: string;
          adults: number;
          radius?: number;
          radiusUnit?: string;
          max?: number;
        }): Promise<{
          data: Array<{
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
          }>;
        }>;
      };
      activities: {
        get(params: {
          latitude: number;
          longitude: number;
          radius?: number;
          radiusUnit?: string;
        }): Promise<{
          data: Array<{
            id: string;
            name: string;
            shortDescription?: string;
            price: { amount: string };
            pictures?: Array<{ url: string }>;
          }>;
        }>;
      };
    };
    referenceData: {
      locations: {
        get(params: {
          keyword: string;
          subType: string;
        }): Promise<{
          data: Array<{
            name: string;
            geoCode: {
              latitude: number;
              longitude: number;
            };
          }>;
        }>;
        hotels: {
          byCity: {
            get(params: {
              cityCode: string;
            }): Promise<{
              data: Array<{
                hotelId: string;
                name: string;
                rating?: string;
                address?: {
                  lines: string[];
                };
                media?: Array<{ uri: string }>;
              }>;
            }>;
          };
        };
        pointsOfInterest: {
          get(params: {
            cityCode: string;
            radius?: number;
            radiusUnit?: string;
          }): Promise<{
            data: Array<{
              id: string;
              name: string;
              category?: string;
              media?: Array<{ uri: string }>;
            }>;
          }>;
        };
      };
    };
  }
  export = Amadeus;
}
