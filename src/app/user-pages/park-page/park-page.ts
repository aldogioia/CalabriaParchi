import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ArticleService } from '../../service/article-service';
import { InterestService } from '../../service/interest-service';
import { GalleryItemService } from '../../service/gallery-item-service';

import { ParkDto } from '../../model/dto/ParkDto';
import { ArticleDto } from '../../model/dto/ArticleDto';
import { InterestDto } from '../../model/dto/InterestDto';
import { GalleryItemDto } from '../../model/dto/GalleryItemDto';
import { Observable, forkJoin, of } from 'rxjs';
import { Section } from '../../model/enum/Section';
import {ParkService} from '../../service/park-service';
import {InterestType} from '../../model/enum/InterestType';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {FooterInfo} from '../../utils/footer-info';
import {GuideDto} from '../../model/dto/GuideDto';
import {GuideService} from '../../service/guide-service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-park-page',
  standalone: false,
  templateUrl: './park-page.html',
  styleUrls: ['./park-page.css', "../../../../public/styles/nav.css"],
  host: {class: 'page'}
})
export class ParkPage implements OnInit {
  park?: ParkDto;
  sectionToShow = 0;
  sections = Object.values(Section).filter(v => typeof v === 'number');

  articles?: ArticleDto[] = [];
  localities?: InterestDto[];
  activities?: InterestDto[];
  enoGastronomy?: InterestDto[];
  galleryItems?: GalleryItemDto[];
  guides?: GuideDto[];

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
    private galleryItemService: GalleryItemService,
    private guideService: GuideService
  ) {
    this.sectionConfig = {
      0: {
        fetch: (id) => forkJoin([
          this.articleService.getArticlesByParkId(id).pipe(catchError(() => of([]))),
          this.guideService.getAllGuideByParkId(id).pipe(catchError(() => of([])))
        ]),
        assign: (data) => {
          this.articles = data[0];
          this.guides = data[1];
        },
        cache: () => (this.articles && this.guides)
      },
      1: {
        fetch: (id) => this.interestService.getInterests(id, InterestType.LOCATION),
        assign: (data) => (this.localities = data),
        cache: () => this.localities
      },
      2: {
        fetch: (id) => this.interestService.getInterests(id, InterestType.ACTIVITY),
        assign: (data) => (this.activities = data),
        cache: () => this.activities
      },
      3: {
        fetch: (id) => this.interestService.getInterests(id, InterestType.FOOD_AND_WINE),
        assign: (data) => (this.enoGastronomy = data),
        cache: () => this.enoGastronomy
      },
      4: {
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
    this.enoGastronomy = undefined;
    this.galleryItems = undefined;
    this.loading = false;
  }

  private setPark(park: ParkDto): void {
    this.park = park;
    this.resetData();
    this.loadSection(this.sectionToShow);
  }

  protected readonly Section = Section;
  protected readonly GlobalHandler = GlobalHandler;
  protected readonly FooterInfo = FooterInfo;
}
