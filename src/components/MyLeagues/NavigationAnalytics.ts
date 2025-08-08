type NavigationEvent = {
  from: string;
  to: string;
  timestamp: number;
  data?: any;
};

class NavigationAnalytics {
  private events: NavigationEvent[] = [];
  private isEnabled = __DEV__;

  trackNavigation(from: string, to: string, data?: any) {
    if (!this.isEnabled) return;

    const event: NavigationEvent = {
      from,
      to,
      timestamp: Date.now(),
      data,
    };

    this.events.push(event);
    console.log(`Navigation: ${from} → ${to}`, data);
  }

  getNavigationHistory() {
    return this.events;
  }

  getMostVisitedScreens() {
    const screenCounts: Record<string, number> = {};

    this.events.forEach((event) => {
      screenCounts[event.to] = (screenCounts[event.to] || 0) + 1;
    });

    return Object.entries(screenCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([screen, count]) => ({ screen, count }));
  }

  getAverageSessionLength() {
    if (this.events.length < 2) return 0;

    const firstEvent = this.events[0];
    const lastEvent = this.events[this.events.length - 1];

    return lastEvent.timestamp - firstEvent.timestamp;
  }

  clear() {
    this.events = [];
  }
}

export const navigationAnalytics = new NavigationAnalytics();
