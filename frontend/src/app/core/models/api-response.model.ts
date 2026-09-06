/** Error devuelto por la API con detalle por campo. */
export interface ApiError {
  field: string;
  message: string;
}

/** Envoltura estándar que devuelve el backend en todas las respuestas. */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: ApiError[];
}