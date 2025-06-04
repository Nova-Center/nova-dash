export interface Service {
  id: number;
  title: string;
  description: string;
  date: string;
  ownerId: number;
  volunteerId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  meta: {
    total: number;
    perPage: number;
    currentPage: number | null;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
  data: Service[];
}
