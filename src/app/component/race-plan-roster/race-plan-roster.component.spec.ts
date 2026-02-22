import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePlanRosterComponent } from './race-plan-roster.component';

describe('RacePlanRosterComponent', () => {
  let component: RacePlanRosterComponent;
  let fixture: ComponentFixture<RacePlanRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacePlanRosterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacePlanRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
