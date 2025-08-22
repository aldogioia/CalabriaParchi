import {InterestType} from '../enum/InterestType';
import {TagDto} from './TagDto';
import {CategoryDto} from './CategoryDto';
import {ParkDto} from './ParkDto';

export class InterestDto{
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  park: ParkDto;
  phoneNumber: string | null = null;
  website: string | null = null;
  interestType: InterestType;
  categories: CategoryDto[];
  tags: TagDto[];

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.imageUrl = data.imageUrl || '';
    this.park = data.park || null;
    this.phoneNumber = data.phoneNumber || null;
    this.website = data.website || null;
    this.interestType = data.interestType || '';
    this.categories = data.categories || [];
    this.tags = data.tags || [];
  }
}
