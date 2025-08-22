import {Component, Input} from '@angular/core';
import {InterestDto} from '../../../model/dto/InterestDto';
import {GlobalHandler} from '../../../utils/GlobalHandler';

@Component({
  selector: 'app-card-component',
  standalone: false,
  templateUrl: './card-component.html',
  styleUrl: './card-component.css'
})
export class CardComponent {
  @Input({ required: true })
  interestDto!: InterestDto

  actionInWishlist(id: string) {
    GlobalHandler.getInstance().getWishlist().includes(id) //TODO da migliorare
      ? GlobalHandler.getInstance().addToWishlist(id)
      : GlobalHandler.getInstance().removeFromWishlist(id);
  }
}
