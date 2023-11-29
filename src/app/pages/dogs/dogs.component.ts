import { Component, inject, OnInit } from '@angular/core';
import { Dog } from '@shared/model';
import { DogService } from '@shared/services';

@Component({
  selector: 'dogs',
  templateUrl: 'dogs.component.html',
  styleUrls: ['dogs.component.scss']
})
export class DogsComponent implements OnInit {
  ngOnInit() {}
}
