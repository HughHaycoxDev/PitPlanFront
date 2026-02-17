import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePlanComponent } from './race-plan.component';

describe('RacePlanComponent', () => {
  let component: RacePlanComponent;
  let fixture: ComponentFixture<RacePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacePlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
