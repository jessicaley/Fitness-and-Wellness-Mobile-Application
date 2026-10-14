import { Component } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page {
  workouts$ = this.workoutService.workouts$;

  constructor(
    private workoutService: WorkoutService,
    private router: Router
  ) {

  }

  viewWorkoutDetails(workoutId: number) {
    this.router.navigate(['/workout-details', workoutId]);
  }
}