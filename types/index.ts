export type weather = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
};

export type StatusMessage = {
  message: string;
  type: 'error' | 'success';
};

export enum ReportSubject {
  pollution = "Pollution",
  quality = "Poor water quality",
  bloom = "Algae/Hyacinth bloom",
  other = "Other (specify)"
};