import { Routes } from '@angular/router';
import { DogsComponent } from './dogs.component';
import { BreedDetailComponent } from './breed-detail/breed-detail.component';
import { DogResolver } from '@shared/resolver/dog.resolver';

export const routes: Routes = [
  {
    path: '',
    component: DogsComponent,
    children: [
      {
        path: ':breed',
        component: BreedDetailComponent,
        resolve: {
          dogs: DogResolver
        }
      }
    ]
  }
];
