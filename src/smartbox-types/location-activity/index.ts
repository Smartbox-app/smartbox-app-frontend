export type LocationActivityEntity = {
  userId: string;
  alarm: string;
  location: string;
  status: 'inside' | 'outside';
  statusUpdate: Date;
};

export type LocationActivityStatus = 'inside' | 'outside';

export * from 'src/smartbox-types/location-activity/location-activity-list-item';
