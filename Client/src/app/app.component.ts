import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static buttonItems = {accept: 'accept', cancel: 'cancel'}
  title = 'Client';
  constructor(private http: HttpClient, private accountService: AccountService) {}
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    if (localStorage.getItem('user')) {
      const user: User = JSON.parse(localStorage.getItem('user')!);
      if (user) 
        this.accountService.setCurrentUser(user);
    }
  }
}
