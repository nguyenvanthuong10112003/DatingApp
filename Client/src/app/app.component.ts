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
  alertDetail: any
  urlAPI = 'https://localhost:5001/';
  title = 'Client';
  res: any;
  constructor(private http: HttpClient, private accountService: AccountService) {}
  ngOnInit(): void {
    this.setCurrentUser();
    this.initAlert();
  }

  initAlert() {
    this.alertDetail = {}
    this.alertDetail.message = ""
    this.alertDetail.buttons = []
    this.alertDetail.htmlContent = ""
    this.alertDetail.isShow = false
    this.alertDetail.accept = () => {}
  }

  setCurrentUser() {
    if (localStorage.getItem('user')) {
      const user: User = JSON.parse(localStorage.getItem('user')!);
      if (user) 
        this.accountService.setCurrentUser(user);
    }
  }
}
