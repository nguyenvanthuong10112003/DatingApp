import { Injectable } from '@angular/core';
import { enviroment } from 'src/environments/environtment';
import { Member } from '../_models/member';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = enviroment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  setDefault() {
    this.members = []
  }

  getMembers() {
    if (this.members.length > 0) return of(this.members)
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
        map(members => {
          this.members = members;
          return members;
        })
      );
  }

  getMember(username: string) {
    const member = this.members.find(item => item.userName == username);
    if (member !== undefined) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.findIndex(item => item.id === member.id)
        this.members[index] = member
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + `users/delete-photo/${photoId}`);
  }
}
