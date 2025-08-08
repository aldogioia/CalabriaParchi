import {Component} from '@angular/core';

@Component({
  selector: 'app-community-page',
  standalone: false,
  templateUrl: './community-page.html',
  styleUrl: './community-page.css',
  host: {'class': 'page margin' }
})
export class CommunityPage {
  sectionToShow: number = 0;

  experiences: any[] = [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

  parks: string[] = [
    'Tutte','Sila', 'Aspromonte', 'Pollino', 'Baia di Soverato', 'Costa degli Dei',
    'Costa dei Gelsomini', 'Riviera dei Cedri', 'Scogli di Isca', 'Secca di Amendolara'
  ];
}
