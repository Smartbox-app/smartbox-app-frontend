export interface SingleNotification {
  type: 'success' | 'error';
  text: string;
  id?: string;
}
