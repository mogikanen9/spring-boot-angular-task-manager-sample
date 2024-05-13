import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserTaskListComponent } from './task/user-task-list/user-task-list.component';
import { UserTaskViewComponent } from './task/user-task-view/user-task-view.component';
import { UserTaskCreateUpdateComponent } from './task/user-task-create-update/user-task-create-update.component';
import { MyAuthGuardGuard } from './guard/my-auth-guard.guard';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '', pathMatch: "full", component: HomeComponent },
  { path: 'redirect', component: HomeComponent },
  { path: 'list', component: UserTaskListComponent, canActivate: [MyAuthGuardGuard] },
  { path: 'details/:userTaskId', component: UserTaskViewComponent, canActivate: [MyAuthGuardGuard] },
  { path: 'create', component: UserTaskCreateUpdateComponent, canActivate: [MyAuthGuardGuard] },
  { path: 'update/:userTaskId', component: UserTaskCreateUpdateComponent, canActivate: [MyAuthGuardGuard] },
  { path: 'error/:errorType', component: ErrorComponent },
  { path: 'error/', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
