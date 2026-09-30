import type { Lenis } from './lenis/lenis';

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function smoothScrollTo(target: string | HTMLElement, options?: Parameters<Lenis['scrollTo']>[1]) {
  const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(element, options);
    return;
  }

  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function getLenisInstance() {
  return lenisInstance;
}
