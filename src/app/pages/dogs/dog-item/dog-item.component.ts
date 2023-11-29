import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dog } from '@shared/model';
import { DogService } from '@shared/services';

@Component({
  selector: 'dog-item',
  template: `
    <div
      class="p-2 p-3 rounded-pill"
      [ngClass]="!dogLink.isActive ? 'text-bg-secondary' : 'text-bg-primary'"
    >
      <li
        style="cursor: pointer;"
        [routerLink]="[id]"
        routerLinkActive="{ exact: true }"
        #dogLink="routerLinkActive"
        class="list-group-item clearfix "
      >
        <div class="pull-left">
          <h4 class="list-group-item-heading">{{ dog?.breed }}</h4>
        </div>
      </li>
    </div>
  `
})
export class DogItemComponent implements OnInit {
  @Input() dog: Dog | null = null;
  id: string | undefined = '';

  ngOnInit(): void {
    this.id = this.dog?.breed;
  }

  processSubBreed(dogBreed: string | undefined): string | undefined {
    if (dogBreed?.includes('-')) {
      const [breed, subBreed] = dogBreed.split('-');
      return `${breed}-${subBreed}`;
    }

    return dogBreed;
  }
}
