import {Component, OnInit} from '@angular/core';
import {ParkDto} from '../../../model/dto/ParkDto';
import {ParkService} from '../../../service/park-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  host: {'class': 'page' }
})
export class HomePage implements OnInit{
  parks: ParkDto[] = [];

  constructor(
    private router: Router,
    private parkService: ParkService
  ) {}

  ngOnInit(): void {
    this.parkService.getParks().subscribe({
      next: (response) => {
        this.parks = response
      }
    })
  }

  navigateToPark(park: ParkDto) {
    this.router.navigate(['/park'], {state: {park}}).then();
  }
}
