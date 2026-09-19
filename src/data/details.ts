export type Detail = {
  title: string;
  image: string;
  description: string;
  metrics: { label: string; value: string }[];
};

export const details = [
  {
    title: "Thermal Load",
    image: "/assets/details/002.png",
    description:
      "At race pace, braking, tyre friction and powertrain load generate extreme temperatures in seconds. APEX tracks thermal behaviour in real time to show where performance begins to drop before it becomes a problem.",
    metrics: [
      { label: "Brake Temp", value: "648°C" },
      { label: "Tyre Surface", value: "0.94" },
      { label: "Cooling Efficiency", value: "91%" },
    ],
  },
  {
    title: "Vehicle Motion",
    image: "/assets/details/001.png",
    description:
      "Acceleration, braking and cornering constantly shift load through the car. APEX reads these movements together, revealing how balance, grip and driver input affect speed through every phase of the lap.",
    metrics: [
      { label: "Lateral Load", value: "2.8 G" },
      { label: "Braking Force", value: "-1.6 G" },
      { label: "Peak Speed", value: "286 KM/H" },
    ],
  },
  {
    title: "Driver Input",
    image: "/assets/details/003.png",
    description:
      "Every steering, throttle and brake input shapes the car's behavior on track. Vector connects driver intent with vehicle response to highlight where precision, confidence and consistency create lap time.",
    metrics: [
      { label: "Steering Input", value: "14.6°" },
      { label: "Throttle Position", value: "87%" },
      { label: "Driver Consistency", value: "96%" },
    ],
  },
];
