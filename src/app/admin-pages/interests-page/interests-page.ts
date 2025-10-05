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
import {forkJoin} from 'rxjs';

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

  interestForm: FormGroup;
  interests: InterestDto[] = [];

  parks: ParkDto[] = [];
  categories: CategoryDto[] = [];
  tags: TagDto[] = [];

  selectedFileImageUrl: string | null = null;
  selectedFileImage: File | null = null;
  selectedFilePdf: File | null = null;

  interestToModify: InterestDto | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private parkService: ParkService,
    private tagService: TagService,
    private categoryService: CategoryService,
    private interestService: InterestService,
  ) {
    this.interestForm = this.formBuilder.group({
      parkId: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      englishDescription: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      phoneNumber: [null, [Validators.pattern('^\\+?[0-9]{7,15}$')]],
      website: [null],
      interestType: [InterestType.ACTIVITY, Validators.required],
      tags: this.formBuilder.array([]),
      categories: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    forkJoin({
      tags: this.tagService.getTags(),
      parks: this.parkService.getParks(),
      categories: this.categoryService.getCategories()
    }).subscribe(({ tags, parks, categories }) => {
      this.tags = tags;
      this.parks = parks;
      this.categories = categories;
      this.initFormArrays();
    });

    this.interestForm.get('parkId')?.valueChanges.subscribe(parkId => {
      if (parkId) {
        this.interestService.getInterests(parkId)
          .subscribe(interests => this.interests = interests);
      } else {
        this.interests = [];
      }
    });
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
      name: '',
      englishName: '',
      description: '',
      englishDescription: '',
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
    if (!this.interestToModify && (this.interestForm.invalid || !this.selectedFileImage || !this.selectedFilePdf)) {
      this.interestForm.markAllAsTouched();
      alert('Compila tutti i campi obbligatori prima di continuare.');
      return;
    }

    const formData = this.buildFormData();

    console.log('FormData content:');
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (this.interestToModify) {
      this.modifyInterest(formData);
    } else {
      this.addInterest(formData);
    }
  }

  private buildFormData(): FormData {
    const { parkId, name, englishName, description, englishDescription, phoneNumber, website, interestType } = this.interestForm.value;
    const formData = new FormData();

    formData.append('parkId', parkId);
    formData.append('name', name);
    formData.append('englishName', englishName);
    formData.append('description', description);
    formData.append('englishDescription', englishDescription);
    if (phoneNumber) formData.append('phoneNumber', phoneNumber);
    if (website) formData.append('website', website);
    formData.append('interestType', interestType);

    const selectedTags = this.tags.filter((_, i) => this.tagsArray.value[i]).map(t => t.id);
    const selectedCategories = this.categories.filter((_, i) => this.categoriesArray.value[i]).map(c => c.id);

    selectedTags.forEach(tag => formData.append('tags', tag));
    selectedCategories.forEach(category => formData.append('categories', category));

    if (this.selectedFileImage) formData.append('image', this.selectedFileImage);
    if (this.selectedFilePdf) formData.append('pdf', this.selectedFilePdf);

    if (this.interestToModify?.id) formData.append('id', this.interestToModify.id);

    return formData;
  }

  private addInterest(formData: FormData) {
    this.interestService.createInterest(formData).subscribe({
      next: (createdInterest) => {
        this.interests.push(createdInterest);
        this.resetForm();
        alert('Interesse creato con successo!');
      },
      error: (err) => {
        console.error('Errore nella creazione dell\'interesse:', err);
        alert('Impossibile creare l\'interesse. Riprova più tardi.');
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
      },
      error: (err) => {
        console.error('Errore nella modifica dell\'interesse:', err);
        alert('Impossibile modificare l\'interesse. Riprova più tardi.');
      }
    });
  }

  deleteInterest() {
    if (!this.interestToModify) return;
    if (!confirm('Sei sicuro di voler eliminare questo interesse?')) return;

    this.interestService.deleteInterest(this.interestToModify.id, this.interestToModify.park.id).subscribe({
      next: () => {
        this.interests = this.interests.filter(i => i.id !== this.interestToModify!.id);
        this.resetForm();
        alert('Interesse eliminato con successo!');
      },
      error: (err) => {
        console.error('Errore nell\'eliminazione dell\'interesse:', err);
        alert('Impossibile eliminare l\'interesse. Riprova più tardi.');
      }
    });
  }
}
