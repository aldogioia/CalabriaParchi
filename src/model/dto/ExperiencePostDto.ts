import {ExperiencePostAbstract} from '../abstract/ExperiencePostAbstract';
import {ParkDto} from './ParkDto';

export class ExperiencePostDto extends ExperiencePostAbstract {
  id: string;
  imageUrl: string
  park: ParkDto

  constructor(data: any) {
    super(data);
    this.id = data.id;
    this.imageUrl = data.imageUrl
    this.park = data.park
  }
}
