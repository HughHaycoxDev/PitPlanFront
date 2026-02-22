import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacePlanOverviewComponent } from './race-plan-overview.component';

describe('RacePlanOverviewComponent', () => {
  let component: RacePlanOverviewComponent;
  let fixture: ComponentFixture<RacePlanOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacePlanOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacePlanOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
