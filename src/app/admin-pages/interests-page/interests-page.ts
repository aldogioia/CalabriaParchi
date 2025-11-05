import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ParkDto} from '../../model/dto/ParkDto';
import {CategoryDto} from '../../model/dto/CategoryDto';
import {TagDto} from '../../model/dto/TagDto';
import {InterestDto} from '../../model/dto/InterestDto';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {InterestType} from '../../model/enum/InterestType';
import {ParkService} from '../../service/park-service';
import {TagService} from '../../service/tag-service';
import {CategoryService} from '../../service/category-service';
import {InterestService} from '../../service/interest-service';
import {forkJoin, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

enum FileType {
  IMAGE,
  PDF
}

@Component({
  selector: 'app-interests-page',
  standalone: false,
  templateUrl: './interests-page.html',
  styleUrls: ['./interests-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class InterestsPage implements OnInit {
  @ViewChild('fileInputImage') fileInputImage!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputPdf') fileInputPdf!: ElementRef<HTMLInputElement>;

  protected readonly FileType = FileType;
  protected readonly InterestType = InterestType;

  interestForm: FormGroup = new FormGroup({});
  parkForm: FormGroup = new FormGroup({});

  interests: InterestDto[] = [];

  parks: ParkDto[] = [];
  categories: CategoryDto[] = [];
  tags: TagDto[] = [];

  selectedFileImageUrl: string | null = null;
  selectedFileImage: File | null = null;
  selectedFilePdf: File | null = null;

  interestToModify: InterestDto | null = null;

  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private parkService: ParkService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private interestService: InterestService,
  ) {
    this.parkForm = this.formBuilder.group({
      parkId: ['', [Validators.required]],
    })

    this.interestForm = this.formBuilder.group({
      parkId: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      englishDescription: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      phoneNumber: [null, [Validators.pattern('^(?:\\+39|0039)?\\s?(?:3\\d{8,9}|0\\d{6,10})$')]],
      website: [null, [Validators.pattern('^(https?://)([\\w.-]+)(:[0-9]+)?([/\\w .-]*)*/?$')]],
      interestType: [InterestType.ACTIVITY, Validators.required],
      tags: this.formBuilder.array([]),
      categories: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.parkService.getParks(true)
      .subscribe(parks => this.parks = parks);

    forkJoin({
      tags: this.tagService.getTags(),
      categories: this.categoryService.getCategories()
    }).subscribe(({ tags, categories }) => {
      this.tags = tags;
      this.categories = categories;
      this.initFormArrays();
    });

    this.parkForm.get('parkId')?.valueChanges.pipe(
      switchMap(parkId => {
        if (parkId) {
          return this.interestService.getInterests(parkId);
        } else {
          return of([]);
        }
      })
    ).subscribe(interests => this.interests = interests);
  }

  get typeSelected(): InterestType {
    return this.interestForm.get('interestType')?.value;
  }

  get tagsArray(): FormArray {
    return this.interestForm.get('tags') as FormArray;
  }

  get categoriesArray(): FormArray {
    return this.interestForm.get('categories') as FormArray;
  }

  private initFormArrays(): void {
    this.fillFormArray(this.tagsArray, this.tags.length);
    this.fillFormArray(this.categoriesArray, this.categories.length);
  }

  private fillFormArray(arr: FormArray, count: number): void {
    for (let i = 0; i < count; i++) {
      arr.push(new FormControl(false));
    }
  }

  toggleChip(kind: 'tags' | 'categories', index: number): void {
    const arr = this.interestForm.get(kind) as FormArray;
    arr.at(index).setValue(!arr.at(index).value);
  }

  selectInterest(interest: InterestDto) {
    this.interestToModify = interest;

    // Patch base
    this.interestForm.patchValue(interest);
    this.interestForm.get("parkId")?.setValue(interest.park.id);

    // Reset e ricostruzione formArray coerente con il record
    this.tagsArray.clear();
    this.categoriesArray.clear();

    this.tags.forEach(tag => {
      const selected = interest.tags?.some(t => t.id === tag.id) ?? false;
      this.tagsArray.push(new FormControl(selected));
    });

    this.categories.forEach(cat => {
      const selected = interest.categories?.some(c => c.id === cat.id) ?? false;
      this.categoriesArray.push(new FormControl(selected));
    });

    this.selectedFileImage = null;
    this.selectedFilePdf = null;
    this.selectedFileImageUrl = interest.imageUrl ?? null;
  }

  get interestPreview() {
    return {
      id: this.interestToModify?.id ?? '',
      name: this.interestForm.get('name')?.value || 'Inserisci un nome',
      englishName: '',
      description: this.interestForm.get('description')?.value,
      englishDescription: '',
      imageUrl: this.selectedFileImageUrl || '',
      park: this.parks.find(p => p.id === this.interestForm.get('parkId')?.value) || { id: '', name: 'Seleziona un Parco', englishName: '', imageUrl: '', isMarine: false },
      phoneNumber: this.interestForm.get('phoneNumber')?.value,
      website: this.interestForm.get('website')?.value,
      categories: this.categories.filter((_, i) => this.categoriesArray.value[i]),
      tags: this.tags.filter((_, i) => this.tagsArray.value[i]),
      interestType: this.interestForm.get('interestType')?.value
    };
  }

  isInvalid(controlName: string): boolean {
    const control = this.interestForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    return GlobalHandler.getInstance().getErrorMessage(this.interestForm.get(controlName));
  }

  async onFileSelected(event: Event, fileType: FileType): Promise<void> {
    const result = await GlobalHandler.getInstance().handleFileInput(event);
    if (fileType === FileType.IMAGE) {
      this.selectedFileImage = result.file;
      this.selectedFileImageUrl = result.url;
    } else {
      this.selectedFilePdf = result.file;
    }
  }

  resetForm() {
    this.interestForm.reset({
      parkId: '',
      interestType: InterestType.ACTIVITY
    });

    this.tagsArray.clear();
    this.categoriesArray.clear();
    this.initFormArrays();

    this.selectedFileImage = null;
    this.selectedFilePdf = null;
    this.selectedFileImageUrl = null;
    this.interestToModify = null;

    if (this.fileInputImage) this.fileInputImage.nativeElement.value = '';
    if (this.fileInputPdf) this.fileInputPdf.nativeElement.value = '';
  }

  submit() {
    const creating = !this.interestToModify;

    if (this.loading) return;

    if (this.interestForm.invalid) {
      this.interestForm.markAllAsTouched();
      alert('Compila tutti i campi obbligatori.');
      return;
    }

    if (creating && (!this.selectedFileImage || !this.selectedFilePdf)) {
      alert('Immagine e PDF sono obbligatori per la creazione.');
      return;
    }

    const formData = this.buildFormData();

    this.loading = true;
    creating ? this.addInterest(formData) : this.modifyInterest(formData);
  }


  private buildFormData(): FormData {
    const {
      parkId,
      name,
      englishName,
      description,
      englishDescription,
      phoneNumber,
      website,
      interestType
    } = this.interestForm.value;

    const selectedTags = this.tags
      .filter((_, i) => this.tagsArray.value[i])
      .map(t => t.id);

    const selectedCategories = this.categories
      .filter((_, i) => this.categoriesArray.value[i])
      .map(c => c.id);

    const dto = {
      id: this.interestToModify ? this.interestToModify.id : undefined,
      parkId,
      name,
      englishName,
      description,
      englishDescription,
      phoneNumber,
      website,
      interestType,
      tags: selectedTags,
      categories: selectedCategories
    };

    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (this.selectedFileImage) formData.append('image', this.selectedFileImage);
    if (this.selectedFilePdf) formData.append('pdf', this.selectedFilePdf);

    return formData;
  }

  private isEqualsParkSelection(): boolean {
    const parkForm = this.parkForm.get('parkId')?.value;
    const objectForm = this.interestForm.get('parkId')?.value;
    return parkForm == objectForm;
  }

  private addInterest(formData: FormData) {
    this.interestService.createInterest(formData).subscribe({
      next: (createdInterest) => {
        if (this.isEqualsParkSelection())
          this.interests.push(createdInterest);
        this.resetForm();
        alert('Interesse creato con successo!');
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }

  private modifyInterest(formData: FormData) {
    this.interestService.updateInterest(formData).subscribe({
      next: (updatedInterest) => {
        const index = this.interests.findIndex(i => i.id === this.interestToModify?.id);
        if (index !== -1) this.interests[index] = updatedInterest;
        this.resetForm();
        alert('Interesse modificato con successo!');
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }

  deleteInterest() {
    if (!this.interestToModify || this.loading) return;
    if (!confirm('Sei sicuro di voler eliminare questo interesse?')) return;

    this.loading = true;

    this.interestService.deleteInterest(this.interestToModify.id, this.interestToModify.park.id).subscribe({
      next: () => {
        this.interests = this.interests.filter(i => i.id !== this.interestToModify!.id);
        this.resetForm();
        alert('Interesse eliminato con successo!');
        this.loading = false;
      },
      error: (error) => {
        alert(error);
        this.loading = false;
      }
    });
  }
}
