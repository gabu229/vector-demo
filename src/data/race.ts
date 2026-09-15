export type RaceProcess = {
  title: string;
  image: string;
  description: string;
  steps: string[];
};

export const processes: RaceProcess[] = [
  {
    title: "Practice",
    description: "Find the limit.",
    image: "/assets/tracks/track-01.svg",
    steps: ["Find the limit.", "Setup optimization ", "Driver development"],
  },
  {
    title: "Qualifying",
    description: "Extract performance.",
    image: "/assets/tracks/track-02.svg",
    steps: ["Lap comparison", "Sector analysis", "Qualifying simulations "],
  },
  {
    title: "Race",
    description: "Make it count.",
    image: "/assets/tracks/track-03.svg",
    steps: ["Live insight", "Strategy support", "Real-time AI engineer"],
  },
  {
    title: "Post-session",
    description: "Turn data into progress.",
    image: "/assets/tracks/track-04.svg",
    steps: ["Deep dive analysis", "Performance reports", "Historical trends"],
  },
];
