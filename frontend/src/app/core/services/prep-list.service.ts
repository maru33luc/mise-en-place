import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { ApiResponse } from '@core/models/api-response.model';
import type { PrepTask } from '@core/models/work.model';

@Injectable({ providedIn: 'root' })
export class PrepListService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/prep-list`;
  getAll() { return this.http.get<ApiResponse<PrepTask[]>>(this.url); }
  create(task: Partial<PrepTask>) { return this.http.post<ApiResponse<PrepTask>>(this.url, task); }
  update(id: number, task: Partial<PrepTask>) { return this.http.put<ApiResponse<PrepTask>>(`${this.url}/${id}`, task); }
  delete(id: number) { return this.http.delete<ApiResponse<PrepTask>>(`${this.url}/${id}`); }
  clearDone() { return this.http.delete<ApiResponse<PrepTask[]>>(`${this.url}/done`); }
}
