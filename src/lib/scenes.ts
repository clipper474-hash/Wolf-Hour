/** Ambient live-background scenes. Self-hosted, encoded to a uniform light
 *  profile (CRF23 / ~9M cap / 1080p24) for smooth simultaneous decode during
 *  the crossfade. Seed set; expands into the theme engine later. */
export type Scene = {
  id: string;
  label: string;
  src: string;
  poster: string;
  /** dominant palette hint (for text-on / theming) */
  tone: "dark" | "light";
};

export const SCENES: Scene[] = [
  { id: "misty-torii", label: "Misty Torii", src: "/scenes/misty-torii.mp4", poster: "/scenes/posters/misty-torii.jpg", tone: "dark" },
  { id: "lake-cabin", label: "Lake Cabin", src: "/scenes/lake-cabin.mp4", poster: "/scenes/posters/lake-cabin.jpg", tone: "light" },
  { id: "lofi-study", label: "Lofi Study", src: "/scenes/lofi-study.mp4", poster: "/scenes/posters/lofi-study.jpg", tone: "light" },
  { id: "golden-hour", label: "Golden Hour", src: "/scenes/golden-hour.mp4", poster: "/scenes/posters/golden-hour.jpg", tone: "dark" },
  { id: "still-water", label: "Still Water", src: "/scenes/still-water.mp4", poster: "/scenes/posters/still-water.jpg", tone: "dark" },
  { id: "azure-horizon", label: "Azure Horizon", src: "/scenes/azure-horizon.mp4", poster: "/scenes/posters/azure-horizon.jpg", tone: "light" },
  // Anime-style lofi scenes (hand-picked, watermark-clean)
  { id: "summer-sea", label: "Summer Sea", src: "/scenes/summer-sea.mp4", poster: "/scenes/posters/summer-sea.jpg", tone: "light" },
  { id: "green-valley", label: "Green Valley", src: "/scenes/green-valley.mp4", poster: "/scenes/posters/green-valley.jpg", tone: "light" },
  { id: "hidden-temple", label: "Hidden Temple", src: "/scenes/hidden-temple.mp4", poster: "/scenes/posters/hidden-temple.jpg", tone: "dark" },
  { id: "neon-rain-stop", label: "Neon Rain", src: "/scenes/neon-rain-stop.mp4", poster: "/scenes/posters/neon-rain-stop.jpg", tone: "dark" },
  { id: "meteor-dusk", label: "Meteor Dusk", src: "/scenes/meteor-dusk.mp4", poster: "/scenes/posters/meteor-dusk.jpg", tone: "dark" },
];

export const DEFAULT_SCENE = SCENES[0];
