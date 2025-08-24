import {Component, OnInit} from '@angular/core';
import {TagDto} from '../../../model/dto/TagDto';
import {TagService} from '../../../service/tag-service';
import {CategoryService} from '../../../service/category-service';
import {CategoryDto} from '../../../model/dto/CategoryDto';
import {InterestService} from '../../../service/interest-service';
import {InterestDto} from '../../../model/dto/InterestDto';
import {ParkService} from '../../../service/park-service';
import {ParkDto} from '../../../model/dto/ParkDto';
import {ArticleDto} from '../../../model/dto/ArticleDto';
import {TranslateService} from '@ngx-translate/core';
import {ItineraryService} from '../../../service/itinerary-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-itinerary-page',
  standalone: false,
  templateUrl: './itinerary-page.html',
  styleUrl: './itinerary-page.css',
  host: { 'class': 'page margin' }
})
export class ItineraryPage implements OnInit{
  isFilterOpen: boolean = false;

  selectedTags: number[] = [];
  selectedParks: number[] = [];
  selectedCategories: number[] = [];

  tags: TagDto[] = [];
  parks: ParkDto[] = [];
  categories: CategoryDto[] = [];
  interests: InterestDto[] = [];

  articleDto: ArticleDto

  private sub!: Subscription;
  wishlistCount: number = 0;

  constructor(
    private tagService: TagService,
    private parkService: ParkService,
    private categoryService: CategoryService,
    private interestService: InterestService,
    private itineraryService: ItineraryService,
    private translateService: TranslateService
  ) {
    this.articleDto = {
      id: '',
      parkId: '',
      imageUrl: '',
      title: this.translateService.instant('ITINERARY_ARTICLE_TITLE'),
      paragraphs: [
        this.translateService.instant('ITINERARY_ARTICLE_PARAGRAPH_1')
      ]
    };
  }

  ngOnInit() {
    this.sub = this.itineraryService.wishlist$.subscribe(ids => {
      this.wishlistCount = ids.length;
    });

    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
    });

    this.parkService.getParks().subscribe(parks =>{
      this.parks = parks;
    })

    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.interestService.getInterests().subscribe(interest => {
      this.interests = interest;
    });
  }

  toggleFilter(index: number) {
    this.selectedTags.includes(index) ?
      this.selectedTags.splice(this.selectedTags.indexOf(index), 1):
      this.selectedTags.push(index);
  }

  toggleParks(index: number) {
    this.selectedParks.includes(index) ?
      this.selectedParks.splice(this.selectedParks.indexOf(index), 1):
      this.selectedParks.push(index);
  }

  toggleCategory(index: number) {
    this.selectedCategories.includes(index) ?
      this.selectedCategories.splice(this.selectedCategories.indexOf(index), 1):
      this.selectedCategories.push(index);
  }
}
