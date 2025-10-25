import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryDto} from '../../model/dto/CategoryDto';
import {CategoryService} from '../../service/category-service';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-category-page',
  standalone: false,
  templateUrl: './category-page.html',
  styleUrls: ['./category-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class CategoryPage implements OnInit {
  categories: CategoryDto[] = [];

  categoryToModify: CategoryDto | null = null;

  categoryForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories);

  }

  selectCategory = (category: CategoryDto) => {
    this.categoryForm.patchValue(category);
    this.categoryToModify = category;
  }

  isInvalid(controlName: string): boolean {
    const control = this.categoryForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.categoryForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.categoryToModify = null;
  }

  submit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.categoryToModify ? this.updateCategory() : this.addCategory();
  }

  private addCategory() {
    const newCategory = this.categoryForm.value;

    this.categoryService.addCategory(newCategory)
      .subscribe({
        next: (category) => {
          this.categories.push(category);
          this.resetForm();
          alert('Category added successfully!');
        },
        error: (error) => {
          alert(error);
        }
      });
  }

  private updateCategory() {
    if (!this.categoryToModify) return;

    const updatedCategory = this.categoryForm.value;

    this.categoryService.updateCategory(updatedCategory)
      .subscribe({
        next: (category) => {
          console.log('update response', category);
          const index = this.categories.findIndex(item => item.id === category.id);
          if (index !== -1) {
            this.categories[index] = category;
          }
          this.resetForm();
          alert('Category updated successfully!');
        },
        error: (error) => {
          alert(error);
        }
      });
  }

  deleteCategory() {
    if (!this.categoryToModify) return;

    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    this.categoryService.deleteCategory(this.categoryToModify.id)
      .subscribe({
        next: () => {
          this.categories = this.categories.filter(item => item.id !== this.categoryToModify!.id);
          this.resetForm();
          alert('Category deleted successfully!');
        },
        error: (error) => {
          alert(error);
        }
      });
  }
}
