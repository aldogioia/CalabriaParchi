import {Component, Input} from '@angular/core';
import {ExperiencePostDto} from '../../model/dto/ExperiencePostDto';

@Component({
  selector: 'app-experience-card-component',
  standalone: false,
  templateUrl: './experience-card-component.html',
  styleUrl: './experience-card-component.css'
})
export class ExperienceCardComponent {
  @Input({required : true})
  experiencePostDto!: ExperiencePostDto
}
