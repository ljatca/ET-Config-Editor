import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumMultiComponent } from './enum-multi.component';

describe('EnumMultiComponent', () => {
  let component: EnumMultiComponent;
  let fixture: ComponentFixture<EnumMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
