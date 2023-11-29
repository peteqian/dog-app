import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DogResolver } from '@shared/resolver/dog.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'all-breeds',
    pathMatch: 'full'
  },
  {
    path: 'all-breeds',
    loadChildren: () => import('./dogs/dogs.module').then((m) => m.DogsModule),
    resolve: {
      dogs: DogResolver
    }
  },
  {
    path: 'main-breeds',
    loadChildren: () => import('./dogs/dogs.module').then((m) => m.DogsModule),
    resolve: {
      dogs: DogResolver
    }
  },
  {
    path: 'random',
    loadComponent: () =>
      import('./random/random.component').then((m) => m.RandomComponent)
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
