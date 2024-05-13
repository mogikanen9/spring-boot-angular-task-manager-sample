import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaskCardComponent } from './user-task-card.component';

describe('UserTaskCardComponent', () => {
  let component: UserTaskCardComponent;
  let fixture: ComponentFixture<UserTaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTaskCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
