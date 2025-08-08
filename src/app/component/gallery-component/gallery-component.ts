import { Component } from '@angular/core';
import {GalleryItemDto} from '../../../model/dto/GalleryItemDto';

@Component({
  selector: 'app-gallery-component',
  standalone: false,
  templateUrl: './gallery-component.html',
  styleUrl: './gallery-component.css'
})
export class GalleryComponent {
  galleryItemSelected: number | null = null;

  galleryItems: GalleryItemDto[] = [
    new GalleryItemDto('123', 'images/sila.jpg', 'Description for image 1', new Date('2023-01-01'), true),
    new GalleryItemDto('124', 'images/sila.jpg', 'Description for image 2', new Date('2023-02-01')),
    new GalleryItemDto('125', 'images/sila.jpg', 'Description for image 3', new Date('2023-03-01')),
    new GalleryItemDto('126', 'images/sila.jpg', 'Description for image 4', new Date('2023-04-01')),
    new GalleryItemDto('127', 'images/sila.jpg', 'Description for image 5', new Date('2023-05-01')),
    new GalleryItemDto('128', 'images/sila.jpg', 'Description for image 6', new Date('2023-06-01')),
  ]
}
