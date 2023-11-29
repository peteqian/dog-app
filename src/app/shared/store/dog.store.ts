import { Injectable } from '@angular/core';
import { ManagedStore } from '@shared/libs/store';
import { Dog } from '@shared/model';
import { Observable } from 'rxjs';

export interface DogState {
  dogs: Dog[] | [];
}

const initialDogState = {
  dogs: []
};

@Injectable({
  providedIn: 'root'
})
export class DogStore extends ManagedStore<DogState> {
  public readonly dogs$: Observable<Dog[]> = this.select((state) => state.dogs);

  constructor() {
    super(initialDogState);
  }

  public getDogs(): Dog[] {
    return this.state.dogs;
  }

  public setDogs(dogs: Dog[]): void {
    this.setState((state) => ({ ...state, dogs }));
  }

  public getDog(dog: Dog): Dog | undefined {
    return this.state.dogs.find(
      (currentDogs) => currentDogs.breed === dog.breed
    );
  }
}
