import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTaskCreateUpdateComponent } from './user-task-create-update.component';

describe('UserTaskCreateUpdateComponent', () => {
  let component: UserTaskCreateUpdateComponent;
  let fixture: ComponentFixture<UserTaskCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTaskCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTaskCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
