import { TestBed } from '@angular/core/testing';

import { HomeLandingPageComponent } from './home-landing-page';

import type { ComponentFixture } from '@angular/core/testing';

describe('HomeLandingPageComponent', () => {
  let component: HomeLandingPageComponent;
  let fixture: ComponentFixture<HomeLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLandingPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
