import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AppComponent } from '../app.component';
import { AccountService } from '../_services/AccountService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  
})
export class RegisterComponent implements OnInit {
  @Input()
  home: any

  @Input() 
  app: any

  @Input() 
  usersFromHome: any

  model: any = {};

  baseUrl = "https://5001/api"

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {

  }

  register() {
    //validate
    if (!this.model.username || !this.model.password) {
      this.app.onAlert({
        buttons: [AppComponent.buttonItems.accept],
        message: "Username and password cannot be empty."
      })
      return;
    }
    if (this.model.password !== this.model.rePassword) {
      this.app.onAlert({
        buttons: [AppComponent.buttonItems.accept],
        message: "Password and repeat password are no match."
      })
      return;
    }
    //
    this.accountService.register(this.model).subscribe(
      response => {
        console.log(response)
        this.app.onAlert({
          buttons: [AppComponent.buttonItems.accept],
          message: "Register complete.",
          accept: () => { this.home.registerMode = false }
        })
      }, error => {
        console.log(error)
        if (error.error && typeof(error.error) !== typeof({}))
          error = error.error;
        else
          error ='Register failer';
        this.app.onAlert({
          buttons: [AppComponent.buttonItems.accept],
          message:  error
        })
      }
    )
  }
  cancel() {
    this.home.cancelRegister()
  }
 }
