export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined;
}

export interface QueryParams extends PaginationParams, FilterParams {}

export interface IdParam {
  id: number | string;
}

export interface TeamIdParam {
  teamId: number | string;
}

export interface PlayerIdParam {
  playerId: number | string;
}

export interface MatchIdParam {
  matchId: number | string;
} 