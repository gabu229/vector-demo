export type PartMetric = {
  label: string;
  value: string;
  progress?: number;
};

export type Part = {
  id: string;
  title: string;
  tag: string;
  image: string;
  align: "left" | "right";
  highlight?: boolean;
  metrics?: PartMetric[];
  recommendation?: string;
};

export const parts: Part[] = [
  {
    id: "brake",
    title: "Brake System",
    tag: "Heat",
    image: "/assets/parts/brake.png",
    align: "left",
    highlight: true,
    metrics: [
      { label: "Tyre Temp", value: "648°C" },
      { label: "Grip Index", value: "0.94" },
      { label: "Contact Patch", value: "285cm" },
      { label: "Wear Rate", value: "2.1%" },
    ],
    recommendation: "Maintain pressure",
  },
  {
    id: "tyre",
    title: "Tyre & Wheel",
    tag: "Grip",
    image: "/assets/parts/tyre.png",
    align: "right",
    highlight: true,
    metrics: [
      { label: "Tyre Temp", value: "648°C" },
      { label: "Grip Index", value: "0.94" },
      { label: "Contact Patch", value: "285cm" },
      { label: "Wear Rate", value: "2.1%" },
    ],
    recommendation: "Maintain pressure",
  },
  {
    id: "steering",
    title: "Steering",
    tag: "Response",
    image: "/assets/parts/steering.png",
    align: "right",
    highlight: true,
    metrics: [
      { label: "Tyre Temp", value: "648°C" },
      { label: "Grip Index", value: "0.94" },
      { label: "Contact Patch", value: "285cm" },
      { label: "Wear Rate", value: "2.1%" },
    ],
    recommendation: "Maintain pressure",
  },
  {
    id: "suspension",
    title: "Suspension",
    tag: "Stability",
    image: "/assets/parts/suspension.png",
    align: "left",
    highlight: true,
    metrics: [
      { label: "Suspension Travel", value: "28mm" },
      { label: "Load Transfer", value: "1,320kg" },
      { label: "Damping Rate", value: "3.6kN/s" },
      { label: "Ride Frequency", value: "2.8Hz" },
    ],
    recommendation: "Slightly Increase damping ",
  },
  {
    id: "front-wing",
    title: "Front Wing",
    tag: "Aero Load",
    image: "/assets/parts/front-wing.png",
    align: "right",
    highlight: true,
    metrics: [
      { label: "Tyre Temp", value: "648°C" },
      { label: "Grip Index", value: "0.94" },
      { label: "Contact Patch", value: "285cm" },
      { label: "Wear Rate", value: "2.1%" },
    ],
    recommendation: "Maintain pressure",
  },
  {
    id: "rear-wing",
    title: "Rear Wing",
    tag: "Balance",
    image: "/assets/parts/rear-wing.png",
    align: "right",
    highlight: true,
    metrics: [
      { label: "Tyre Temp", value: "648°C" },
      { label: "Grip Index", value: "0.94" },
      { label: "Contact Patch", value: "285cm" },
      { label: "Wear Rate", value: "2.1%" },
    ],
    recommendation: "Maintain pressure",
  },
];
