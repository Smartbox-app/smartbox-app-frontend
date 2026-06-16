const isLocalEnvironment = () =>
  import.meta.env.DEV || import.meta.env.VITE_IS_LOCAL === 'true';

export { isLocalEnvironment };
