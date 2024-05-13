import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UserTask, UserTaskServiceService } from 'src/app/service/user-task-service.service';

interface SubmitResult {
  status: boolean;
  message: string;
}

@Component({
  selector: 'app-user-task-create-update',
  templateUrl: './user-task-create-update.component.html',
  styleUrls: ['./user-task-create-update.component.css']
})
export class UserTaskCreateUpdateComponent implements OnInit, OnDestroy {

  taskForm!: FormGroup;
  priorityOptionValues = ['HIGH', 'MEDIUM', 'LOW'];
  statusOptionValues = ['CREATED', 'WIP', 'COMPLETE', 'DEFERRED'];

  editMode: boolean = false;
  userTaskToUpdate: UserTask | undefined;

  paramSub!: Subscription;
  userTaskSub!: Subscription;

  private datePipe: DatePipe = new DatePipe('en-CA');

  @ViewChild('successCreatedUpdatedModal')
  successModal!: TemplateRef<any>;

  @ViewChild('errorCreatedUpdatedModal')
  errorModal!: TemplateRef<any>;

  modalRef?: BsModalRef;

  constructor(private formBuilder: FormBuilder, private userTaskService: UserTaskServiceService,
    private route: ActivatedRoute, private modalService: BsModalService,
    private router: Router) { }


  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      dueDate: [''],
      priority: [this.priorityOptionValues[1], Validators.required],
      status: [this.statusOptionValues[0], Validators.required]
    });


    // Subscribe to touch events
    this.taskForm.valueChanges.subscribe(() => {

      if (!this.editMode) {
        //this.submitResult = undefined;
      }
    });

    // check if edit mode and if it is load and prepopulate data
    this.paramSub = this.route.paramMap.subscribe(params => {
      const userTaskId = Number(params.get('userTaskId'));

      if (userTaskId > 0) {
        this.loadUserTask(userTaskId);
      }

    });
  }

  loadUserTask(userTaskId: number) {
    this.userTaskSub = this.userTaskService.getTask(userTaskId).subscribe((data) => {
      const userTask: UserTask = data;

      this.taskForm.get('title')?.setValue(userTask.title);
      this.taskForm.get('desc')?.setValue(userTask.desc);
      this.taskForm.get('status')?.setValue(userTask.status);
      this.taskForm.get('priority')?.setValue(userTask.priority);
      this.taskForm.get('dueDate')?.setValue(userTask.dueDate);
      console.debug("userTask.dueDate->",userTask.dueDate);

      this.editMode = true;
      this.userTaskToUpdate = userTask;
    }
    );
  }

  onSubmit(): void {
    console.debug(this.taskForm.value);


    // Trigger validation on all form controls
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched({ onlySelf: true });
    });


    if (this.taskForm.valid) {

      const dueDate: Date = this.taskForm?.get('dueDate')?.value;
      console.debug('dueDate->', dueDate);

      const formattedDate: string | null = this.datePipe.transform(dueDate, 'yyyy-MM-dd');


      const ut: UserTask = {
        title: this.taskForm?.get('title')?.value,
        desc: this.taskForm?.get('desc')?.value,
        dueDate: formattedDate ? formattedDate : '1999-01-01',
        priority: this.taskForm?.get('priority')?.value,
        status: this.taskForm?.get('status')?.value,
        id: (this.editMode && this.userTaskToUpdate) ? this.userTaskToUpdate?.id : 0,
        created: ''
      };


      if (this.editMode) {
        this.userTaskService.updateTask(ut).subscribe((resp) => {
          console.log(resp?.status);

          this.modalRef = this.modalService.show(this.successModal);

        }, (error) => {
          console.error(error?.status);

          this.modalRef = this.modalService.show(this.errorModal);
        });
      } else {
        this.userTaskService.createTask(ut).subscribe((resp) => {
          console.log(resp?.status);
          this.modalRef = this.modalService.show(this.successModal);

          this.taskForm.reset('', { emitEvent: false });
          this.taskForm.get('priority')?.setValue(this.priorityOptionValues[1]);
          this.taskForm.get('status')?.setValue(this.statusOptionValues[0]);

        }, (error) => {
          console.error(error?.status);
          this.modalRef = this.modalService.show(this.errorModal);
        });
      }

    }

  }

  closeAndBacktoCreate(): void {
    this.modalRef?.hide();
    //this.modalService.hide();
  }

  closeAndBacktoList(): void {
    this.modalRef?.hide();
    //this.modalService.hide();

    this.router.navigate(['/list']);
  }

  ngOnDestroy(): void {
    if (this.paramSub) {
      this.paramSub.unsubscribe();
    }

    if (this.userTaskSub) {
      this.userTaskSub.unsubscribe();
    }
  }
}
