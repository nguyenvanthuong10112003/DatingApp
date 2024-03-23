import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (router, state) => {
  return inject(AccountService).currentUser$.pipe(
    map(user => {
      return user ? true : false
    })
  )
}


