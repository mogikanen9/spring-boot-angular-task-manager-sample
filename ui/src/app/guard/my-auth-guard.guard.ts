import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { MyAuthServiceService } from '../service/my-auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class MyAuthGuardGuard {

  constructor(private myAuthServiceService: MyAuthServiceService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.debug("MyAuthGuardGuard->canActivate");

    let rs = false;

    if (this.myAuthServiceService.isAuth()) {

      if (this.myAuthServiceService.hasTaskApiAccess()) {
        rs = true;
      } else {
        return this.router.parseUrl('error/access_denied');
      }

    } else {
      this.myAuthServiceService.login();
    }

    console.debug("MyAuthGuardGuard->canActivate->rs", rs);

    return rs;

  }

}
