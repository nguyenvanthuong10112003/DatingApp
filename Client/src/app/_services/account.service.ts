import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, map } from 'rxjs';
import { User } from '../_models/user';
import { enviroment } from '../../environments/environtment'
import { Member } from '../_models/member';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = enviroment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient, private presence: PresenceService) { 
  }
  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: any) => {
        this.setCurrentUser(response);
        this.presence.createHubConnection(response);
      }));
  }
  setCurrentUser(user: User) {
    if (user) {
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    }
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
  logout() {
    localStorage.removeItem('user');
    this.setCurrentUser(null!);
    this.presence.stopHubConnection();
  }
  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model);
  }
  getDecodedToken(token: any) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
