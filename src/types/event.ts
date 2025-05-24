export interface Participant {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  novaPoints: number;
  role: "user" | "admin";
  isBanned: boolean;
  banReason: string | null;
}

export interface Event {
  id: number;
  userId: number;
  title: string;
  image: string;
  description: string;
  maxParticipants: number;
  location: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface EventsResponse {
  meta: PaginationMeta;
  data: Event[];
}
