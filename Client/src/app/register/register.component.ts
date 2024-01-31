import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AppComponent } from '../app.component';
import { AccountService } from '../_services/AccountService';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  
})
export class RegisterComponent implements OnInit {
  @Output()
  cancelRegister = new EventEmitter()

  model: any = {};

  baseUrl = "https://5001/api"

  constructor(private accountService: AccountService, 
              private toastr: ToastrService) {}

  ngOnInit(): void {

  }

  register() {
    //validate
    if (!this.model.username || !this.model.password) {
      this.toastr.error('Username and password cannot be empty.')
      return;
    }
    if (this.model.password !== this.model.rePassword) {
      this.toastr.error('Password and repeat password are no match.')
      return;
    }
    //
    this.accountService.register(this.model).subscribe(
      response => {
        console.log(response)
        this.toastr.success('Register success.')
        this.cancel()
      }, error => {
        console.log(error)
        if (error.error && typeof(error.error) !== typeof({}))
          error = error.error;
        else
          error ='Register failer';
        this.toastr.error(error)
      }
    )
  }
  cancel() {
    this.cancelRegister.emit(false)
  }
 }
