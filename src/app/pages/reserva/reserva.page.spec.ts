import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaPage } from './reserva.page';

describe('ReservaPage', () => {
  let component: ReservaPage;
  let fixture: ComponentFixture<ReservaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
