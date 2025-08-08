export class GalleryItemDto {
  constructor(
    public id: string,
    public image: string,
    public description: string,
    public date: Date,
    public important: boolean = false
  ) {}
}
