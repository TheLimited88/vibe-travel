export type LocationCategory =
  | 'Historic Site'
  | 'Religious Site'
  | 'Castle & Palace'
  | 'Museum & Gallery'
  | 'Theatre & Performing Arts'
  | 'Music Venue'
  | 'Cinema'
  | 'Monument & Memorial'
  | 'Landmark'
  | 'Scenic Viewpoint'
  | 'Sunset Spot'
  | 'Park & Garden'
  | 'Nature Reserve'
  | 'Beach'
  | 'Waterfall'
  | 'Lake & River'
  | 'Mountain & Hiking'
  | 'Wildlife'
  | 'Restaurant'
  | 'Café'
  | 'Bar & Pub'
  | 'Winery & Distillery'
  | 'Shopping'
  | 'Local Market'
  | 'Attraction'
  | 'Theme Park'
  | 'Sports Venue'
  | 'Walking Area'
  | 'Waterfront'
  | 'Street Art'
  | 'Photo Spot'
  | 'Hidden Gem'
  | 'Family Friendly'
  | 'Nightlife';

export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  distance: number;
  visits: number;
  image: string;
  subtitle?: string;
  description?: string;
  likes?: number;
  lat?: number;
  lng?: number;
}
