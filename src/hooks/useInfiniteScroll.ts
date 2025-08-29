import { useEffect, useRef, useCallback, useMemo } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "100px",
  threshold = 0.1,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const observerOptions = useMemo(
    () => ({
      rootMargin,
      threshold,
    }),
    [rootMargin, threshold]
  );

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      ...observerOptions,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver, observerOptions]);

  return sentinelRef;
};
