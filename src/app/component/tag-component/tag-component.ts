import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TagDto} from '../../model/dto/TagDto';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-tag-component',
  standalone: false,
  templateUrl: './tag-component.html',
  styleUrl: './tag-component.css'
})
export class TagComponent {
  @Input({ required: true })
  tagDto!: TagDto;

  @Input()
  isSelected: boolean = false;

  @Output()
  tagClicked = new EventEmitter<TagDto>();

  onTagClick(): void {
    this.tagClicked.emit(this.tagDto);
  }

  protected readonly GlobalHandler = GlobalHandler;
}
