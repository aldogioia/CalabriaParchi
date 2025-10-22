import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { GlobalHandler } from '../../utils/GlobalHandler';
import { ParkDto } from '../../model/dto/ParkDto';
import { ArticleDto } from '../../model/dto/ArticleDto';
import { ParkService } from '../../service/park-service';
import {ArticleService} from '../../service/article-service';
import {firstRequiredValidator} from '../../utils/first-required-validator';

@Component({
  selector: 'app-details-page',
  standalone: false,
  templateUrl: './articles-page.html',
  styleUrls: ['./articles-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class ArticlesPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  articleForm: FormGroup = new FormGroup({});

  parks: ParkDto[] = [];
  articles: ArticleDto[] = [];

  selectedFileUrl: string | null = null;
  selectedFile: File | null = null;

  articleToModify: ArticleDto | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private parkService: ParkService,
    private articleService: ArticleService,
  ) {
    this.articleForm = this.formBuilder.group({
      parkId: [''],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      englishTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      paragraphs: this.formBuilder.array([
        this.createParagraphControl()
      ]),
      englishParagraphs: this.formBuilder.array([
        this.createParagraphControl()
      ]),
    });
  }

  ngOnInit(): void {
    this.parkService.getParks()
      .subscribe(parks => this.parks = parks);

    this.articleForm.get('parkId')?.valueChanges.subscribe(parkId => {
      if (parkId) {
        this.articleService.getArticlesByParkId(parkId)
          .subscribe(articles => this.articles = articles);
      } else {
        this.articles = [];
      }
    });
  }

  get paragraphs(): FormArray {
    return this.articleForm.get('paragraphs') as FormArray;
  }

  get englishParagraphs(): FormArray {
    return this.articleForm.get('englishParagraphs') as FormArray;
  }

  private createParagraphControl(isFirst: boolean = false): FormControl {
    return this.formBuilder.control('', [firstRequiredValidator(isFirst), Validators.maxLength(100)]);
  }


  onParagraphInput(index: number, isEnglish = false): void {
    const array = isEnglish ? this.englishParagraphs : this.paragraphs;
    const control = array.at(index);

    if (index === array.length - 1 && control.value?.trim()) {
      array.push(this.createParagraphControl(false));
    }
  }

  onParagraphBlur(index: number, isEnglish = false): void {
    const array = isEnglish ? this.englishParagraphs : this.paragraphs;
    const control = array.at(index);

    if (!control.value?.trim() && index > 0) {
      array.removeAt(index);
    }
  }

  isInvalidParagraph(index: number, isEnglish = false): boolean {
    const array = isEnglish ? this.englishParagraphs : this.paragraphs;
    const control = array.at(index);
    return (control && control.invalid && (control.dirty || control.touched));
  }

  getParagraphError(index: number, isEnglish = false): string {
    const array = isEnglish ? this.englishParagraphs : this.paragraphs;
    const control = array.at(index);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  isInvalid(controlName: string): boolean {
    const control = this.articleForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.articleForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  async onFileSelected(event: Event): Promise<void> {
    const result = await GlobalHandler.getInstance().handleFileInput(event);
    this.selectedFile = result.file;
    this.selectedFileUrl = result.url;
  }

  resetForm() {
    this.articleForm.patchValue({
      parkId: '',
      title: '',
      english_title: ''
    });

    this.resetParagraphsArray('paragraphs');
    this.resetParagraphsArray('englishParagraphs');

    this.selectedFile = null;
    this.selectedFileUrl = null;
    this.articleToModify = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private resetParagraphsArray(name: 'paragraphs' | 'englishParagraphs') {
    this.articleForm.setControl(name, this.formBuilder.array([
      this.createParagraphControl(true)
    ]));
  }

  selectArticle(article: ArticleDto) {
    this.articleToModify = article;

    this.articleForm.patchValue({
      parkId: article.parkId,
      title: article.title,
      englishTitle: article.englishTitle,
    });

    const paragraphControls = article.paragraphs.map((p, i) =>
      this.formBuilder.control(p, [firstRequiredValidator(i === 0), Validators.maxLength(1000)])
    );
    paragraphControls.push(this.createParagraphControl(false));
    this.articleForm.setControl('paragraphs', this.formBuilder.array(paragraphControls));


    const englishParagraphControls = article.englishParagraphs.map((p, i) =>
      this.formBuilder.control(p, [firstRequiredValidator(i === 0), Validators.maxLength(1000)])
    );
    englishParagraphControls.push(this.createParagraphControl(false));
    this.articleForm.setControl('englishParagraphs', this.formBuilder.array(englishParagraphControls));


    this.selectedFileUrl = article.imageUrl;
    this.selectedFile = null;
  }

  private createArticleFormData() {
    const { parkId, title, englishTitle, paragraphs, englishParagraphs } = this.articleForm.value;
    const filteredParagraphs = (paragraphs as string[]).filter(p => p?.trim());
    const filteredEnglishParagraphs = (englishParagraphs as string[]).filter(p => p?.trim());

    const formData = new FormData();
    formData.append('parkId', parkId);
    formData.append('title', title);
    formData.append('englishTitle', englishTitle);

    filteredParagraphs.forEach((p, i) => formData.append(`paragraphs[${i}]`, p));
    filteredEnglishParagraphs.forEach((p, i) => formData.append(`englishParagraphs[${i}]`, p));

    //TODO vedere come gestire l'immagine per la modifica (dare un modo per eliminarla)
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    return formData;
  }

  submit() {
    //TODO vedere come gestirlo
    /*if (!this.articleToModify ? this.articleForm.invalid  || !this.selectedFile : this.articleForm.invalid) {
      this.galleryItemForm.markAllAsTouched();
      return;
    }*/

    if (this.articleToModify) {
      this.modifyArticle();
    } else {
      this.addArticle();
    }
  }

  private addArticle() {
    const formData = this.createArticleFormData();

    this.articleService.createArticle(formData).subscribe({
      next: () => {
        this.resetForm();
        alert('Article created successfully!');
      },
      error: () => {
        alert('Failed to create article. Please try again.');
      }
    });
  }


  private modifyArticle() {
    if (!this.articleToModify) return;

    const formData = this.createArticleFormData();
    formData.append('id', this.articleToModify.id);

    this.articleService.updateArticle(formData).subscribe({
      next: (updatedArticle) => {
        const index = this.articles.findIndex(item => item.id === this.articleToModify!.id);
        if (index !== -1) {
          this.articles[index] = updatedArticle;
        }
        this.resetForm();
        alert('Article updated successfully!');
      },
      error: (err) => {
        console.error('Error updating article:', err);
        alert('Failed to update article. Please try again.');
      }
    });
  }

  deleteArticle() {
    if (!this.articleToModify) return;

    const confirmDelete = confirm('Are you sure you want to delete this Article?');
    if (!confirmDelete) return;

    this.articleService.deleteArticle(this.articleToModify.id, this.articleToModify.parkId).subscribe({
      next: () => {
        this.articles = this.articles.filter(item => item.id !== this.articleToModify!.id);
        this.resetForm();
        alert('Article deleted successfully!');
      },
      error: (err) => {
        console.error('Error deleting article:', err);
        alert('Failed to delete article. Please try again.');
      }
    });
  }
}
