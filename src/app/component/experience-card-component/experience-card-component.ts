import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-experience-card-component',
  standalone: false,
  templateUrl: './experience-card-component.html',
  styleUrl: './experience-card-component.css'
})
export class ExperienceCardComponent {
  @Input() name: string = '';
  @Input() surname: string = '';
  @Input() description: string = '';
  @Input() location: string = '';
  @Input() image: string = '';
}
