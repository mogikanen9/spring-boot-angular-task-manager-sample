import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyAuthServiceService } from './service/my-auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  profileFullName: string | undefined;

  profileSub!: Subscription;

  constructor(private myAuthServiceService: MyAuthServiceService) {
    this.myAuthServiceService.configure();
    this.profileSub = this.myAuthServiceService.profiles$.subscribe((profile) => {
      this.profileFullName = profile.fullName;
    })
  }

  ngOnInit(): void {
    console.debug("AppComponent.onInit");
  }

  ngOnDestroy(): void {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

  public login() {
    this.myAuthServiceService.login();
  }

  public logout() {
    this.myAuthServiceService.logout();
  }

  public isAuth(): boolean {
    return this.myAuthServiceService.isAuth();
  }
}
