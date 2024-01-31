import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/AccountService';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private toastr: ToastrService, private router: Router) {}
  canActivate(): Observable<boolean>{
      return this.accountService.currentUser$.pipe(
        map(user => {
          if (user)
            return true
          this.toastr.error('You need to login!')
          return false;
        })
      )
  }
};

