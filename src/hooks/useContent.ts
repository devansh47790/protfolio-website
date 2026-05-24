/*
  A tiny hook that runs an async loader once and returns { data, loading }.

  Pages use it like:
      const { data: projects } = useContent(getProjects);

  When you eventually swap the static data layer for Sanity, this hook stays
  the same. It exists to centralise the "show a skeleton while we wait" rule
  so we don't litter every page with useEffect/useState boilerplate.
*/
import { useEffect, useState } from 'react';

export function useContent<T>(loader: () => Promise<T>, initial: T): { data: T; loading: boolean };
export function useContent<T>(loader: () => Promise<T>): { data: T | null; loading: boolean };
export function useContent<T>(loader: () => Promise<T>, initial?: T) {
  const [data, setData] = useState<T | null>(initial ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loader().then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
    // We intentionally only run on mount per page. The loader function is
    // a stable reference exported from cms.ts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}
