import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
 private _workDuration = 25 * 60; // Default 25 minutes
 private _breakDuration = 5 * 60;  // Default 5 minutes

  // Timer state
  private timer: any;
  timeLeft$ = new BehaviorSubject<number>(this._workDuration);
  isRunning$ = new BehaviorSubject<boolean>(false);
  isWorkTime$ = new BehaviorSubject<boolean>(true);
  endTime$ = new BehaviorSubject<string>('');
  settingsChanged$ = new BehaviorSubject<boolean>(false);

  // Public getters for current settings
  get workDurationSeconds() {
    return this._workDuration;
  }

  get breakDurationSeconds() {
    return this._breakDuration;
  }

  updateSettings(workSeconds: number, breakSeconds: number) {
    this._workDuration = workSeconds;
    this._breakDuration = breakSeconds;
    
    if (this.isRunning$.value) {
      this.resetTimer();
    }
    
    this.settingsChanged$.next(true);
  }

  startTimer() {
    if (this.timer) clearInterval(this.timer);
    
    const duration = this.isWorkTime$.value ? this._workDuration : this._breakDuration;
    const endTime = new Date(Date.now() + duration * 1000);
    this.endTime$.next(
      endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    
    this.timeLeft$.next(duration);
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
    
    const newDuration = isWorkTime ? this._workDuration : this._breakDuration;
    this.timeLeft$.next(newDuration);

    // Same calculation method as startTimer()
    const endTime = new Date(Date.now() + newDuration * 1000);
    this.endTime$.next(
      endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );

    this.startTimer();
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.isRunning$.next(false);
  }

  resetTimer() {
    this.pauseTimer();
    const duration = this.isWorkTime$.value ? this._workDuration : this._breakDuration;
    this.timeLeft$.next(duration);
    this.endTime$.next(''); 
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}