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