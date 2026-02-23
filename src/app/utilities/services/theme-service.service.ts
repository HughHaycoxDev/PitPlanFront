import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private storageKey = 'theme';

  initTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');

    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(this.storageKey, 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem(this.storageKey, 'dark');
    }
  }

  isDark(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}