const done = new Set<string>();
const listeners = new Set<() => void>();

export function markBaked(id: string) {
  done.add(id);
  for (const l of listeners) l();
}

export const bakedCount = () => done.size;

export function onBake(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
