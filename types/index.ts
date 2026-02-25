export enum GezondheidsStatus {
  Gezond = "GEZOND",
  herstellen = "HERSTEL",
  Ziek = "ZIEK",
}

export type Dier = {
  id?: number;
  naam: string;
  geboorteDatum: Date;
  gezondheidsStatus: GezondheidsStatus;
  soort: Soort;
  verborgen?: boolean; // Verborgen om te kijken of het dier getoont mag worden of niet.
};

export type UserRol = "ADMIN" | "WERKNEMER" | "USER";

export type User = {
  id: number;
  verantwoordelijkheden: any;
  naam: string;
  email: string;
  rol: UserRol;
  favorieten: Dier[];
  verantwoordelijkVoor?: Dier[]; // Dit mag leeg zijn dus als de user geen medewerker is blijft de lijst leeg.
};

export type registerUser = {
  naam: string;
  email: string;
  passwoord: string;
};

export type updateUser = {
  id: number;
  naam: string;
  email: string;
  passwoord: string;
};

export type loginInfo = {
  username: string;
  passwoord: string;
};

export type Soort = {
  id?: number;
  naam: string;
  diet: string;
  dieren: Dier[];
};

export type StatusMessage = {
  message: string;
  type: "error" | "success";
};

export enum TicketType {
  SENIOOR = "SENIOOR",
  KIND = "KIND",
  VOLWASSEN = "VOLWASSEN"
};

export type Ticket = {
  id?: number,
  datum: string,
  isVIP: boolean,
  price: number,
  ticketOwner: string;
};

export type CreateTicket = {
  datum: string;
  isVIP: boolean;
  ticketType: TicketType;
};
