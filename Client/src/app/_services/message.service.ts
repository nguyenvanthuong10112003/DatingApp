import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/environments/environtment';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, map, take } from 'rxjs';
import { Group } from '../_models/group';
import { Time } from '@angular/common';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = enviroment.apiUrl;
  hubUrl = enviroment.hubUrl;
  otherTimeSending: Date = new Date('2000-1-1')
  private hubConnection!: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient, private accountService: AccountService) { }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()
    this.hubConnection.start()
      .catch(error => console.log(error))
    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    })
    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message]);
      })
    });
    this.hubConnection.on('UpdateGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now())
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    })
    this.hubConnection.on('OtherSending', otherUsername => {
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
        if (user.username !== otherUsername)
          this.otherTimeSending = new Date(Date())
      })
      }
    )
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop()
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'message', params, this.http);
  }

  async sendMessage(username: string, content: string) {
    return this.hubConnection.invoke('SendMessage', {recipientUsername: username, content})
      .catch(error => console.log(error));
  }

  async sendInputMessage(username: string) {
    return this.hubConnection.invoke('OtherStartInput', username)
      .catch(error => console.log(error));
  }
 
  deleteMessage(id: number)
  {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}
