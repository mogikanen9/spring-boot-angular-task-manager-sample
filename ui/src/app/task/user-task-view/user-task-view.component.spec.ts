import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaskViewComponent } from './user-task-view.component';

describe('UserTaskViewComponent', () => {
  let component: UserTaskViewComponent;
  let fixture: ComponentFixture<UserTaskViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTaskViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
