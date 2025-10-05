import {Component, OnInit} from '@angular/core';
import {ExperiencePostDto} from '../../model/dto/ExperiencePostDto';
import {ExperiencePostService} from '../../service/experience-post-service';
import {ParkService} from '../../service/park-service';
import {ParkDto} from '../../model/dto/ParkDto';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-community-page',
  standalone: false,
  templateUrl: './community-page.html',
  styleUrls: ['./community-page.css', "../../../../public/styles/nav.css"],
  host: {'class': 'page margin' }
})
export class CommunityPage implements OnInit {
  selectedPark: number = 0;

  experiences: ExperiencePostDto[] = [];
  parks: ParkDto[] = [];


  constructor(
    private experienceService: ExperiencePostService,
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
    this.experienceService.getAcceptedExperiencePostByPark(parkId).subscribe({
      next: (experiences) => {
        this.experiences = experiences;
      }
    });
  }

  protected readonly GlobalHandler = GlobalHandler;
}
