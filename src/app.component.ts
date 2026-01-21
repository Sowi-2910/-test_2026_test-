
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login.component';
import { DashboardComponent } from './components/dashboard.component';
import { isConfigured } from './firebase.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, DashboardComponent],
  template: `
    @if (!isConfigured) {
      <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div class="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div class="bg-indigo-600 p-6 text-center">
             <h1 class="text-2xl font-bold text-white">Configuración Requerida</h1>
             <p class="text-indigo-100 mt-2">Conecta tu backend de Firebase para continuar</p>
          </div>
          <div class="p-8 space-y-6">
            <div class="flex items-start gap-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
              <span class="text-2xl">⚠️</span>
              <div>
                <p class="font-bold">Falta la API Key</p>
                <p class="text-sm">La aplicación no puede conectarse a Firebase porque estás usando la configuración de ejemplo.</p>
              </div>
            </div>

            <ol class="list-decimal list-inside space-y-3 text-gray-600 ml-2">
              <li>Crea un proyecto en <a href="https://console.firebase.google.com" target="_blank" class="text-indigo-600 font-medium hover:underline">Firebase Console</a>.</li>
              <li>Habilita <strong>Authentication</strong> (Email/Password).</li>
              <li>Habilita <strong>Firestore Database</strong> (Modo prueba).</li>
              <li>En <em>Project Settings</em>, copia tu <code>firebaseConfig</code>.</li>
              <li>Pega tus credenciales en <code>src/firebase.config.ts</code>.</li>
            </ol>

            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto text-left">
              <code class="text-green-400 text-sm font-mono block whitespace-pre">
const firebaseConfig = {{ '{' }}
  apiKey: "TU_API_KEY_REAL",
  authDomain: "...",
  projectId: "...",
  ...
{{ '}' }};</code>
            </div>
            
            <p class="text-center text-sm text-gray-500">La aplicación detectará los cambios automáticamente.</p>
          </div>
        </div>
      </div>
    } @else if (auth.isLoading()) {
      <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p class="text-gray-500 font-medium">Conectando con Firebase...</p>
      </div>
    } @else {
      @if (auth.currentUser()) {
        <app-dashboard />
      } @else {
        <app-login />
      }
    }
  `
})
export class AppComponent {
  auth = inject(AuthService);
  isConfigured = isConfigured;
}
