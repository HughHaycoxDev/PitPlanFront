import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePlanAvailabilityComponent } from './race-plan-availability.component';

describe('RacePlanAvailabilityComponent', () => {
  let component: RacePlanAvailabilityComponent;
  let fixture: ComponentFixture<RacePlanAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacePlanAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacePlanAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
