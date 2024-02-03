import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, map } from 'rxjs';
import { User } from '../_models/user';
import { enviroment } from '../../environments/environtment'
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = enviroment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }
  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: any) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.setCurrentUser(response);
      }));
  }
  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }
  logout() {
    localStorage.removeItem('user');
    this.setCurrentUser(null!);
  }
  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model);
  }
}
