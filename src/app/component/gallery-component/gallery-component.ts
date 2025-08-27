import {Component, Input} from '@angular/core';
import {GalleryItemDto} from '../../../model/dto/GalleryItemDto';

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
}
