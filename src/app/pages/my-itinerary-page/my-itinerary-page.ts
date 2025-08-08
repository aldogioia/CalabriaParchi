import { Component } from '@angular/core';
import {TagDto} from '../../../model/dto/TagDto';

@Component({
  selector: 'app-my-itinerary-page',
  standalone: false,
  templateUrl: './my-itinerary-page.html',
  styleUrl: './my-itinerary-page.css',
  host: {'class': 'page margin'}
})
export class MyItineraryPage {
  itineraries: any[] = [1,2,3,4,5,6];

  tags: TagDto[] = [
    new TagDto('123', 'Montagna', '997945'),
    new TagDto('324', 'Borghi', '32A827'),
    new TagDto('124', 'Famiglia', '34CFE3')
  ];
}
