import { TestBed } from '@angular/core/testing';

import { OfferInsurancePageComponent } from './offer-insurance-page';

import type { ComponentFixture } from '@angular/core/testing';

describe('OfferInsurancePageComponent', () => {
  let component: OfferInsurancePageComponent;
  let fixture: ComponentFixture<OfferInsurancePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferInsurancePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferInsurancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
