import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, forkJoin, Subscription } from 'rxjs';

import { TagDto } from '../../model/dto/TagDto';
import { CategoryDto } from '../../model/dto/CategoryDto';
import { ParkDto } from '../../model/dto/ParkDto';
import { InterestDto } from '../../model/dto/InterestDto';

import { TagService } from '../../service/tag-service';
import { CategoryService } from '../../service/category-service';
import { ParkService } from '../../service/park-service';
import { InterestService } from '../../service/interest-service';
import { ItineraryService } from '../../service/itinerary-service';

@Component({
  selector: 'app-itinerary-page',
  standalone: false,
  templateUrl: './itinerary-page.html',
  styleUrl: './itinerary-page.css',
  host: { 'class': 'page margin' }
})
export class ItineraryPage implements OnInit, OnDestroy {
  isFilterOpen = false;

  tags: TagDto[] = [];
  parks: ParkDto[] = [];
  categories: CategoryDto[] = [];
  interests: InterestDto[] = [];

  wishlistCount = 0;

  searchForm!: FormGroup;

  private subs = new Subscription();
  private readonly searchDebounceMs = 1500;

  constructor(
    private tagService: TagService,
    private parkService: ParkService,
    private categoryService: CategoryService,
    private interestService: InterestService,
    private itineraryService: ItineraryService,
    private fb: FormBuilder,
  ) {}

  get parksArray(): FormArray { return this.searchForm.get('parks') as FormArray; }
  get tagsArray(): FormArray { return this.searchForm.get('tags') as FormArray; }
  get categoriesArray(): FormArray { return this.searchForm.get('categories') as FormArray; }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: [''],
      parks: this.fb.array([]),
      tags: this.fb.array([]),
      categories: this.fb.array([])
    });

    this.subs.add(
      this.itineraryService.wishlist$.subscribe(ids => this.wishlistCount = ids.length)
    );

    this.parkService.getParks().subscribe(parks => {
      this.parks = parks
    })

    this.subs.add(
      forkJoin({
        tags: this.tagService.getTags(),
        categories: this.categoryService.getCategories()
      }).subscribe(({ tags, categories }) => {
        this.tags = tags;
        this.categories = categories;
        this.initFormArrays();
        this.loadInterests();
      })
    );

    this.subs.add(
      this.searchForm.valueChanges
        .pipe(debounceTime(this.searchDebounceMs))
        .subscribe(() => this.loadInterests())
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private initFormArrays(): void {
    this.fillFormArray(this.parksArray, this.parks.length);
    this.fillFormArray(this.tagsArray, this.tags.length);
    this.fillFormArray(this.categoriesArray, this.categories.length);
  }

  private fillFormArray(arr: FormArray, count: number): void {
    for (let i = 0; i < count; i++) {
      arr.push(new FormControl(false));
    }
  }

  toggleChip(kind: 'parks' | 'tags' | 'categories', index: number): void {
    const arr = this.searchForm.get(kind) as FormArray;
    const ctrl = arr.at(index) as FormControl<boolean>;
    ctrl.setValue(!ctrl.value); // questo triggera valueChanges → debounce → loadInterests()
  }

  hasActiveFilters(): boolean {
    const parksArray = this.searchForm.get('parks') as FormArray;
    const categoriesArray = this.searchForm.get('categories') as FormArray;
    const tagsArray = this.searchForm.get('tags') as FormArray;

    return (
      (parksArray?.value?.some((v: boolean) => v)) ||
      (categoriesArray?.value?.some((v: boolean) => v)) ||
      (tagsArray?.value?.some((v: boolean) => v))
    );
  }

  onSubmit(): void {
    this.loadInterests();
  }

  private loadInterests(): void {
    const { search, parks, tags, categories } = this.searchForm.value as {
      search: string;
      parks: boolean[];
      tags: boolean[];
      categories: boolean[];
    };

    const selectedParks = this.pickSelectedIds(parks, this.parks);
    const selectedTags = this.pickSelectedIds(tags, this.tags);
    const selectedCategories = this.pickSelectedIds(categories, this.categories);

    this.subs.add(
      this.interestService
        .searchInterests(search || '', selectedParks, selectedTags, selectedCategories)
        .subscribe(interests => this.interests = interests)
    );
  }

  private pickSelectedIds(bools: boolean[] = [], source: { id: string }[] = []): string[] {
    return source
      .map((x, i) => (bools?.[i] ? x.id : null))
      .filter(Boolean) as string[];
  }
}
