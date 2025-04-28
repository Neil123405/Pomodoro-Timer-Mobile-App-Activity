import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  // Timer settings (2 min work, 1 min break for testing)
  private workDuration = 25 * 60; // 2 minutes in seconds
  private breakDuration = 5 * 60; // 1 minute in seconds

  // Timer state
  private timer: any;
  timeLeft$ = new BehaviorSubject<number>(this.workDuration);
  isRunning$ = new BehaviorSubject<boolean>(false);
  isWorkTime$ = new BehaviorSubject<boolean>(true);
  endTime$ = new BehaviorSubject<string>('');

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    
    // Consistent calculation using milliseconds
    const duration = this.isWorkTime$.value ? this.workDuration : this.breakDuration;
    const endTime = new Date(Date.now() + duration * 1000);
    this.endTime$.next(
      endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    
    this.isRunning$.next(true);
    this.timer = setInterval(() => this.tick(), 1000);
  }

  private tick() {
    const currentTime = this.timeLeft$.value;
    if (currentTime <= 0) {
      this.switchSession();
    } else {
      this.timeLeft$.next(currentTime - 1);
    }
  }

  private switchSession() {
    const isWorkTime = !this.isWorkTime$.value;
    this.isWorkTime$.next(isWorkTime);
    
    const newDuration = isWorkTime ? this.workDuration : this.breakDuration;
    this.timeLeft$.next(newDuration);

    // Same calculation method as startTimer()
    const endTime = new Date(Date.now() + newDuration * 1000);
    this.endTime$.next(
      endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );

    this.startTimer();
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.isRunning$.next(false);
  }

  resetTimer() {
    this.pauseTimer();
    const duration = this.isWorkTime$.value ? this.workDuration : this.breakDuration;
    this.timeLeft$.next(duration);
    this.endTime$.next(''); // Clear end time display
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}