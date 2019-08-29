import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoHuespedPage } from './nuevo-huesped.page';

describe('NuevoHuespedPage', () => {
  let component: NuevoHuespedPage;
  let fixture: ComponentFixture<NuevoHuespedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoHuespedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoHuespedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
