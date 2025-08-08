import { Component } from '@angular/core';
import {TagDto} from '../../../model/dto/TagDto';

class ItineraryItem {
  constructor(
    public title: string,
    public description: string,
    public tags: TagDto[]
  ) {}
}

@Component({
  selector: 'app-itinerary-page',
  standalone: false,
  templateUrl: './itinerary-page.html',
  styleUrl: './itinerary-page.css',
  host: { 'class': 'page margin' }
})
export class ItineraryPage {

  isFilterOpen: boolean = false;

  selectedTags: number[] = [];

  tags: TagDto[] = [
    new TagDto('123', 'Montagna', '997945'),
    new TagDto('324', 'Borghi', '32A827'),
    new TagDto('124', 'Famiglia', '34CFE3')
  ];

  itineraryItems: ItineraryItem[] = [
    new ItineraryItem('title1', 'description1', this.tags),
    new ItineraryItem('title2', 'description2', this.tags),
    new ItineraryItem('title3', 'description3', this.tags),
    new ItineraryItem('title4', 'description4', this.tags),
  ]

  toggleFilter(index: number) {
    this.selectedTags.includes(index) ?
      this.selectedTags.splice(this.selectedTags.indexOf(index), 1):
      this.selectedTags.push(index);
  }
}
