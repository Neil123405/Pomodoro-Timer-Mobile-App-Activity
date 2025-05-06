import { Component, Output, EventEmitter } from '@angular/core';
import { PomodoroService } from '../../services/pomodoro.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false, // Important for Ionic 7+
})
export class SettingsComponent {
  workSeconds: number;
  breakSeconds: number;

  @Output() closeModal = new EventEmitter<void>();

  constructor(public pomodoro: PomodoroService) {
    this.workSeconds = pomodoro.workDurationSeconds; // Use the getter
    this.breakSeconds = pomodoro.breakDurationSeconds; // Use the getter
  }

  saveSettings() {
    if (this.workSeconds > 0 && this.breakSeconds > 0) {      
      this.pomodoro.updateSettings(this.workSeconds, this.breakSeconds);
      this.closeModal.emit();
    } else {
      alert('Please enter valid durations');
    }
  }
}