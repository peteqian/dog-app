import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Dog, Post } from '@shared/model';
import { DogService } from '@shared/services';
import { DogStore } from '@shared/store/dog.store';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogResolver {
  constructor(private dogStore: DogStore, private dogService: DogService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Dog[]> | Promise<Dog[]> | Dog[] {
    const getMainBreeds = state.url.includes('main-breeds');

    let getBreeds$!: Observable<Post>;

    if (getMainBreeds) {
      getBreeds$ = this.dogService.getMainBreeds();
    } else {
      getBreeds$ = this.dogService.getAllBreeds();
    }

    return getBreeds$.pipe(
      map(() => {
        return this.dogStore.getDogs();
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }
}
