import { Component } from '@angular/core';
import {InterestDto} from '../../../model/dto/InterestDto';
import {InterestService} from '../../../service/interest-service';
import {ItineraryService} from '../../../service/itinerary-service';
import {GlobalHandler} from '../../../utils/GlobalHandler';

@Component({
  selector: 'app-my-itinerary-page',
  standalone: false,
  templateUrl: './my-itinerary-page.html',
  styleUrl: './my-itinerary-page.css',
  host: {'class': 'page margin'}
})
export class MyItineraryPage {
  myInterests: InterestDto[] = [];

  constructor(
    private interestService: InterestService,
    private itineraryService: ItineraryService
  ) {
    this.loadMyInterests();
  }

  private loadMyInterests(): void {
    this.interestService.getSelectedInterests(GlobalHandler.getInstance().getWishlist()).subscribe({
      next: (interests: InterestDto[]) => {
        this.myInterests = interests;
      }
    });
  }

  generateItinerary(): void {
    const email = ""; //TODO ottenere la mail dell'utente
    this.itineraryService.generateItinerary(GlobalHandler.getInstance().getWishlist(), email).subscribe({
      next: (response) => {
        console.log('Itinerary generated successfully:', response);
      },
      error: (error) => {
        console.error('Error generating itinerary:', error);
      }
    });
  }
}
