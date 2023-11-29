import { Component, inject, Input, OnInit } from '@angular/core';
import { DogService, MessageService } from '@shared/services';
import { Dog, Post } from '@shared/model';
import { DogStore } from '@shared/store/dog.store';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  debounceTime,
  defer,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  share,
  Subscription,
  switchMap,
  tap
} from 'rxjs';
import { ErrorDetails } from '@shared/libs/store';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'dog-list',
  template: `
    <h1>Breeds</h1>
    <div class="row">
      <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
        <input
          type="search"
          class="form-control "
          placeholder="Search..."
          [formControl]="searchControl"
        />
      </form>
    </div>
    <div class="row text-center">
      <div class="col-xs-12">
        <div class="vstack gap-3">
          <ng-container
            *ngIf="
              areMinimumCharactersTyped$ | async;
              else lessThanMinimumCharactersTyped
            "
          >
            <ng-container *ngIf="areNoResultsFound$ | async; else results">
              No Results found.
            </ng-container>
            <ng-template #results>
              Results:
              <dog-item
                *ngFor="let result of searchResults$ | async"
                [dog]="result"
              ></dog-item>
            </ng-template>
          </ng-container>

          <ng-template #lessThanMinimumCharactersTyped>
            @if( error$ | async; as errorMessage){
            <p>{{ errorMessage }}</p>
            }
            <!-- If no errors -->
            @if(dogState.length > 0 && !(loading$ |async) ) {
            <dog-item *ngFor="let breed of dogState" [dog]="breed"></dog-item>
            } @else if(dogState.length === 0 && (loading$ |async)) {
            <p data-test="dog-list.fetching">Fetching list</p>
            } @else {
            <p>Nothing here.</p>
            }
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class DogListComponent implements OnInit {
  private dogStore: DogStore = inject(DogStore);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private messageService: MessageService = inject(MessageService);
  private subscription!: Subscription;

  // Component State
  dogState: Dog[] = [];
  loading$: Observable<boolean> = this.dogStore.selectLoading('dogs');
  error$: Observable<string | undefined> = this.dogStore
    .selectErrorDetails('dogs')
    .pipe(
      switchMap((data) => {
        if (!data) {
          return of(undefined);
        }
        let errorMessages: HttpErrorResponse = JSON.parse(JSON.stringify(data));
        return of(errorMessages.message);
      })
    );

  // Form State
  searchControl!: FormControl;
  searchResults$!: Observable<Dog[]>;
  areMinimumCharactersTyped$!: Observable<boolean>;
  areNoResultsFound$!: Observable<boolean>;

  ngOnInit(): void {
    this.subscription = this.dogStore.dogs$.subscribe((dogs) => {
      this.dogState = dogs;
    });

    this.searchControl = this.formBuilder.control('');

    this.areMinimumCharactersTyped$ = this.searchControl.valueChanges.pipe(
      map((searchString) => searchString.length >= 1)
    );

    const searchString$ = merge(
      defer(() => of(this.searchControl.value)),
      this.searchControl.valueChanges
    ).pipe(debounceTime(1000), distinctUntilChanged());

    this.searchResults$ = searchString$.pipe(
      switchMap((searchString: string) => {
        return this.performSearch(searchString);
      }),
      share()
    );

    this.areNoResultsFound$ = this.searchResults$.pipe(
      map((results) => results.length === 0)
    );
  }

  performSearch(searchString: string): Observable<Dog[]> {
    return of(this.dogStore.getDogs()).pipe(
      map((dogs) =>
        dogs.filter((dog) =>
          dog.breed.toLowerCase().includes(searchString.toLowerCase())
        )
      ),
      tap((results) =>
        console.log("Search Term '", searchString, "' was found.", results)
      )
    );
  }
}
