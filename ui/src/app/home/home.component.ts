import { Component, OnInit } from '@angular/core';
import { MyAuthServiceService } from '../service/my-auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private myAuthService: MyAuthServiceService, private router: Router) { }

  ngOnInit(): void {
    if (this.isAuth()) {
      this.router.navigate(['/list']);
    }
  }

  public accessDashboard():void{
    this.router.navigate(['/list']);
  }

  public isAuth(): boolean {
    return this.myAuthService.isAuth();
  }

  public login(): void {
    this.myAuthService.login();
  }
}
