import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGiftsComponent } from './my-gifts.component';

describe('MyGiftsComponent', () => {
  let component: MyGiftsComponent;
  let fixture: ComponentFixture<MyGiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
