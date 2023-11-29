import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DogService } from './dog.service';
import { MessageService } from '../messages';
import { DogStore } from '@shared/store/dog.store';
import { Dog, Post } from '@shared/model';

describe('DogService', () => {
  let service: DogService;
  let httpTestingController: HttpTestingController;
  let dogStore: DogStore;

  const dummyData: Post = {
    message: { breed1: [], breed2: ['sub1', 'sub2'] },
    status: 'success'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DogService, MessageService, DogStore]
    });

    service = TestBed.inject(DogService);
    httpTestingController = TestBed.inject(HttpTestingController);
    dogStore = TestBed.inject(DogStore);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('GIVEN - initial state- WHEN - instantiating - THEN - it should be created', () => {
    expect(service).toBeTruthy();
  });

  it('GIVEN - getAllBreeds endpoint has a valid response - WHEN - calling for getAllBreeds - THEN - it should get all breeds successfully', () => {
    // ARRANGE

    // ACT
    service.getAllBreeds().subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpTestingController.expectOne(
      'https://dog.ceo/api/breeds/list/all'
    );

    // ARRANGE
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('GIVEN - getAllBreeds endpoint has an error - WHEN - calling for getAllBreeds- THEN - should handle an error when getting all breeds', () => {
    service.getAllBreeds().subscribe(
      () => {},
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpTestingController.expectOne(
      'https://dog.ceo/api/breeds/list/all'
    );
    req.error(new ErrorEvent('Network error'));
  });

  it('GIVEN - getMainBreeds endpoint has a valid response - WHEN - calling for getMainBreeds - THEN - it should get main breeds successfully', () => {
    service.getMainBreeds().subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpTestingController.expectOne(
      'https://dog.ceo/api/breeds/list/all'
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
