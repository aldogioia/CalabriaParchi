import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalHandler} from '../../utils/GlobalHandler';
import {TagDto} from '../../model/dto/TagDto';
import {TagService} from '../../service/tag-service';

@Component({
  selector: 'app-tags-page',
  standalone: false,
  templateUrl: './tags-page.html',
  styleUrls: ['./tags-page.css', '../../../../public/styles/form&preview.css'],
  host: {'class': 'page margin split-view'}
})
export class TagsPage implements OnInit {
  tags: TagDto[] = [];

  tagToModify: TagDto | null = null;

  tagForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private tagService: TagService
  ) {
    this.tagForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      color: ['', [Validators.required, Validators.pattern(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)]],
    });
  }

  ngOnInit(): void {
    this.tagService.getTags()
      .subscribe(tags => this.tags = tags);
  }

  selectTag = (tag: TagDto)=> {
    this.tagForm.patchValue(tag);
    this.tagToModify = tag;
  }

  isInvalid(controlName: string): boolean {
    const control = this.tagForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.tagForm.get(controlName);
    return GlobalHandler.getInstance().getErrorMessage(control);
  }

  resetForm(): void {
    this.tagForm.reset({ color: '#1A1A1A' });
    this.tagToModify = null;
  }

  submit() {
    if (this.tagForm.invalid) {
      this.tagForm.markAllAsTouched();
      return;
    }

    this.tagToModify ? this.updateTag() : this.addTag();
  }

  private addTag() {
    const newTag = this.tagForm.value;

    this.tagService.addTag(newTag)
      .subscribe({
        next: (tag) => {
          this.tags.push(tag);
          this.resetForm();
          alert('Tag added successfully!');
        },
        error: (error) => {
          alert(error);
        }
      });
  }

  private updateTag() {
    if (!this.tagToModify) return;

    const updatedTag = this.tagForm.value;

    console.log('updatedTag', updatedTag);

    this.tagService.updateTag(updatedTag)
      .subscribe({
        next: (tag) => {
          console.log('update response', tag);
          const index = this.tags.findIndex(item => item.id === tag.id);
          if (index !== -1) {
            this.tags[index] = tag;
          }
          this.resetForm();
          alert('Tag updated successfully!');
        },
        error: (error) => {
          alert(error);
        }
      });
  }

  deleteTag() {
    if (!this.tagToModify) return;

    const confirmDelete = confirm('Are you sure you want to delete this tag?');
    if (!confirmDelete) return;

    this.tagService.deleteTag(this.tagToModify.id)
      .subscribe({
        next: () => {
          this.tags = this.tags.filter(item => item.id !== this.tagToModify!.id);
          this.resetForm();
          alert('Tag deleted successfully!');
        },
        error: (error) => {
          alert(error);
        }
      });
  }
}
