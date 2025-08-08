import {Component, Input} from '@angular/core';
import {TagDto} from '../../../model/dto/TagDto';

@Component({
  selector: 'app-park-item-component',
  standalone: false,
  templateUrl: './park-item-component.html',
  styleUrl: './park-item-component.css'
})
export class ParkItemComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() image: string = 'images/sila.jpg';
  @Input() tags: TagDto[] = [];
  @Input() location: string = '';
  @Input() website: string | null = null;
  @Input() phone: string | null = null;

  @Input() isItinerary: boolean = false;

  showMore: boolean = false;
}
