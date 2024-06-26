import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() app: any

  registerMode = false;

  users: any

  constructor(public httpClient: HttpClient, public accountService: AccountService) {}

  ngOnInit(): void {
  }

  registerToggle() {
    this.registerMode = !this.registerMode
  }

  cancelRegister(event: boolean) {
    this.registerMode = event
  }
}
