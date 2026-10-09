export const appStatus = (e: { type: string }) => ({
  type: 'APP_STATUS_CHANGE',
  payload: e,
});
