import {Component, OnInit} from '@angular/core';
import {TagDto} from '../../../model/dto/TagDto';
import {TagService} from '../../../service/tag-service';
import {CategoryService} from '../../../service/category-service';
import {CategoryDto} from '../../../model/dto/CategoryDto';
import {InterestService} from '../../../service/interest-service';
import {InterestDto} from '../../../model/dto/InterestDto';
import {ParkService} from '../../../service/park-service';
import {ParkDto} from '../../../model/dto/ParkDto';

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

  constructor(
    private tagService: TagService,
    private parkService: ParkService,
    private categoryService: CategoryService,
    private interestService: InterestService
  ) {}

  ngOnInit() {
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
