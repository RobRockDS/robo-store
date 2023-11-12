import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Category } from './../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.API_URL}/api/categories`;

  constructor(private http: HttpClient) {}

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit.toString());
      params = params.set('offset', offset.toString());
    }
    return this.http.get<Category[]>(`${this.apiUrl}`, { params });
  }
}
