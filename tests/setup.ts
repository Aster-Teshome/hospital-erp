import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement matchMedia; Ant Design's responsive components
// (Layout.Sider's breakpoint prop, Grid) need it even in a basic render.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
