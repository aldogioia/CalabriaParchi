import { Component, OnInit, OnDestroy } from '@angular/core';
import { InterestDto } from '../../model/dto/InterestDto';
import { InterestService } from '../../service/interest-service';
import { ItineraryService } from '../../service/itinerary-service';
import { Subscription } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-my-itinerary-page',
  standalone: false,
  templateUrl: './my-itinerary-page.html',
  styleUrl: './my-itinerary-page.css',
  host: { 'class': 'page margin' }
})
export class MyItineraryPage implements OnInit, OnDestroy {
  myInterests: InterestDto[] = [];
  private sub!: Subscription;

  loading: boolean = false;

  showPopup: boolean = false;
  itineraryForm: FormGroup = new FormGroup({});

  constructor(
    private interestService: InterestService,
    private itineraryService: ItineraryService,
    private formBuilder: FormBuilder
  ) {
    this.itineraryForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.sub = this.itineraryService.wishlist$.subscribe(ids => {
      this.loadMyInterests(ids);
    });
  }

  private loadMyInterests(ids: string[]): void {
    if (!ids.length) {
      this.myInterests = [];
      return;
    }

    this.interestService.getSelectedInterests(ids).subscribe({
      next: (interests: InterestDto[]) => {
        this.myInterests = interests;
      }
    });
  }

  generateItinerary(): void {
    if (this.itineraryForm.invalid || this.loading) {
      this.itineraryForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const email = this.itineraryForm.value.email;
    this.itineraryService.generateItinerary(
      this.myInterests.map(i => i.id),
      email
    ).subscribe({
      next: () => {
        alert("Itinerary generated successfully! Check your email.");
        this.itineraryForm.reset();
        this.loading = false;
        this.showPopup = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }

  clearItinerary() {
    this.itineraryService.clearWishlist();
  }

  isInvalid(controlName: string): boolean {
    const control = this.itineraryForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.itineraryForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
