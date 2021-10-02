import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

const tooltipKey = {};

export function initTooltip(tooltip = {}) {
  const store = writable(tooltip);
  setContext(tooltipKey, store);
  return store;
}

export function getTooltip() {
  const store = getContext(tooltipKey);

  return {
    update(tooltipProps) {
      store.update((tooltip) => ({ ...tooltip, ...tooltipProps }));
    },
  };
}
