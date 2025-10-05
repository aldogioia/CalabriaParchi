export class ParkDto {
  id: string;
  name: string;
  englishName: string;
  imageUrl: string;
  isMarine: boolean

  constructor(data:any) {
    this.id = data.id;
    this.name = data.name;
    this.englishName = data.englishName;
    this.imageUrl = data.imageUrl;
    this.isMarine = data.isMarine;
  }
}
