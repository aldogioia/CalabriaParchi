import {TagDto} from './TagDto';

export class ActivityDto {
  constructor(
    public id: string,
    public name: string,
    public paragraphs: string[],
    public imageUrl: string,
    public tags: TagDto[],
  ) {}
}
