import {Component, Input} from '@angular/core';
import {TagDto} from '../../../model/dto/TagDto';

@Component({
  selector: 'app-card-component',
  standalone: false,
  templateUrl: './card-component.html',
  styleUrl: './card-component.css'
})
export class CardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() tags: TagDto[] = [];
}
