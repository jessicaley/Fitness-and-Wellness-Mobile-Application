import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { Workout } from '../services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit, OnDestroy {
  progress = 0;
  completedWorkouts: Workout[] = [];
  private workoutsSub!: Subscription;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workoutsSub = this.workoutService.workouts$.subscribe(workouts => {
      this.completedWorkouts = workouts.filter(w => w.completed);
      this.progress = workouts.length > 0 
        ? Math.round((this.completedWorkouts.length / workouts.length) * 100)
        : 0;
    });
  }

  async resetProgress() {
    await this.workoutService.resetProgress();
  }

  ngOnDestroy() {
    if (this.workoutsSub) {
      this.workoutsSub.unsubscribe();
    }
  }
}