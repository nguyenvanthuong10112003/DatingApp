import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  constructor(private accountService: AccountService, private toastr: ToastrService, private router: Router) {}
  canActivate(): Observable<boolean>{
      return this.accountService.currentUser$.pipe(
        map(user => {
          if (user && user.roles.includes('Admin') || user.roles.includes('Moderator')) 
          {
            return true;
          }
          this.toastr.error('You cannot enter this area!')
          return false;
        })
      )
  }
};

