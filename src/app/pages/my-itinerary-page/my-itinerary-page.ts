import { Component, OnInit, OnDestroy } from '@angular/core';
import { InterestDto } from '../../../model/dto/InterestDto';
import { InterestService } from '../../../service/interest-service';
import { ItineraryService } from '../../../service/itinerary-service';
import { Subscription } from 'rxjs';

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

  constructor(
    private interestService: InterestService,
    private itineraryService: ItineraryService
  ) {}

  ngOnInit(): void {
    // mi sottoscrivo allo stream reattivo della wishlist
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
    const email = "aldogioia2002@gmail.com"; // TODO: ottenere la mail dell’utente
    this.itineraryService.generateItinerary(
      this.myInterests.map(i => i.id),
      email
    ).subscribe({
      next: (response) => {
        console.log('Itinerary generated successfully:', response);
      },
      error: (error) => {
        console.error('Error generating itinerary:', error);
      }
    });
  }

  clearItinerary() {
    this.itineraryService.clearWishlist();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
