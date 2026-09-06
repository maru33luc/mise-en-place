import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { ApiResponse } from '@core/models/api-response.model';
import type { DailyMenu } from '@core/models/work.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/menu`;
  getAll() { return this.http.get<ApiResponse<DailyMenu[]>>(this.url); }
  get(date: string) { return this.http.get<ApiResponse<DailyMenu>>(`${this.url}/${date}`); }
  save(menu: DailyMenu) { return this.http.put<ApiResponse<DailyMenu>>(`${this.url}/${menu.date}`, menu); }
}
