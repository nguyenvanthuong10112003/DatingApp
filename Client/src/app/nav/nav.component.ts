import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/AccountService';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AlertComponent } from '../alert/alert.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() app: any
  model: any = {}
  constructor(public accountService: AccountService) { }
  ngOnInit(): void {
  }
  login() {
    //validated
    if (!this.model.username || !this.model.password) {
      this.app.onAlert({
        buttons: [AppComponent.buttonItems.accept],
        message: "Username and password cannot be empty."
      })
      return;
    }
    this.accountService.login(this.model).subscribe(response => {
      console.log(response)
    }, error => {
      console.log(error)
      if (error.error && typeof(error.error) !== typeof({}))
        error = error.error;
      else
        error ='Login failer';
      this.app.onAlert({
          buttons: [AppComponent.buttonItems.accept],
          message:  error
      })
    })
  }
  logout() {
    this.accountService.logout()
  }
}
