import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribePage } from './unsubscribe-page';

describe('UnsubscribePage', () => {
  let component: UnsubscribePage;
  let fixture: ComponentFixture<UnsubscribePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnsubscribePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsubscribePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
