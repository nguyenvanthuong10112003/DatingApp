import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Member } from "../_models/member";
import { Observable, throwError } from "rxjs";
import { MembersService } from "../_services/members.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {
    
    constructor(private memberService: MembersService) {
    }
    
    resolve(route: ActivatedRouteSnapshot): Observable<Member> {
        return this.memberService.getMember(route.paramMap.get('username') || "");
    }
}