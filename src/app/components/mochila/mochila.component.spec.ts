import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MochilaComponent } from './mochila.component';

describe('MochilaComponent', () => {
  let component: MochilaComponent;
  let fixture: ComponentFixture<MochilaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MochilaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MochilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
