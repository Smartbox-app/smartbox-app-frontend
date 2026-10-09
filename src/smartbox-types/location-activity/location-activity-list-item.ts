export class LocationActivityListItem {
  id: string;

  userId: string;

  firstName: string;

  lastName: string;

  email: string;

  alarm: string;

  location: string;

  status: 'inside' | 'outside';

  statusUpdate: Date;
}
