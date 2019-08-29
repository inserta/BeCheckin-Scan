import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HuespedPage } from './huesped.page';

describe('HuespedPage', () => {
  let component: HuespedPage;
  let fixture: ComponentFixture<HuespedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HuespedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HuespedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
