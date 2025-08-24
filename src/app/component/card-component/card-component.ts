import {Component, Input} from '@angular/core';
import {InterestDto} from '../../../model/dto/InterestDto';
import {GlobalHandler} from '../../../utils/GlobalHandler';
import {ItineraryService} from '../../../service/itinerary-service';

@Component({
  selector: 'app-card-component',
  standalone: false,
  templateUrl: './card-component.html',
  styleUrl: './card-component.css'
})
export class CardComponent {
  @Input({ required: true })
  interestDto!: InterestDto
  protected readonly GlobalHandler = GlobalHandler;

  constructor(protected itineraryService: ItineraryService) {}
}
