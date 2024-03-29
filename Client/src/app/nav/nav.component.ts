import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {}
  onSideBar: boolean = false

  constructor(public accountService: AccountService, 
              private router: Router, 
              private toastr: ToastrService, 
              private memberService: MembersService) 
  { }
  
  ngOnInit(): void {
  }

  login() {
    //validated
    if (!this.model.username || !this.model.password) {
      this.toastr.error('Username and password cannot be empty.')
      return;
    }
    this.accountService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/members');
      console.log(response)
      this.toastr.success('Loggin success.')
    }, error => {
      console.log(error)
      if (error.error && typeof(error.error) !== typeof({}))
        error = error.error;
      else
        error ='Login failer';
      this.toastr.error(error)
    })

    this.onSideBar = false
  }

  logout() {
    this.accountService.logout()
    this.router.navigateByUrl('/')
    this.memberService.setDefault()
    this.memberService.setCacheDefault() 
  }

  toggleSideBar() {
    this.onSideBar = !this.onSideBar
  }
}
