import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNew } from './event-new';

describe('EventNew', () => {
  let component: EventNew;
  let fixture: ComponentFixture<EventNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventNew],
    }).compileComponents();

    fixture = TestBed.createComponent(EventNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
