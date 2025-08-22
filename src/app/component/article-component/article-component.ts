import {Component, Input} from '@angular/core';
import {ArticleDto} from '../../../model/dto/ArticleDto';

@Component({
  selector: 'app-article-component',
  standalone: false,
  templateUrl: './article-component.html',
  styleUrl: './article-component.css'
})
export class ArticleComponent {
  @Input({required: true})
  articleDto!: ArticleDto;
}
