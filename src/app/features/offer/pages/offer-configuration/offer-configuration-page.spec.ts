import { TestBed } from '@angular/core/testing';

import { OfferConfigurationPageComponent } from './offer-configuration-page';

import type { ComponentFixture } from '@angular/core/testing';

describe('OfferConfigurationPageComponent', () => {
  let component: OfferConfigurationPageComponent;
  let fixture: ComponentFixture<OfferConfigurationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferConfigurationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferConfigurationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
