import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../environments/environment';
import { MyAuthServiceService } from './my-auth-service.service';


export enum TaskPriority {
  HIGH, MEDIUM, LOW
}

export enum TaskStatus {
  CREATED, WIP, COMPLETE, DEFERRED
}

export interface UserTask {
  id: number;
  title: string;
  desc: string;
  created: string;
  dueDate: string;
  priority: TaskPriority,
  status: TaskStatus
}

export interface TaskListDisplay {

  filteredBy: string;
  sortBy: string;
  sortOrder: string;

}

@Injectable({
  providedIn: 'root'
})



export class UserTaskServiceService {

  /*  userTasks: UserTask[] = [
     {
       "id": 1,
       "title": "My Title 1",
       "desc": "My Desc 11",
       "due": "2025-01-01",
       "created": "2024-01-01 02:02:23",
       "priority": TaskPriority.MEDIUM,
       "status": TaskStatus.CREATED
     },
     {
       "id": 2,
       "title": "My Title 2",
       "desc": "My Desc 22",
       "due": "2025-01-01",
       "created": "2024-01-01 02:02:23",
       "priority": TaskPriority.MEDIUM,
       "status": TaskStatus.CREATED
     }
   ]; */

  private _displayState: BehaviorSubject<TaskListDisplay> = new BehaviorSubject<TaskListDisplay>({
    filteredBy: "All",
    sortBy: "date",
    sortOrder: "asc"
  });

  public displayState$: Observable<TaskListDisplay> = this._displayState.asObservable();

  private accessToken!: string;

  constructor(private http: HttpClient, private myAuthService: MyAuthServiceService) {

    this.myAuthService.profiles$.subscribe(profile => {
      this.accessToken = profile.accessToken;
      console.debug('token for service ->', profile.accessToken);
    });

  }

  updateDisplayState(newDisplayState: TaskListDisplay): void {
    this._displayState.next(newDisplayState);
  }

  //TODO: combine all getListOfTaks methods

  /* getListOfTasks(): Observable<UserTask[]> {
    //return of(this.userTasks);
    return this.http.get<UserTask[]>('http://localhost:8080/api/task');
  } */


  getHttpHeaders(): HttpHeaders {

    console.debug("getHttpHeaders()->this.accessToken->", this.accessToken);

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken
    });
  }

  getListOfTasks(displayOption: TaskListDisplay): Observable<UserTask[]> {

    const httpOptions = {
      headers: this.getHttpHeaders()
    };

    //return of(this.userTasks);
    if (displayOption.filteredBy == 'All') {
      return this.http.get<UserTask[]>(environment.taskApiBaseUrl + `?sortBy=${displayOption.sortBy}&sortOrder=${displayOption.sortOrder}`, httpOptions);
    } else {
      return this.http.get<UserTask[]>(environment.taskApiBaseUrl + `?statusFilter=${displayOption.filteredBy}&sortBy=${displayOption.sortBy}&sortOrder=${displayOption.sortOrder}`, httpOptions);
    }
  }

  getTask(taskId: number): Observable<UserTask> {
    const httpOptions = {
      headers: this.getHttpHeaders()
    };
    return this.http.get<UserTask>(environment.taskApiBaseUrl + `/${taskId}`, httpOptions);
  }

  createTask(userTask: UserTask): Observable<any> {
    const httpOptions = {
      headers: this.getHttpHeaders()
    };
    return this.http.post<any>(environment.taskApiBaseUrl, JSON.stringify(userTask), httpOptions);
  }

  deleteTask(taskId: number): Observable<any> {
    const httpOptions = {
      headers: this.getHttpHeaders()
    };
    return this.http.delete<UserTask>(environment.taskApiBaseUrl + `/${taskId}`, httpOptions);
  }

  updateTask(userTask: UserTask): Observable<any> {
    const httpOptions = {
      headers: this.getHttpHeaders()
    };
    return this.http.put<any>(environment.taskApiBaseUrl, JSON.stringify(userTask), httpOptions);
  }

  completeTask(taskId: number) {
    const httpOptions = {
      headers: this.getHttpHeaders()
    };
    const body = {};
    return this.http.patch<any>(environment.taskApiBaseUrl + `/complete/${taskId}`, body, httpOptions);
  }
}
