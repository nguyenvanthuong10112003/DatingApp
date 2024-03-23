import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Inject, inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (router, state) =>{
    return inject(AccountService).currentUser$.pipe(
      map(user => {
        if (user && user.roles.includes('Admin') || user.roles.includes('Moderator')) 
          return true;
        return false;
      })
    );
};
