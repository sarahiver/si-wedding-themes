// Kleine Test-Hilfe: führt einen Hook in einer echten React-Komponente aus.
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export async function renderHook(useHook) {
  const result = { current: null };
  function Probe() { result.current = useHook(); return null; }
  const el = document.createElement('div');
  const root = createRoot(el);
  await act(async () => { root.render(<Probe />); });
  return { result, unmount: () => act(() => root.unmount()) };
}

export const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 0)); });
export { act };
