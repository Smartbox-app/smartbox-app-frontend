export type LocationActivityStatus = 'inside' | 'outside';

export interface LocationActivityListItem {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  alarm: string;
  location: string;
  status: LocationActivityStatus;
  statusUpdate: Date;
}
