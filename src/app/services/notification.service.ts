import { Injectable } from '@angular/core';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private platform: Platform) {}

  async initialize() {
    if (!this.platform.is('capacitor')) return;

    // Request permissions
    try {
      await LocalNotifications.requestPermissions();
      await this.createNotificationChannel();
    } catch (error) {
      console.error('Notification setup failed:', error);
    }
  }

  private async createNotificationChannel() {
    if (!this.platform.is('android')) return;

    await LocalNotifications.createChannel({
      id: 'pomodoro_channel',
      name: 'Pomodoro Timer',
      importance: 5,
      visibility: 1,
      vibration: true,
      sound: 'timer_beep.wav'
    });
  }

  async notifySessionEnd(isWorkTime: boolean) {
    console.log('Attempting to send notification...');
    const title = isWorkTime ? 'Break Time!' : 'Work Time!';
    const body = isWorkTime ? 'Take a short break' : 'Time to focus!';

    try {
      const permissions = await LocalNotifications.checkPermissions();
      console.log('Notification permissions:', permissions);
  
      // 2. Try vibration
      console.log('Triggering vibration...');
      await Haptics.vibrate({ duration: 1000 });
  
      // 3. Send notification
      console.log('Scheduling notification...');
      await LocalNotifications.schedule({
        notifications: [{
          title: title,
          body: body,
          id: 1,
          channelId: 'pomodoro_channel',
        }]
      });
      console.log('Notification scheduled!');
    } catch (error) {
      console.error('Notification failed:', error);
    }
  }
}
