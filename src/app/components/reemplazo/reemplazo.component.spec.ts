import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReemplazoComponent } from './reemplazo.component';

describe('RemplazoComponent', () => {
  let component: ReemplazoComponent;
  let fixture: ComponentFixture<ReemplazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReemplazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReemplazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
