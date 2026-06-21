import "@testing-library/jest-dom/vitest";

class ResizeObserverMock { observe() {} unobserve() {} disconnect() {} }
global.ResizeObserver = ResizeObserverMock;
global.PointerEvent = MouseEvent as typeof PointerEvent;
window.matchMedia = window.matchMedia ?? (() => ({ matches: false, media: "", onchange: null, addListener: () => undefined, removeListener: () => undefined, addEventListener: () => undefined, removeEventListener: () => undefined, dispatchEvent: () => false }));
