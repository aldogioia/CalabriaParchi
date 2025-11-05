import {Component, OnInit} from '@angular/core';
import {ExperiencePostDto} from '../../model/dto/ExperiencePostDto';
import {ExperiencePostService} from '../../service/experience-post-service';
import {ParkDto} from '../../model/dto/ParkDto';
import {ParkService} from '../../service/park-service';

@Component({
  selector: 'app-experience-post-review-page',
  standalone: false,
  templateUrl: './experience-post-review-page.html',
  styleUrls: ['./experience-post-review-page.css', "../../../../public/styles/nav.css"],
  host: {'class': 'page margin' }
})
export class ExperiencePostReviewPage implements OnInit {
  pendingExperiences: ExperiencePostDto[] = []
  parks: ParkDto[] = [];

  selectedPark: number = 0;

  loading: boolean = false;

  constructor(
    private experiencePostService: ExperiencePostService,
    private parkService: ParkService
  ) {}

  ngOnInit(): void {
    this.parkService.getParks(true).subscribe({
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
    this.experiencePostService.getPendingExperiencePostByPark(this.parks[i].id).subscribe({
      next: (experiences) => {
        this.pendingExperiences = experiences;
      }
    });
  }

  valuateExperience(experiencePostId: string, experiencePostStatus: 'ACCEPTED' | 'REJECTED') {
    if (this.loading) return

    if (confirm('Sei sicuro di voler procedere?')) {
      this.loading = true;
      this.experiencePostService.updateExperiencePostStatus(
        experiencePostStatus,
        experiencePostId,
        this.parks[this.selectedPark].id
      ).subscribe({
        next: () => {
          this.pendingExperiences = this.pendingExperiences.filter(e => e.id !== experiencePostId);
          this.loading = false;
        },
        error: (error) => {
          alert(error);
          this.loading = false;
        }
      });
    }
  }

}
