import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { Dog, Post } from '@shared/model';
import { MessageService } from '../messages';
import { DogStore } from '@shared/store/dog.store';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private http: HttpClient = inject(HttpClient);
  private dogStore: DogStore = inject(DogStore);
  private messageService: MessageService = inject(MessageService);

  getAllBreeds(): Observable<Post> {
    return this.http.get<Post>('https://dog.ceo/api/breeds/list/all').pipe(
      tap((_) => {
        this.dogStore.selectLoading('dogs');
        this.dogStore.setErrorState('dogs', null);
        this.log(`(Dog Service) - getAllBreeds called`);
      }),
      map((data) => {
        const dogs: Dog[] = Object.entries(data.message).flatMap(
          ([key, values]) =>
            values.length === 0
              ? ({ breed: `${key}` } as Dog)
              : values.map((value: string) => {
                  return { breed: `${key}-${value}` } as Dog;
                })
        );

        this.dogStore.setDogs(dogs);
        this.dogStore.selectLoaded('dogs');
        return data;
      }),
      catchError((data: HttpErrorResponse) => {
        this.dogStore.selectLoaded('dogs');
        this.dogStore.setErrorState('dogs', data);
        return throwError(
          this.handleError<Post>(
            '(Dog Service) - getAllBreeds failed',
            undefined
          )
        );
      })
    );
  }

  getMainBreeds(): Observable<Post> {
    return this.http.get<Post>('https://dog.ceo/api/breeds/list/all').pipe(
      tap((_) => {
        this.dogStore.selectLoading('dogs');
        this.log(`(Dog Service) - getMainBreeds called`);
      }),
      map((data) => {
        const dogs: Dog[] = Object.entries(data.message).map(
          ([key, values]) => {
            if (values.length !== 0) {
              for (let breed of values) {
                return { breed: key, subBreed: values };
              }
            }
            return { breed: key };
          }
        );
        this.dogStore.setDogs(dogs);
        this.dogStore.selectLoaded('dogs');
        return data;
      }),
      catchError(() => {
        this.dogStore.selectLoaded('dogs');
        return throwError(
          this.handleError<Post>(
            '(Dog Service) - getMainBreeds failed',
            undefined
          )
        );
      })
    );
  }

  getBreeds(breed: string) {
    return this.http.get<Post>(`https://dog.ceo/api/breed/${breed}/list`).pipe(
      tap((_) => this.log(`(Dog Service) - getSubBreeds called`)),
      catchError(
        this.handleError<Post>('(Dog Service) - getSubBreeds failed', {
          message: '',
          status: ''
        })
      )
    );
  }

  getSubBreeds(breed: string) {
    return this.http.get<Post>(`https://dog.ceo/api/breed/${breed}/list`).pipe(
      tap((_) => this.log(`(Dog Service) - getSubBreeds called`)),
      catchError(
        this.handleError<Post>('(Dog Service) - getSubBreeds failed', {
          message: '',
          status: ''
        })
      )
    );
  }

  getRandomImagesByBreed(breed: string): Observable<string[]> {
    return this.http
      .get<Post>(`https://dog.ceo/api/breed/${breed}/images`)
      .pipe(
        tap((data: Post) =>
          this.log(`(Dog Service) - getRandomDogImagesByBreed result`)
        ),
        map((data: Post) => {
          if (!Array.isArray(data.message)) {
            return [];
          }
          return data.message;
        }),

        catchError(
          this.handleError<string[]>(
            '(Dog Service) - getRandomDogImagesByBreed failed',
            []
          )
        )
      );
  }

  getRandomImageByBreed(breed: string): Observable<string> {
    return this.http
      .get<Post>(`https://dog.ceo/api/breed/${breed}/images/random`)
      .pipe(
        map((data: any) => data.message),
        tap((_) => this.log(`(Dog Service) - getRandomDogImageByBreed called`)),
        catchError(
          this.handleError<string>(
            '(Dog Service) - getRandomDogImageByBreed failed'
          )
        )
      );
  }

  getRandomImage(): Observable<Post> {
    return this.http.get<Post>('https://dog.ceo/api/breeds/image/random').pipe(
      tap((_) => this.log(`(Dog Service) - getRandomDogImage called`)),
      catchError(
        this.handleError<Post>(
          '(Dog Service) - getRandomDogImageByBreed failed',
          {
            message: '',
            status: ''
          }
        )
      )
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`Dog Service: ${message}`);
  }
}
