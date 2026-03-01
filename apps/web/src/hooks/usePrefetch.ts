import { useCallback } from "react";
import { useFoodStore } from "../stores/foodStore";
import { useAdditiveStore } from "../stores/additiveStore";
import { useCategoryStore } from "../stores/categoryStore";

/**
 * Returns a prefetch handler: call with a path to eagerly load store data.
 * Use on onMouseEnter / onTouchStart of links.
 */
export function usePrefetch() {
  const prefetchFood = useFoodStore(s => s.prefetchFood);
  const prefetchAdditive = useAdditiveStore(s => s.prefetchAdditiveDetail);
  const fetchCategories = useCategoryStore(s => s.fetchCategories);
  const fetchCategoryAllFoods = useCategoryStore(s => s.fetchCategoryAllFoods);

  return useCallback((path: string) => {
    const foodMatch = path.match(/^\/food\/(.+)$/);
    if (foodMatch) {
      prefetchFood(decodeURIComponent(foodMatch[1]));
      return;
    }
    const addMatch = path.match(/^\/additive\/(.+)$/);
    if (addMatch) {
      prefetchAdditive(decodeURIComponent(addMatch[1]));
      return;
    }
    const catMatch = path.match(/^\/category\/(.+)$/);
    if (catMatch) {
      fetchCategories();
      fetchCategoryAllFoods(decodeURIComponent(catMatch[1]));
      return;
    }
    if (path === "/categories") {
      fetchCategories();
    }
  }, [prefetchFood, prefetchAdditive, fetchCategories, fetchCategoryAllFoods]);
}
