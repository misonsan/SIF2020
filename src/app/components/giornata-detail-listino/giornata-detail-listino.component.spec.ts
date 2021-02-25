import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiornataDetailListinoComponent } from './giornata-detail-listino.component';

describe('GiornataDetailListinoComponent', () => {
  let component: GiornataDetailListinoComponent;
  let fixture: ComponentFixture<GiornataDetailListinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiornataDetailListinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiornataDetailListinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
