import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-article-component',
  standalone: false,
  templateUrl: './article-component.html',
  styleUrl: './article-component.css'
})
export class ArticleComponent {
  @Input() title: string = '';
  @Input() paragraphs: string[] = [];
  @Input() image: string | null = null;
}
