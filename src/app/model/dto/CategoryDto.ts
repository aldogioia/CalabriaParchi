export class CategoryDto {
  id: string;
  name: string;
  englishName: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.englishName = data.englishName || '';
  }
}
