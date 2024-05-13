import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export enum ErrorType {
  GENERIC, //0
  ACCESS_DENIED //1
}

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  paramSub!: Subscription;

  errorTypeDisplayed: ErrorType = ErrorType.GENERIC;


  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // check if edit mode and if it is load and prepopulate data
    this.paramSub = this.route.paramMap.subscribe(params => {
      const errorType = params.get('errorType');
      console.debug('errorType->',errorType);

      if (errorType?.toString() == 'access_denied') {
        this.errorTypeDisplayed = ErrorType.ACCESS_DENIED;
      }

    });
  }

}
