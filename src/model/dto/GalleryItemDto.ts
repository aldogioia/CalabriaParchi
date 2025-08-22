export class GalleryItemDto {
  id: string
  imageUrl: string
  description: string

  constructor(data: any) {
    this.id = data.id || '';
    this.imageUrl = data.imageUrl || '';
    this.description = data.description || '';
  }
}
