import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks
} from '@angular/core/testing';
import { BreedDetailComponent } from './breed-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DogService } from '@shared/services';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Dog, Post } from '@shared/model';
import { DogStore } from '@shared/store/dog.store';

describe('BreedDetailComponent', () => {
  let component: BreedDetailComponent;
  let fixture: ComponentFixture<BreedDetailComponent>;
  let dogService: DogService;
  let dogServiceSpy: jasmine.SpyObj<DogService>;
  let dogStore: DogStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreedDetailComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ breed: 'Labrador' } as Dog)
          }
        },
        DogStore,
        DogService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedDetailComponent);
    component = fixture.componentInstance;
    dogService = TestBed.inject(DogService);
    dogServiceSpy = TestBed.inject(DogService) as jasmine.SpyObj<DogService>;
    dogStore = TestBed.inject(DogStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('GIVEN - a dog with a breed only - WHEN - instantiating - THEN - it should set breed on initialization', () => {
    // ARRANGE
    spyOn(dogStore, 'getDog').and.returnValue({ breed: 'Labrador' } as Dog);

    // ACT
    component.ngOnInit();

    // ARRANGE
    expect(component.breed).toBe('Labrador');
  });

  it('GIVEN - a dog with subBreeds - WHEN - instantiating - THEN - it should set subBreeds', () => {
    // ARRANGE
    spyOn(dogStore, 'getDog').and.returnValue({
      breed: 'Labrador',
      subBreed: ['breed-one']
    } as Dog);

    spyOn(dogService, 'getSubBreeds').and.returnValue(
      of({ message: ['breed-one'] } as Post)
    );

    // ACT
    component.ngOnInit();

    // ARRANGE
    expect(component.subBreeds).toEqual(['breed-one']);
  });
});
