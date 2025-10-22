export class GuideDto {
  id: string;
  name: string;
  englishName: string;
  imagePreviewUrl: string;
  pdfUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.englishName = data.englishName;
    this.imagePreviewUrl = data.imagePreviewUrl;
    this.pdfUrl = data.pdfUrl;
  }
}
