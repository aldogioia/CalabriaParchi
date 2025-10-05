import {Component, Input} from '@angular/core';
import {GalleryItemDto} from '../../model/dto/GalleryItemDto';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-gallery-component',
  standalone: false,
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.css'
})
export class GalleryComponent {
  galleryItemSelected: number | null = null;

  @Input({required : true})
  galleryItems!: GalleryItemDto[]
  protected readonly GlobalHandler = GlobalHandler;
}
