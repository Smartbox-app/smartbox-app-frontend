declare global {
  interface Window {
    __MOBILE_BUILD_ID__?: string;
  }
}

export const getMobileBuildId = (): string | undefined => {
  const fromEnv = import.meta.env.VITE_MOBILE_BUILD_ID;
  if (fromEnv) return fromEnv;

  if (typeof window !== 'undefined' && window.__MOBILE_BUILD_ID__) {
    return window.__MOBILE_BUILD_ID__;
  }

  return undefined;
};
