
import { Injectable, signal, inject } from '@angular/core';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { AuthService } from './auth.service';

export interface CajaDiaria {
  id?: string;
  usuarioId?: string;
  fecha: any; 
  fechaString: string;
  inicioDia: number;
  cajaChica: {
    saldo: number;
    detalle: string;
  };
  pagos: Array<{concepto: string, monto: number}>;
  maquinas: {
    klap: number;
    getnet: number;
  };
  efectivoMano: number;
  totales: {
    pagos: number;
    maquinas: number;
    final: number;
  };
}

export interface Abono {
  id: number;
  date: string;
  desc: string;
  monto: number;
}

export interface Habitacion {
  id: string;
  piso: string;
  estado: 'active' | 'inactive';
  costo: number;
  fechaPago: string;
}

export interface PagoHabitacion {
  id: number;
  habId: string;
  monto: number;
  metodo: string;
  date: string;
  confirmed: boolean;
}

export interface BancoMovimiento {
  id: number;
  tipo: string;
  banco: string;
  monto: number;
}

export interface MainCashState {
  abonos: Abono[];
  habitaciones: Habitacion[];
  pagos: PagoHabitacion[];
  bancos: BancoMovimiento[];
  lastUpdated?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private authService = inject(AuthService);
  
  async saveCajaDiaria(data: CajaDiaria) {
    const user = this.authService.currentUser();
    if (!user) throw new Error('No user logged in');

    await addDoc(collection(db, 'cajas_diarias'), {
      ...data,
      usuarioId: user.uid,
      fechaCreacion: serverTimestamp()
    });
  }

  async saveMainCashState(data: MainCashState) {
    const user = this.authService.currentUser();
    if (!user) throw new Error('No user logged in');

    const docRef = doc(db, `users/${user.uid}/main_cash/current`);
    await setDoc(docRef, {
      ...data,
      lastUpdated: serverTimestamp()
    });
  }

  async loadMainCashState(): Promise<MainCashState | null> {
    const user = this.authService.currentUser();
    if (!user) return null;

    const docRef = doc(db, `users/${user.uid}/main_cash/current`);
    
    try {
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        return snapshot.data() as MainCashState;
      }
      return null;
    } catch (error: any) {
      // Handle Firestore offline error gracefully
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('Network unavailable and no local cache found. Starting with empty state.');
        return null;
      }
      throw error;
    }
  }
}
