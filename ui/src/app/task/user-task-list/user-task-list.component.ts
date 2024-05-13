import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyAuthServiceService } from 'src/app/service/my-auth-service.service';
import { TaskListDisplay, UserTask, UserTaskServiceService } from 'src/app/service/user-task-service.service';

@Component({
  selector: 'app-user-task-list',
  templateUrl: './user-task-list.component.html',
  styleUrls: ['./user-task-list.component.css']
})
export class UserTaskListComponent implements OnInit, OnDestroy {

  userTasks: UserTask[] = [];
  subscription: Subscription | undefined;

  displayOptions!: TaskListDisplay;
  displayOptionsSub: Subscription | undefined;

  constructor(readonly userTaskService: UserTaskServiceService, private myAuthService: MyAuthServiceService) { }


  ngOnInit(): void {

    console.debug('UserTaskListComponent.ngOnInit');
    this.displayOptionsSub = this.userTaskService.displayState$.subscribe(next => {
      this.displayOptions = next;
    });

    if (this.myAuthService.isAuth()) {
      this.filterAndSort(this.displayOptions.filteredBy, this.displayOptions.sortBy);
    }
    this.myAuthService.profiles$.subscribe(() => {
      this.filterAndSort(this.displayOptions.filteredBy, this.displayOptions.sortBy);
    });

  }



  filterAndSort(status: string, sortBy?: string, e?: Event) {

    if (e) {
      e.preventDefault();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    let newStatus = 'All';

    if (status && status != '') {
      newStatus = status;
    }

    let newSortBy = this.displayOptions.sortBy;
    if (sortBy) {
      newSortBy = sortBy;
    }

    this.userTaskService.updateDisplayState({
      filteredBy: newStatus,
      sortBy: newSortBy,
      sortOrder: this.displayOptions.sortOrder
    });

    this.subscription = this.userTaskService.getListOfTasks(this.displayOptions).subscribe((tasks: UserTask[]) => {
      this.userTasks = tasks;
    });


  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.displayOptionsSub) {
      this.displayOptionsSub.unsubscribe();
    }
  }

}
