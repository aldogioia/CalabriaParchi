export class ParkDto {
  id: string;
  name: string;
  imageUrl: string;
  isMarine: boolean

  constructor(data:any) {
    this.id = data.id;
    this.name = data.name;
    this.imageUrl = data.imageUrl;
    this.isMarine = data.isMarine;
  }
}
