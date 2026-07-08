export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  message: string;
  data: T;
  errors?: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  property: string;
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  timestamp: string;
  path: string;
}