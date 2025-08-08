import { Component } from '@angular/core';
import {TagDto} from '../../../model/dto/TagDto';

@Component({
  selector: 'app-park-page',
  standalone: false,
  templateUrl: './park-page.html',
  styleUrl: './park-page.css',
  host: {'class': 'page' }
})
export class ParkPage {
  sectionToShow: number = 0;

  tags: TagDto[] = [
    new TagDto('123', 'Montagna', '997945'),
    new TagDto('324', 'Borghi', '32A827'),
    new TagDto('124', 'Famiglia', '34CFE3')
  ];
}
