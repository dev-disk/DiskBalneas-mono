import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SalesComponent } from './sales.component';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
