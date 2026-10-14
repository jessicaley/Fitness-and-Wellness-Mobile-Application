import { Component } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';
import { ActivatedRoute } from '@angular/router';
import { Workout } from '../../services/workout.service';  

@Component({
  selector: 'app-workout-details',
  templateUrl: './workout-details.page.html',
  styleUrls: ['./workout-details.page.scss'],
  standalone: false
})
export class WorkoutDetailsPage {
  workout?: Workout;

  constructor(
    private route: ActivatedRoute,
    private workoutService: WorkoutService
  ) {}

  async ionViewWillEnter() {
    const workoutId = +this.route.snapshot.paramMap.get('id')!;
    this.workout = await this.workoutService.getWorkoutById(workoutId);
  }

  async toggleCompletion() {
    if (this.workout) {
      await this.workoutService.toggleCompletion(this.workout.id);
      this.workout.completed = !this.workout.completed;
    }
  }
}