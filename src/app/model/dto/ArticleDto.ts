export class ArticleDto{
  id: string;
  title: string;
  englishTitle: string;
  paragraphs: string[];
  englishParagraphs: string[];
  imageUrl: string;
  parkId: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.englishTitle = data.englishTitle || '';
    this.paragraphs = data.paragraphs || [];
    this.englishParagraphs = data.englishParagraphs || [];
    this.imageUrl = data.imageUrl || '';
    this.parkId = data.parkId || '';
  }
}
