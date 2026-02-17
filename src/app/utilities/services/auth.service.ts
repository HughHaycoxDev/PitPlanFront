import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.storageKey);
  }

  logout(): void {
    this.clearToken();
  }

  getPayload(token?: string): any {
    const t = token ?? this.getToken();
    if (!t) return null;

    try {
      const base64 = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(json);
    } catch (err) {
      console.error('JWT decode error:', err);
      return null;
    }
  }

  getUsername(): string | null {
    const payload = this.getPayload();
    if (!payload) return null;

    // Common JWT claim names for a username
    return payload.sub ?? payload.username ?? payload.name ?? null;
  }
}
