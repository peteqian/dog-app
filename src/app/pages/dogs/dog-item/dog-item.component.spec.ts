import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DogItemComponent } from './dog-item.component';
import { Dog } from '@shared/model';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('DogItemComponent', () => {
  let component: DogItemComponent;
  let fixture: ComponentFixture<DogItemComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DogItemComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DogItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  it('GIVEN - initial state - WHEN - instantiating - THEN - it should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('GIVEN - a dog - WHEN - ngOnInit is called - THEN - it should set id to dog breed on initialization', () => {
    // ARRANGE
    const dog: Dog = { breed: 'Labrador', subBreed: [] };
    component.dog = dog;

    // ACT
    component.ngOnInit();

    // ASSERT
    expect(component.id).toBe(dog.breed);
  });

  it('GIVEN - a dog - WHEN - processSubBreed is called - THEN - should process sub breed correctly', () => {
    // ARRANGE
    const dogBreed = 'Labrador-Golden';
    // ACT
    const processedBreed = component.processSubBreed(dogBreed);
    // ASSERT
    expect(processedBreed).toBe(dogBreed);
  });

  it('GIVEN - a dog - WHEN - processSubBreed is called - THEN - it should return same breed if no sub breed', () => {
    const dogBreed = 'Labrador';
    const processedBreed = component.processSubBreed(dogBreed);
    expect(processedBreed).toBe(dogBreed);
  });
});
