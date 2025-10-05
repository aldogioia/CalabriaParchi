import {Component, Input} from '@angular/core';
import {InterestDto} from '../../model/dto/InterestDto';
import {ItineraryService} from '../../service/itinerary-service';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-park-item-component',
  standalone: false,
  templateUrl: './park-item-component.html',
  styleUrl: './park-item-component.css'
})
export class ParkItemComponent {
  @Input({required : true})
  interestDto!: InterestDto

  @Input()
  showWishlistButton: boolean = true;

  constructor(protected itineraryService: ItineraryService) {
  }

  protected readonly GlobalHandler = GlobalHandler;
}
