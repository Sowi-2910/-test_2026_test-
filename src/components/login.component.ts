
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <!-- Header -->
        <div class="bg-indigo-600 p-8 text-center">
          <h1 class="text-3xl font-bold text-white mb-2">Registro Master</h1>
          <p class="text-indigo-200">Gestiona tus datos de forma segura</p>
        </div>

        <!-- Form Container -->
        <div class="p-8">
          <!-- Toggle -->
          <div class="flex mb-6 bg-gray-100 p-1 rounded-lg">
            <button 
              (click)="toggleMode(false)"
              [class.bg-white]="!isRegister()"
              [class.shadow-sm]="!isRegister()"
              class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
            >
              Iniciar Sesión
            </button>
            <button 
              (click)="toggleMode(true)"
              [class.bg-white]="isRegister()"
              [class.shadow-sm]="isRegister()"
              class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
            >
              Registrarse
            </button>
          </div>

          <!-- Error Alert -->
          @if (auth.error()) {
            <div class="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200 flex items-center animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span>{{ auth.error() }}</span>
            </div>
          }

          <form (ngSubmit)="submit()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  [(ngModel)]="email" 
                  name="email" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="ejemplo@correo.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  [(ngModel)]="password" 
                  name="password" 
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="••••••••"
                >
              </div>

              <button 
                type="submit" 
                [disabled]="auth.isLoading()"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                @if (auth.isLoading() && !isGoogleLoading && !isDemoLoading) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                } @else {
                  {{ isRegister() ? 'Crear Cuenta' : 'Ingresar' }}
                }
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Acceso Rápido</span>
            </div>
          </div>

          <div class="space-y-3">
             <!-- Google Button -->
            <button 
              type="button"
              (click)="loginGoogle()"
              [disabled]="auth.isLoading()"
              class="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-3"
            >
              @if (auth.isLoading() && isGoogleLoading) {
                 <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              } @else {
                <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continuar con Google
              }
            </button>

            <!-- Quick Access Button for Demo -->
            <button 
              type="button"
              (click)="quickDemoAccess()"
              [disabled]="auth.isLoading()"
              class="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium py-2.5 rounded-lg transition-colors border border-amber-200 flex justify-center items-center gap-2 group"
            >
              @if (auth.isLoading() && isDemoLoading) {
                <svg class="animate-spin h-4 w-4 text-amber-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                <span class="group-hover:scale-110 transition-transform">⚡</span>
                Demo User (toor)
              }
            </button>
          </div>
          
          <div class="mt-6 text-center text-xs text-gray-400">
            Desarrollado con Angular & Firebase
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  isRegister = signal(false);
  
  email = '';
  password = '';
  
  // Track specific loading states
  isGoogleLoading = false;
  isDemoLoading = false;

  toggleMode(isReg: boolean) {
    this.isRegister.set(isReg);
    this.auth.error.set(null); // Clear errors when switching modes
  }

  async submit() {
    if (!this.email || !this.password) return;
    this.isGoogleLoading = false;
    this.isDemoLoading = false;
    
    if (this.isRegister()) {
      await this.auth.register(this.email, this.password);
    } else {
      await this.auth.login(this.email, this.password);
    }
  }

  async loginGoogle() {
    this.isGoogleLoading = true;
    try {
      await this.auth.loginWithGoogle();
    } catch (e) {
      // Error is handled in service
    } finally {
      this.isGoogleLoading = false;
    }
  }

  // Automates creation or login for the requested user
  async quickDemoAccess() {
    this.isDemoLoading = true;
    this.email = 'toor@example.com';
    this.password = 'torr2026$';

    try {
      // Intenta registrar primero
      await this.auth.register(this.email, this.password);
    } catch (e: any) {
      // Si el usuario ya existe (error code auth/email-already-in-use), intentamos hacer login
      if (e.code === 'auth/email-already-in-use') {
        try {
          await this.auth.login(this.email, this.password);
        } catch (loginError) {
          console.error("Error en login automático demo:", loginError);
        }
      } else {
        console.error("Error en registro demo:", e);
      }
    } finally {
      this.isDemoLoading = false;
    }
  }
}
