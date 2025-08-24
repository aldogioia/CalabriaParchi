import {Component, Input} from '@angular/core';
import {InterestDto} from '../../../model/dto/InterestDto';
import {ItineraryService} from '../../../service/itinerary-service';

@Component({
  selector: 'app-park-item-component',
  standalone: false,
  templateUrl: './park-item-component.html',
  styleUrl: './park-item-component.css'
})
export class ParkItemComponent {
  @Input({required : true})
  interestDto!: InterestDto

  constructor(protected itineraryService: ItineraryService) {
  }
}
