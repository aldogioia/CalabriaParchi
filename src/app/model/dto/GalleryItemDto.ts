export class GalleryItemDto {
  id: string
  parkId: string
  imageUrl: string
  description: string
  englishDescription: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.parkId = data.parkId || '';
    this.imageUrl = data.imageUrl || '';
    this.description = data.description || '';
    this.englishDescription = data.englishDescription || '';
  }
}
