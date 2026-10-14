import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page implements OnInit, OnDestroy {
  completedCount = 0;
  currentStreak = 0;
  private workoutsSub!: Subscription;

  constructor(
    private workoutService: WorkoutService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.workoutsSub = this.workoutService.workouts$.subscribe(workouts => {
      this.completedCount = workouts.filter(w => w.completed).length;
      this.calculateStreak();
    });
  }

  private async calculateStreak() {
    const lastCompletedDate = await this.storage.get('lastCompletedDate');
    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
    
    if (lastCompletedDate) {
      const lastDate = new Date(lastCompletedDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

      this.currentStreak = diffDays === 1 ? (await this.storage.get('streak')) || 0 + 1 : 0;
    }
    
    await this.storage.set('streak', this.currentStreak);
    await this.storage.set('lastCompletedDate', today);
  }

  ngOnDestroy() {
    if (this.workoutsSub) {
      this.workoutsSub.unsubscribe();
    }
  }
}