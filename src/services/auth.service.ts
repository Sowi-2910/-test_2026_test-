import { Injectable, signal } from '@angular/core';
import * as firebaseAuth from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, isConfigured } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for reactive state
  currentUser = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    if (!isConfigured) {
      this.isLoading.set(false);
      this.error.set("Falta configuración de Firebase");
      return;
    }

    firebaseAuth.onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      this.isLoading.set(false);
    }, (err) => {
      console.error("Auth Error:", err);
      this.isLoading.set(false);
      this.error.set("Error conectando con Firebase");
    });
  }

  async register(email: string, pass: string): Promise<void> {
    if (!isConfigured) throw new Error("App no configurada");
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firebaseAuth.createUserWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      this.error.set(this.mapError(e.code));
      throw e;
    } finally {
      this.isLoading.set(false);
    }
  }

  async login(email: string, pass: string): Promise<void> {
    if (!isConfigured) throw new Error("App no configurada");
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await firebaseAuth.signInWithEmailAndPassword(auth, email, pass);
    } catch (e: any) {
      this.error.set(this.mapError(e.code));
      throw e;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginWithGoogle(): Promise<void> {
    if (!isConfigured) throw new Error("App no configurada");
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const provider = new firebaseAuth.GoogleAuthProvider();
      await firebaseAuth.signInWithPopup(auth, provider);
    } catch (e: any) {
      this.error.set(this.mapError(e.code));
      throw e;
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    await firebaseAuth.signOut(auth);
    this.currentUser.set(null);
  }

  private mapError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use': return 'El correo ya está registrado.';
      case 'auth/invalid-email': return 'Correo inválido.';
      case 'auth/user-not-found': return 'Usuario no encontrado.';
      case 'auth/wrong-password': return 'Contraseña incorrecta.';
      case 'auth/weak-password': return 'La contraseña es muy débil.';
      case 'auth/popup-closed-by-user': return 'Se cerró la ventana de inicio de sesión.';
      default: return 'Error de autenticación: ' + code;
    }
  }
}