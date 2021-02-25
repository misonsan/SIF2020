import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prodotto3Component } from './prodotto3.component';

describe('Prodotto3Component', () => {
  let component: Prodotto3Component;
  let fixture: ComponentFixture<Prodotto3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Prodotto3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Prodotto3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
