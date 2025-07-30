import { ImageData } from "@/types/types";

export function getRandomPair(images: ImageData[]): [ImageData, ImageData] {
  if (images.length < 2) throw new Error("Need at least 2 images");

  // Shuffle images and pich the first
  const sorted = images.sort(() => 0.5 - Math.random());
  const base = sorted[0];

  // Find a second image with Elo within ±100, fallback to random
  const close = sorted.find(
    (img) => img.id !== base.id && Math.abs(img.elo - base.elo) < 100
  );

  const second = close ?? sorted.find((img) => img.id !== base.id)!;

  return [base, second];
}
