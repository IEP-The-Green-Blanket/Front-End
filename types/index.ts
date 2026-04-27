export type weather = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
};

export type StatusMessage = {
  message: string;
  type: "error" | "success";
};

export type Status = "safe" | "unsafe" | "dangerous";

export enum ReportSubject {
  pollution = "Pollution",
  quality = "Poor water quality",
  bloom = "Algae/Hyacinth bloom",
  other = "Other (specify)",
}

export enum ReportLocations {
  loc1 = "Schoemansville Waterfront",
  loc2 = "Kosmos Marina",
  loc3 = "Pecanwood Shore",
  loc4 = "Meerhof East Bank",
  loc5 = "Ifafi Inlet",
  loc6 = "Melodie Bay",
  loc7 = "Magalies River Mouth",
  loc8 = "Crocodile River Delta", 
  loc9 = "Cableway Point",
  loc10 = "Broederstroom Wetlands",
}

//analys
export type DataPoint = {
  x: string;
  ph: number;
  nitrates: number;
  phosphates: number;
  ec: number;
};

export type AnalyticsHistoryResponse = {
  count: number;
  dataPoints: DataPoint[];
};
