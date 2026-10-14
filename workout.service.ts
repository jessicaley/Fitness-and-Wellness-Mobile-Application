import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

export interface Workout {
  id: number;
  name: string;
  description: string;
  exercises: string[];
  duration: number;
  equipment: string[];
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private workoutsSubject = new BehaviorSubject<Workout[]>([]);
  workouts$ = this.workoutsSubject.asObservable();

  private defaultWorkouts: Workout[] = [
    {
      id: 1,
      name: 'Weight Loss Program',
      description: 'High-intensity interval training for fat burning',
      exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers'],
      duration: 30,
      equipment: ['Mat', 'Dumbbells'],
      completed: false
    },
    {
      id: 2,
      name: 'Muscle Gain Program',
      description: 'Strength training for muscle growth',
      exercises: ['Squats', 'Deadlifts', 'Bench Press'],
      duration: 45,
      equipment: ['Barbell', 'Weight Plates'],
      completed: false
    },
    {
      id: 3,
      name: 'Cardio Blast',
      description: 'Heart-pumping cardiovascular workout',
      exercises: ['Running', 'Cycling', 'Jump Rope'],
      duration: 40,
      equipment: ['Treadmill', 'Exercise Bike'],
      completed: false
    },
    {
      id: 4,
      name: 'Flexibility Flow',
      description: 'Yoga-based stretching and mobility',
      exercises: ['Downward Dog', 'Warrior Pose', 'Tree Pose'],
      duration: 35,
      equipment: ['Yoga Mat', 'Blocks'],
      completed: false
    }
  ];

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async getWorkouts(): Promise<Workout[]> {
    return await this.storage.get('workouts') || [];
  }

  async getWorkoutById(id: number): Promise<Workout | undefined> {
    const workouts = await this.getWorkouts();
    return workouts.find(w => w.id === id);
  }

  async resetProgress(): Promise<void> {
    let workouts = await this.getWorkouts();
    workouts = workouts.map(w => ({...w, completed: false}));
    await this.storage.set('workouts', workouts);
    this.workoutsSubject.next(workouts);
  }

  private async initStorage() {
    await this.storage.create();
    
    
    const storedWorkouts = await this.storage.get('workouts');
    
    if (!storedWorkouts || storedWorkouts.length === 0) {
      console.log('Initializing default workouts');
      await this.storage.set('workouts', this.defaultWorkouts);
    }
    
    const currentWorkouts = await this.getWorkouts();
    console.log('Current workouts in storage:', currentWorkouts);
    this.workoutsSubject.next(currentWorkouts);
  }

  async toggleCompletion(id: number): Promise<void> {
    const workouts = await this.getWorkouts();
    const index = workouts.findIndex(w => w.id === id);
    if (index > -1) {
      workouts[index].completed = !workouts[index].completed;
      await this.storage.set('workouts', workouts);
      this.workoutsSubject.next(workouts);
      
      // Update streak when marking complete
      if (workouts[index].completed) {
        await this.storage.set('lastCompletedDate', new Date().toISOString().split('T')[0]);
      }
    }
  }
}