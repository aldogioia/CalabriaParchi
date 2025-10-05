import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CategoryDto} from '../../model/dto/CategoryDto';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-category-component',
  standalone: false,
  templateUrl: './category-component.html',
  styleUrl: './category-component.css'
})
export class CategoryComponent {
  @Input({ required: true })
  categoryDto!: CategoryDto;

  @Input()
  isSelected: boolean = false;

  @Output()
  categoryClicked = new EventEmitter<CategoryDto>();

  onCategoryClicked(): void {
    this.categoryClicked.emit(this.categoryDto);
  }

  protected readonly GlobalHandler = GlobalHandler;
}
