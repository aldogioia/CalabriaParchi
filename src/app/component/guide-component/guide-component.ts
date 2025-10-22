import {Component, Input} from '@angular/core';
import {GuideDto} from '../../model/dto/GuideDto';
import {GlobalHandler} from '../../utils/GlobalHandler';

@Component({
  selector: 'app-guide-component',
  standalone: false,
  templateUrl: './guide-component.html',
  styleUrl: './guide-component.css'
})
export class GuideComponent {
  @Input({ required: true })
  guideDto!: GuideDto;
  protected readonly GlobalHandler = GlobalHandler;
}

