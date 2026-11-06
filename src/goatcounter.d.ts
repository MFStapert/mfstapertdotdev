interface GoatCounter {
  count: (options: { path: string }) => void;
}

declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

export {};
