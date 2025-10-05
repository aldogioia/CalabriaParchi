export class TagDto {
  id: string;
  name: string;
  englishName: string;
  color: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.englishName = data.englishName || '';
    this.color = data.color || '';
  }
}
