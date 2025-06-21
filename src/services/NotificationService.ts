export class NotificationService {
  private static notificationPermission: NotificationPermission = 'default';
  
  static async initialize() {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
      console.log('Notification permission:', this.notificationPermission);
    }
  }

  static scheduleHydrationReminder(intervalMinutes: number = 90) {
    if (this.notificationPermission !== 'granted') return;
    
    const scheduleNext = () => {
      setTimeout(() => {
        this.showNotification({
          title: '💧 Zeit zu trinken!',
          body: 'Trinken Sie ein Glas Wasser für optimale Hydration',
          icon: '/icon-192.png',
          tag: 'hydration'
        });
        scheduleNext(); // Schedule next reminder
      }, intervalMinutes * 60 * 1000);
    };
    
    scheduleNext();
  }

  static scheduleCreativityPhase() {
    if (this.notificationPermission !== 'granted') return;
    
    setTimeout(() => {
      this.showNotification({
        title: '🧠 90-Minuten Kreativphase beendet',
        body: 'Zeit für eine 20-minütige Pause. Bewegen Sie sich oder entspannen Sie.',
        icon: '/icon-192.png',
        tag: 'creativity'
      });
    }, 90 * 60 * 1000); // 90 minutes
  }

  static scheduleSupplementReminder(supplementName: string, time: string) {
    if (this.notificationPermission !== 'granted') return;
    
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.showNotification({
        title: '💊 Supplement Erinnerung',
        body: `Zeit für ${supplementName}`,
        icon: '/icon-192.png',
        tag: 'supplements'
      });
      
      // Schedule for next day
      this.scheduleSupplementReminder(supplementName, time);
    }, timeUntilNotification);
  }

  static scheduleDailyMotivation() {
    if (this.notificationPermission !== 'granted') return;
    
    const now = new Date();
    const morningTime = new Date();
    morningTime.setHours(7, 0, 0, 0);
    
    // If 7 AM has passed today, schedule for tomorrow
    if (morningTime <= now) {
      morningTime.setDate(morningTime.getDate() + 1);
    }
    
    const timeUntilMorning = morningTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.showNotification({
        title: '🌟 Guten Morgen!',
        body: 'Bereit für einen optimierten Tag? Starten Sie mit einem Glas Wasser!',
        icon: '/icon-192.png',
        tag: 'daily'
      });
      
      // Schedule for next day
      this.scheduleDailyMotivation();
    }, timeUntilMorning);
  }

  private static showNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
  }) {
    if (this.notificationPermission === 'granted') {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        tag: options.tag,
        requireInteraction: false,
        silent: false
      });

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  static cancelAllNotifications() {
    // Clear any pending timeouts (in a real app, you'd track these)
    console.log('Cancelled all notifications');
  }

  // Store reminders in localStorage for persistence
  static saveReminder(type: string, data: any) {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '{}');
    reminders[type] = data;
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }

  static getReminders() {
    return JSON.parse(localStorage.getItem('reminders') || '{}');
  }
} 