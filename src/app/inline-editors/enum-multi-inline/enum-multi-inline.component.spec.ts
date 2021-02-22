import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumMultiInlineComponent } from './enum-multi-inline.component';

describe('EnumMultiInlineComponent', () => {
  let component: EnumMultiInlineComponent;
  let fixture: ComponentFixture<EnumMultiInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumMultiInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumMultiInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
