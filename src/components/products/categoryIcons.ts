export const categoryIcons: Record<string, string> = {
  All: "apps",
  Smartphone: "smartphone",
  Audio: "headphones",
  Wearable: "watch",
  Laptop: "laptop_mac",
  Camera: "photo_camera",
  Gaming: "sports_esports",
  "Smart Home": "home",
  Accessories: "cable",
};

export function iconForCategory(category: string): string {
  return categoryIcons[category] ?? "devices";
}
