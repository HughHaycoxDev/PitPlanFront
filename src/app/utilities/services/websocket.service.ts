import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { DriverRoster } from '../models/driver_roster.model';

export interface WebSocketMessage {
  type: 'driver_updated' | 'driver_deleted' | 'driver_added';
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private messagesSubject = new Subject<WebSocketMessage>();
  private connectionStatus = new BehaviorSubject<boolean>(false);
  
  // Observable for components to subscribe to
  public messages$ = this.messagesSubject.asObservable();
  public isConnected$ = this.connectionStatus.asObservable();
  
  private racePlanId: number | null = null;
  private apiUrl = 'ws://localhost:8000/ws';

  constructor(private auth: AuthService, private ngZone: NgZone) {}

  /**
   * Connect to WebSocket for a specific race plan
   */
  connect(racePlanId: number): void {
    // Disconnect if already connected to a different race plan
    if (this.socket$ && this.racePlanId !== racePlanId) {
      this.disconnect();
    }

    // If already connected to this race plan, don't reconnect
    if (this.socket$ && this.racePlanId === racePlanId) {
      return;
    }

    this.racePlanId = racePlanId;
    const token = this.auth.getToken();
    const url = token 
      ? `${this.apiUrl}/race-plan/${racePlanId}?token=${token}`
      : `${this.apiUrl}/race-plan/${racePlanId}`;

    this.socket$ = webSocket<WebSocketMessage>({
      url: url,
      openObserver: {
        next: () => {
          console.log('[WebSocket] Connected to race plan:', racePlanId);
          this.ngZone.run(() => {
            this.connectionStatus.next(true);
          });
        }
      },
      closeObserver: {
        next: () => {
          console.log('[WebSocket] Disconnected');
          this.ngZone.run(() => {
            this.connectionStatus.next(false);
          });
        }
      }
    });

    this.socket$.subscribe({
      next: (message) => {
        // Run outside Angular zone to avoid change detection issues
        this.ngZone.run(() => {
          console.log('[WebSocket] Received message:', message);
          this.messagesSubject.next(message);
        });
      },
      error: (error) => {
        console.error('[WebSocket] Error:', error);
        this.ngZone.run(() => {
          this.connectionStatus.next(false);
        });
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
      this.racePlanId = null;
      this.connectionStatus.next(false);
    }
  }

  /**
   * Send a message through the WebSocket
   */
  send(message: WebSocketMessage): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): boolean {
    return this.connectionStatus.value;
  }

  /**
   * Get current race plan ID
   */
  getRacePlanId(): number | null {
    return this.racePlanId;
  }
}
