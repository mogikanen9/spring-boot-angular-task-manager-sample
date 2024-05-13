import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UserTask, UserTaskServiceService } from 'src/app/service/user-task-service.service';

@Component({
  selector: 'app-user-task-view',
  templateUrl: './user-task-view.component.html',
  styleUrls: ['./user-task-view.component.css']
})
export class UserTaskViewComponent implements OnInit, OnDestroy {

  userTaskSub!: Subscription;
  paramSub!: Subscription;
  userTaskDel!: Subscription;
  modelHiddenSub!: Subscription;

  userTask!: UserTask;

  @ViewChild('successRemovedModal')
  successRemovedModal!: TemplateRef<any>;
  modalRef?: BsModalRef;

  constructor(private userTaskService: UserTaskServiceService, private route: ActivatedRoute,
    private router: Router, private modalService: BsModalService) { }


  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const userTaskId = Number(params.get('userTaskId'));
      this.loadUserTask(userTaskId);
    });

    this.modelHiddenSub = this.modalService.onHidden.subscribe(() => {
      this.router.navigate(['/']);
    })

  }

  loadUserTask(userTaskId: number): void {

    this.userTaskSub = this.userTaskService.getTask(userTaskId).subscribe((data) => {
      this.userTask = data;
    }
    );
  }

  deleteUserTask(userTaskId: number): void {

    this.modalService.show(this.successRemovedModal);

    this.userTaskDel = this.userTaskService.deleteTask(userTaskId).subscribe({
      complete: ()=>{
        console.log('Item deleted successfully:');
        this.modalRef = this.modalService.show(this.successRemovedModal);
      },
      error: ()=>{
        console.error('Error occurred while deleting item:');
      }
    }
    );
  }

  closeDelSuccessDlg(): void {
    console.debug('close success dlg called');
    //this.modalRef?.hide();
    this.modalService.hide();
  }

  editUserTask(userTaskId: number) {
    this.router.navigate(['/update/' + userTaskId]);
  }

  markComplete(userTaskId: number): void {
    console.debug('markComplete called');
    this.userTaskService.completeTask(userTaskId).subscribe((rs) => {
      console.log('execution->', rs);
      this.loadUserTask(userTaskId);
    });

  }

  ngOnDestroy(): void {

    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }

    if (this.userTaskSub) {
      this.userTaskSub.unsubscribe();
    }

    if (this.userTaskDel) {
      this.userTaskDel.unsubscribe();
    }

    if (this.modelHiddenSub) {
      this.modelHiddenSub.unsubscribe();
    }
  }
}
