import { useCallback, useEffect, useState, useTransition } from "react";

/**
 * Shared "run this async effect on a dependency change, guard a stale run
 * whose result arrives after a newer one started, and expose a manual
 * refetch trigger" wiring — the part that was identical, verbatim, across
 * useProducts/useProduct/useStoreConfig/useBundles/usePromos. Each of those
 * hooks still owns its own state shape, guard conditions, and error/reset
 * behavior via its own `effect` callback; this only removes the duplicated
 * effect/cleanup/transition/trigger scaffolding around them — no caching,
 * no shared data, no change to any hook's external contract.
 */
export function useFetchEffect(
  effect: (cancelled: () => boolean) => Promise<void> | void,
  deps: React.DependencyList,
): { isPending: boolean; refetch: () => void } {
  const [trigger, setTrigger] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      await effect(() => cancelled);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, trigger]);

  const refetch = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  return { isPending, refetch };
}
