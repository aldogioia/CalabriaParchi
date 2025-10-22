import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidePage } from './guide-page';

describe('GuidePage', () => {
  let component: GuidePage;
  let fixture: ComponentFixture<GuidePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuidePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
