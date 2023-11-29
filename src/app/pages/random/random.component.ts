import { Component, inject, OnInit } from '@angular/core';
import { DogService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'dogs',
  standalone: true,
  imports: [SharedModule],
  templateUrl: 'random.component.html',
  styleUrls: ['random.component.scss']
})
export class RandomComponent implements OnInit {
  private dogService: DogService = inject(DogService);

  dogImage: string = '';

  ngOnInit(): void {
    this.getRandomImage();
  }

  getRandomImage() {
    this.dogService.getRandomImage().subscribe((data) => {
      this.dogImage = typeof data.message === 'string' ? data.message : '';
    });
  }
}
