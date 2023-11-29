import { NgModule } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

import { routes } from './dogs.routes';

import { DogsComponent } from './dogs.component';
import { DogListComponent } from './dog-list/dog-list.component';
import { DogItemComponent } from './dog-item/dog-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreedDetailComponent } from './breed-detail/breed-detail.component';

@NgModule({
  imports: [SharedModule, RouterModule, FormsModule, ReactiveFormsModule],
  declarations: [
    DogsComponent,
    DogListComponent,
    DogItemComponent,
    BreedDetailComponent
  ],
  providers: [provideRouter(routes)]
})
export class DogsModule {}
