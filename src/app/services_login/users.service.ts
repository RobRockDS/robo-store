import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User,CreateUserDTO} from '../models/user.model';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.API_URL}/api/users`;
  constructor(private http:HttpClient) { }
  create(dto:CreateUserDTO){
    return this.http.post<CreateUserDTO>(this.apiUrl,dto);
  }
  getAll(){
    return this.http.get<User>(this.apiUrl);
  }
}
