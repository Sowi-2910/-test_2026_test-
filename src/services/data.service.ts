
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

// --- Daily Cash Interfaces ---
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

// --- Main Cash Interfaces (Caja Principal) ---
export interface Abono {
  id: number;
  date: string;
  desc: string;
  monto: number;
}

export interface Habitacion {
  id: string; // Room Number (e.g. "101")
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

// Combined state for Main Cash persistence
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
  
  // Save Daily Cash Snapshot (Append only)
  async saveCajaDiaria(data: CajaDiaria) {
    const user = this.authService.currentUser();
    if (!user) throw new Error('No user logged in');

    await addDoc(collection(db, 'cajas_diarias'), {
      ...data,
      usuarioId: user.uid,
      fechaCreacion: serverTimestamp()
    });
  }

  // Save Main Cash State (Overwrite/Update current state for persistence)
  // We use a specific document ID 'current_state' for simplicity in this architecture
  async saveMainCashState(data: MainCashState) {
    const user = this.authService.currentUser();
    if (!user) throw new Error('No user logged in');

    // We store this in a subcollection for the user so it's private
    const docRef = doc(db, `users/${user.uid}/main_cash/current`);
    await setDoc(docRef, {
      ...data,
      lastUpdated: serverTimestamp()
    });
  }

  // Load Main Cash State
  async loadMainCashState(): Promise<MainCashState | null> {
    const user = this.authService.currentUser();
    if (!user) return null;

    const docRef = doc(db, `users/${user.uid}/main_cash/current`);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as MainCashState;
    }
    return null;
  }
}
