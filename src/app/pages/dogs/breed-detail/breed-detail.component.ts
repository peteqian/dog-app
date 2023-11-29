import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, of, Subscription, switchMap } from 'rxjs';

import { DogService } from '@shared/services';
import { DogState, DogStore } from '@shared/store/dog.store';
import { Dog, Post } from '@shared/model';

@Component({
  selector: 'breed-detail',
  template: `
    <div class="container ">
      <div class="col-xs-12">
        <h1>{{ breed }}</h1>
        <div class="dropdown">
          @if(subBreeds.length > 0){
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            (click)="toggleDropdown()"
          >
            Select a breed
          </button>
          <ul
            class="dropdown-menu text-center"
            [ngClass]="{ show: showDropdown }"
          >
            @for(subBreed of subBreeds; track subBreed){
            <li>
              <button class="dropdown-item" (click)="onChange(subBreed)">
                {{ subBreed }}
              </button>
            </li>
            }
          </ul>
          }
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          @for(image of images; track $index){
          <img
            [src]="image"
            alt="{{ image }}"
            class="img-responsive"
            style="max-height: 256px;"
          />
          }
        </div>
      </div>
    </div>
  `
})
export class BreedDetailComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private dogService: DogService = inject(DogService);
  private dogStore: DogStore = inject(DogStore);
  private subscription!: Subscription;

  dog: Dog | undefined;
  breed: string = '';
  subBreeds: string[] = [];
  images: string[] = [];
  error: string = '';
  showDropdown: boolean = false;

  ngOnInit() {
    this.subscription = this.dogStore
      .selectLoading('dogs')
      .pipe(filter((isLoading) => !isLoading))
      .subscribe(() => {
        return this.route.params
          .pipe(
            map((params) => {
              this.reset();

              const dogBreed = params['subBreed']
                ? `${params['breed']}/${params['subBreed']}`
                : `${params['breed']}`;

              const dog = this.dogStore.getDog({ breed: dogBreed } as Dog);

              if (dog?.subBreed) {
                this.dogService
                  .getSubBreeds(dogBreed)
                  .subscribe(
                    (data: Post) =>
                      (this.subBreeds = Array.isArray(data.message)
                        ? data.message
                        : [])
                  );
              }

              return dog;
            }),
            switchMap((dog: Dog | undefined) => {
              if (!dog) {
                return of(null);
              }

              this.breed = dog.breed;

              if (dog.subBreed) {
                return of(null);
              }

              if (dog.breed.includes('-')) {
                dog.breed = dog.breed.replace('-', '/');
              }

              return this.dogService.getRandomImagesByBreed(dog.breed);
            })
          )
          .subscribe((data: string[] | null) => {
            if (!data) {
              return;
            }

            this.images = data;
          });
      });
  }

  public reset(): void {
    this.breed = '';
    this.subBreeds = [];
    this.images = [];
  }

  public onChange(value: string) {
    this.showDropdown = !this.showDropdown;
    this.dogService
      .getRandomImagesByBreed(`${this.breed}/${value}`)
      .subscribe((data) => (this.images = data));
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}
