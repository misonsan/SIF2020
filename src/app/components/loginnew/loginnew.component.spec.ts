import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginnewComponent } from './loginnew.component';

describe('LoginnewComponent', () => {
  let component: LoginnewComponent;
  let fixture: ComponentFixture<LoginnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginnewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
