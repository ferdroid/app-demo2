import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { HttpHeaders, HttpParams } from '@angular/common/http';

interface ApiOptions {
  headers?: HttpHeaders | Record<string, string>;
  params?: HttpParams | Record<string, string | number | boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly httpClient = inject(HttpClient);

  get<T>(url: string, options?: ApiOptions) {
    return this.httpClient.get<T>(url, options);
  }

  post<T>(url: string, body: unknown, options?: ApiOptions) {
    return this.httpClient.post<T>(url, body, options);
  }

  put<T>(url: string, body: unknown, options?: ApiOptions) {
    return this.httpClient.put<T>(url, body, options);
  }

  delete<T>(url: string, options?: ApiOptions) {
    return this.httpClient.delete<T>(url, options);
  }
}
