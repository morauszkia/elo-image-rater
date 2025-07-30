import { ImageData } from "@/types/types";

export function getUniqueCategories(images: ImageData[]) {
  const categoriesSet = new Set<string>();
  for (const img of images) {
    const { categories } = img;
    for (const category of categories) {
      categoriesSet.add(category);
    }
  }
  return Array.from(categoriesSet).sort();
}

export function filterByCategory(
  images: ImageData[],
  selectedCategory: string
) {
  return images.filter((img) => img.categories.includes(selectedCategory));
}
