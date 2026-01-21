
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { DailyCashComponent } from './daily-cash.component';
import { MainCashComponent } from './main-cash.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DailyCashComponent, MainCashComponent],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f3f4f6;
    }
    
    .topbar {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    .nav-links {
      display: flex;
      gap: 8px;
    }
    
    .nav-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.9rem;
      color: #6b7280;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .nav-btn:hover {
      background-color: #f9fafb;
      color: #111827;
    }
    
    .nav-btn.active {
      background-color: #eff6ff;
      color: #2563eb;
    }
    
    .logout-btn {
      font-size: 0.875rem;
      color: #ef4444;
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 500;
      padding: 8px 16px;
    }
    .logout-btn:hover {
      text-decoration: underline;
    }

    @media print {
      .topbar { display: none; }
    }
  `],
  template: `
    <!-- Top Navigation Bar -->
    <nav class="topbar">
      <div class="nav-links">
        <button class="nav-btn" 
                [class.active]="activeTab === 'daily'" 
                (click)="activeTab = 'daily'">
          Caja Diaria
        </button>
        <button class="nav-btn" 
                [class.active]="activeTab === 'main'" 
                (click)="activeTab = 'main'">
          Caja Principal
        </button>
      </div>
      
      <button (click)="auth.logout()" class="logout-btn">
        Cerrar Sesión
      </button>
    </nav>

    <!-- Content Area -->
    <div class="content">
      @if (activeTab === 'daily') {
        <app-daily-cash />
      } @else {
        <app-main-cash />
      }
    </div>
  `
})
export class DashboardComponent {
  auth = inject(AuthService);
  activeTab: 'daily' | 'main' = 'daily';
}
