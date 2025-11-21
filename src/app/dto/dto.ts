export interface ResponseSchema<T = any> {
  message?: string;
  data?: T;
  error?: any;
}
