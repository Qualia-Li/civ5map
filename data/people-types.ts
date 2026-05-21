export type GPType =
  | "Scientist"
  | "Engineer"
  | "Merchant"
  | "Artist"
  | "Writer"
  | "Musician"
  | "General"
  | "Admiral"
  | "Prophet";

export type Era =
  | "Ancient"
  | "Classical"
  | "Medieval"
  | "Renaissance"
  | "Industrial"
  | "Modern";

export interface Place {
  name: string;
  coords: [number, number]; // [lat, lng]
}

export interface Person {
  name: string;
  type: GPType;
  civ: string;
  country: string;
  era: Era;
  born?: number;
  died?: number;
  birth?: Place;
  work?: Place;
  death?: Place;
  works: string[];
  blurb: string;
}
