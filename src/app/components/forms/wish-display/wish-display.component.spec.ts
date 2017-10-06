import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishDisplayComponent } from './wish-display.component';

describe('WishDisplayComponent', () => {
  let component: WishDisplayComponent;
  let fixture: ComponentFixture<WishDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
