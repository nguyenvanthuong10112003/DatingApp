import { Injectable, Pipe } from '@angular/core';
import { enviroment } from 'src/environments/environtment';
import { Member } from '../_models/member';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, of, pipe, take } from 'rxjs';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = enviroment.apiUrl;
  members: Member[] = [];
  membersMyLiked: Member[] = [];
  memberCache = new Map();
  user!: User;
  userParams!: UserParams;
  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      user => {
        this.user = user;
        this.userParams = new UserParams(user);
      }
    )
  }

  setDefault() {
    this.members = []
    this.membersMyLiked = []
  }

  setCacheDefault() {
    this.memberCache = new Map();
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'like/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize)
    params = params.append('predicate', predicate);

    return getPaginatedResult<Member[]>(this.baseUrl + 'like', params, this.http);
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'))
    if (response) {
      return of(response);
    } 

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);    

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response); 
        return response;
      }));
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((list, listItem) => list.concat(listItem.result), [])
      .find((item: Member) => item.userName === username)
    if (member) return of(member)
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
