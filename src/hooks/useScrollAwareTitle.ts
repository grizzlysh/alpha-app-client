import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { setScrollAwareTitleEnabled, setHeaderShowPageTitle } from "@/store/uiSlice";
import type { AppDispatch } from "@/store";

/**
 * Opt a page into scroll-aware header title mode.
 *
 * Attach the returned ref to the page's <h2>. While the h2 is visible below
 * the sticky header the header hides its own title. Once the h2 scrolls behind
 * the 64 px bar the header title fades in. Cleans up automatically on unmount.
 */
export function useScrollAwareTitle(): React.RefObject<HTMLHeadingElement | null> {
  const dispatch = useDispatch<AppDispatch>();
  const ref = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    dispatch(setScrollAwareTitleEnabled(true));
    const el = ref.current;
    if (!el) {
      return () => {
        dispatch(setScrollAwareTitleEnabled(false));
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => dispatch(setHeaderShowPageTitle(!entry.isIntersecting)),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      dispatch(setScrollAwareTitleEnabled(false));
      dispatch(setHeaderShowPageTitle(false));
    };
  }, [dispatch]);

  return ref;
}
