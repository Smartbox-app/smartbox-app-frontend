/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_LOCAL?: string;
  readonly VITE_MOBILE_BUILD_ID?: string;
  readonly VITE_TENANT_LOGO_BASE_URL?: string;
}
