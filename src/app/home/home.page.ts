import { Component, OnInit, OnDestroy } from '@angular/core';
import { PomodoroService } from '../services/pomodoro.service';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit, OnDestroy {
  currentTime = '';
  endTime = '';
  timeLeft = '00:10';
  isRunning = false;
  isWorkTime = true;
  private subs: Subscription[] = [];
  showSettings = false;
  clockInterval: any;

  constructor(
    private timerService: PomodoroService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationService.initialize();
    this.startClock();

    this.timeLeft = this.timerService.formatTime(
      this.timerService.isWorkTime$.value 
        ? this.timerService.workDurationSeconds 
        : this.timerService.breakDurationSeconds
    );
    
    // Subscribe to timer changes
    this.subs.push(
      this.timerService.timeLeft$.subscribe(seconds => {
        this.timeLeft = this.timerService.formatTime(seconds);
        if (seconds === 0) {
          this.notificationService.notifySessionEnd(this.timerService.isWorkTime$.value);
        }
      })
    );

    this.subs.push(
      this.timerService.isRunning$.subscribe(running => {
        this.isRunning = running;
      })
    );

    this.subs.push(
      this.timerService.isWorkTime$.subscribe(workTime => {
        this.isWorkTime = workTime;
      })
    );

    this.subs.push(
      this.timerService.endTime$.subscribe(endTime => {
        this.endTime = endTime;
      })
    );
  }

  openSettings() {
    this.showSettings = true;
  }

  // Add this method
  onSettingsClosed() {
    this.showSettings = false;
  }


  startClock() {
    this.updateTime();
    this.clockInterval = setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  startPomodoro() {
    this.timerService.startTimer();
  }

  pauseTimer() {
    this.timerService.pauseTimer();
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.timerService.pauseTimer();
    this.timerService.pauseTimer();
  }

  startPauseTimer() {
    if (this.isRunning) {
      this.timerService.pauseTimer();
    } else {
      this.timerService.startTimer();
    }
  }

  resetTimer() {
    this.timerService.resetTimer();
  }

}