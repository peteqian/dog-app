import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DogListComponent } from './dog-list.component';
import { DogItemComponent } from '../dog-item/dog-item.component';
import { DogStore } from '@shared/store/dog.store';
import { MessageService } from '@shared/services';

describe('DogListComponent', () => {
  let component: DogListComponent;
  let fixture: ComponentFixture<DogListComponent>;
  let dogStore: DogStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DogListComponent, DogItemComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterModule],
      providers: [
        DogStore,
        MessageService,
        { provide: ActivatedRoute, useValue: () => {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogListComponent);
    dogStore = TestBed.inject(DogStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('GIVEN - initial state - WHEN - instantiating - THEN - it should create', () => {
    expect(component).toBeTruthy();
  });

  // Test for ngOnInit method
  it('GIVEN - some dogs - WHEN - ngOnInit - THEN - it should initialize with some dogs', fakeAsync(() => {
    // ARRANGE
    const dogs = [
      { breed: 'Labrador', subBreed: ['Golden', 'Black'] },
      { breed: 'Poodle', subBreed: [] }
    ];
    dogStore.setDogs(dogs);
    // ACT
    fixture.detectChanges();
    flushMicrotasks();
    component.ngOnInit();

    // ASSERT
    expect(component.dogState).toEqual(dogs);
  }));

  it('GIVEN - searchTerm - WHEN - searching - THEN - it should return some dog for given dogs', fakeAsync(() => {
    // ARRANGE
    const dogs = [
      { breed: 'Labrador', subBreed: [] },
      { breed: 'Poodle', subBreed: [] }
    ];
    dogStore.setDogs(dogs);

    // ACT
    fixture.detectChanges();
    flushMicrotasks();

    // ASSERT
    component.performSearch('Lab').subscribe((results) => {
      expect(results.length).toBe(1);
      expect(results[0].breed).toBe('Labrador');
    });
  }));

  it('GIVEN - searchTerm - WHEN - searching - THEN - it should perform search correctly', fakeAsync(() => {
    // ARRANGE
    const dogs = [
      { breed: 'Labrador', subBreed: ['Golden', 'Black'] },
      { breed: 'Poodle', subBreed: [] }
    ];
    dogStore.setDogs(dogs);
    // ACT
    fixture.detectChanges();
    flushMicrotasks();

    // ASSERT
    component.performSearch('Bulldog').subscribe((results) => {
      expect(results.length).toBe(0);
    });
  }));
});
