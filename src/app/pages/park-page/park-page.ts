import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ArticleService } from '../../../service/article-service';
import { InterestService } from '../../../service/interest-service';
import { GalleryItemService } from '../../../service/gallery-item-service';

import { ParkDto } from '../../../model/dto/ParkDto';
import { ArticleDto } from '../../../model/dto/ArticleDto';
import { InterestDto } from '../../../model/dto/InterestDto';
import { GalleryItemDto } from '../../../model/dto/GalleryItemDto';
import { Observable } from 'rxjs';
import { Section } from '../../../model/enum/Section';
import {ParkService} from '../../../service/park-service';

@Component({
  selector: 'app-park-page',
  standalone: false,
  templateUrl: './park-page.html',
  styleUrls: ['./park-page.css'],
  host: {class: 'page'}
})
export class ParkPage implements OnInit {
  park?: ParkDto;
  sectionToShow = 0;
  sections = Object.values(Section).filter(v => typeof v === 'number');

  articles?: ArticleDto[];
  localities?: InterestDto[];
  activities?: InterestDto[];
  galleryItems?: GalleryItemDto[];

  loading = false;

  private readonly sectionConfig: {
    [key: number]: {
      fetch: (parkId: string) => Observable<any>;
      assign: (data: any) => void;
      cache: () => any;
    };
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parkService: ParkService,
    private articleService: ArticleService,
    private interestService: InterestService,
    private galleryItemService: GalleryItemService
  ) {
    this.sectionConfig = {
      0: {
        fetch: (id) => this.articleService.getArticlesByParkId(id),
        assign: (data) => (this.articles = data),
        cache: () => this.articles
      },
      1: {
        fetch: (id) => this.interestService.getInterestsLocationByParkId(id),
        assign: (data) => (this.localities = data),
        cache: () => this.localities
      },
      2: {
        fetch: (id) => this.interestService.getInterestsActivityByParkId(id),
        assign: (data) => (this.activities = data),
        cache: () => this.activities
      },
      3: {
        fetch: (id) => this.galleryItemService.getGalleryItemsByParkId(id),
        assign: (data) => (this.galleryItems = data),
        cache: () => this.galleryItems
      }
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const parkId = params.get('id');
      const navigation = this.router.getCurrentNavigation();

      if (navigation?.extras.state?.['park']) {
        this.setPark(navigation.extras.state['park']);
      } else {
        this.parkService.getPark(parkId!)
          .subscribe(park => this.setPark(park));
      }
    });
  }

  changeSection(section: number): void {
    this.sectionToShow = section;
    this.loadSection(section);
  }

  private loadSection(section: number): void {
    if (!this.park) return;

    const config = this.sectionConfig[section];
    if (!config) return;

    if (config.cache()) {
      return;
    }

    this.loading = true;
    config.fetch(this.park.id).subscribe({
      next: (res) => config.assign(res),
      error: (err) => console.error('Errore caricamento sezione', err),
      complete: () => (this.loading = false)
    });
  }

  private resetData(): void {
    this.articles = undefined;
    this.localities = undefined;
    this.activities = undefined;
    this.galleryItems = undefined;
    this.loading = false;
  }

  private setPark(park: ParkDto): void {
    this.park = park;
    this.resetData();
    this.loadSection(this.sectionToShow);
  }


  protected readonly Section = Section;
}
