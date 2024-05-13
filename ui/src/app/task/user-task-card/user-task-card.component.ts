import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserTask } from 'src/app/service/user-task-service.service';

@Component({
  selector: 'app-user-task-card',
  templateUrl: './user-task-card.component.html',
  styleUrls: ['./user-task-card.component.css']
})
export class UserTaskCardComponent implements OnInit {

  @Input() userTask!: UserTask;

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  navigateToDetails():void{
    this.router.navigate(["/details/"+this.userTask.id]);
  }

}
