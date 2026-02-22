import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePlanScheduleComponent } from './race-plan-schedule.component';

describe('RacePlanScheduleComponent', () => {
  let component: RacePlanScheduleComponent;
  let fixture: ComponentFixture<RacePlanScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacePlanScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacePlanScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
