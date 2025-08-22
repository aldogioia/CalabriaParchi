import {Component, OnInit} from '@angular/core';
import {ExperiencePostDto} from '../../../model/dto/ExperiencePostDto';
import {ShareExperienceService} from '../../../service/share-experience-service';
import {ParkService} from '../../../service/park-service';
import {ParkDto} from '../../../model/dto/ParkDto';

@Component({
  selector: 'app-community-page',
  standalone: false,
  templateUrl: './community-page.html',
  styleUrl: './community-page.css',
  host: {'class': 'page margin' }
})
export class CommunityPage implements OnInit {
  selectedPark: number = 0;

  experiences: ExperiencePostDto[] = [];
  parks: ParkDto[] = [];

  constructor(
    private experienceService: ShareExperienceService,
    private parkService: ParkService
  ) {}

  ngOnInit(): void {
    this.parkService.getParks().subscribe({
      next: (response) => {
        this.parks = response;
        if (this.parks.length > 0) {
          this.changeSelected(0);
        }
      }
    });
  }

  changeSelected(i: number) {
    this.selectedPark = i
    this.getExperiencePostByPark(this.parks[i].id);
  }

  private getExperiencePostByPark(parkId: string) {
    this.experienceService.getExperiencePostByPark(parkId).subscribe({
      next: (experiences) => {
        this.experiences = experiences;
      }
    });
  }

}
