export const equipmentOptions = [
  "Day Cab",
  "Box Truck",
  "Cargo Van",
  "Help me choose",
] as const;
export const serviceOptions = [
  "Regional truckload",
  "Local & regional delivery",
  "Dedicated routes",
  "Time-sensitive freight",
  "Power-only",
  "Let’s discuss my needs",
] as const;
export const frequencyOptions = [
  "To be discussed",
  "One-time shipment",
  "Daily",
  "Weekly",
  "Recurring / contract",
] as const;
export type QuotePreset = {
  equipment?: string;
  origin?: string;
  service?: string;
  key: number;
};

export const fleet = [
  {
    id: "day-cabs",
    number: "01",
    name: "Day Cabs",
    equipment: "Day Cab",
    category: "REGIONAL TRUCKING",
    image: "day-cab",
    title: "Big freight. A focused footprint.",
    description:
      "Our day cabs connect Texas facilities, distribution centers, and commercial shipping lanes. Built for the regional work that keeps your operation moving.",
    capabilities: [
      "Regional truckload freight",
      "Dedicated lanes & shuttles",
      "Power-only trailer moves",
    ],
    service: "Regional truckload",
  },
  {
    id: "box-trucks",
    number: "02",
    name: "Box Trucks",
    equipment: "Box Truck",
    category: "LOCAL & REGIONAL DELIVERY",
    image: "box-truck",
    title: "The right size for the next stop.",
    description:
      "Our box trucks bridge the space between a cargo van and a full trailer. A practical fit for palletized goods, commercial deliveries, and regional distribution.",
    capabilities: [
      "Palletized commercial freight",
      "Business-to-business deliveries",
      "Local & regional distribution",
    ],
    service: "Local & regional delivery",
  },
  {
    id: "cargo-vans",
    number: "03",
    name: "Cargo Vans",
    equipment: "Cargo Van",
    category: "SMALLER FREIGHT. DIRECT SERVICE.",
    image: "cargo-van",
    title: "Less freight. Just as much attention.",
    description:
      "Our cargo vans give smaller shipments a clear path from pickup to delivery. A nimble option for parts, parcels, supplies, and time-sensitive business freight.",
    capabilities: [
      "Parts, parcels & smaller loads",
      "Time-sensitive business freight",
      "Direct local & regional routes",
    ],
    service: "Time-sensitive freight",
  },
] as const;

export const markets = [
  {
    id: "DFW",
    name: "Dallas–Fort Worth",
    region: "North Texas",
    x: 389,
    y: 216,
    lx: 402,
    ly: 195,
    description:
      "Connect your North Texas operations with customers, suppliers, and distribution points across the state.",
    lanes: ["DFW ↔ Houston", "DFW ↔ Austin", "DFW ↔ San Antonio"],
  },
  {
    id: "HOU",
    name: "Houston",
    region: "Southeast Texas",
    x: 474,
    y: 352,
    lx: 488,
    ly: 378,
    description:
      "Keep your Houston freight connected to Texas industry, commercial corridors, and regional shipping markets.",
    lanes: ["Houston ↔ DFW", "Houston ↔ Austin", "Houston ↔ San Antonio"],
  },
  {
    id: "ATX",
    name: "Austin",
    region: "Central Texas",
    x: 366,
    y: 348,
    lx: 305,
    ly: 328,
    description:
      "Move between Austin’s business community and the facilities, customers, and supply partners that support it.",
    lanes: ["Austin ↔ DFW", "Austin ↔ Houston", "Austin ↔ San Antonio"],
  },
  {
    id: "SAT",
    name: "San Antonio",
    region: "South Texas",
    x: 335,
    y: 393,
    lx: 230,
    ly: 420,
    description:
      "Plan freight from San Antonio into the I-35 corridor and the Texas markets your business needs to reach.",
    lanes: [
      "San Antonio ↔ DFW",
      "San Antonio ↔ Houston",
      "San Antonio ↔ Austin",
    ],
  },
] as const;
