export class ArticleDto{
  id: string;
  title: string;
  paragraphs: string[];
  imageUrl: string;
  parkId: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.paragraphs = data.paragraphs || [];
    this.imageUrl = data.imageUrl || '';
    this.parkId = data.parkId || '';
  }
}
