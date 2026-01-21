
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataService, CajaDiaria } from '../services/data.service';

@Component({
  selector: 'app-daily-cash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      --primary-color: #2563eb;
      --primary-hover: #1d4ed8;
      --bg-color: #f4f7f6;
      --card-bg: #ffffff;
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --border-color: #e5e7eb;
      --acc-success: #10b981;
      --readonly-bg: #f3f4f6;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      display: block;
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-color);
      /* min-height removed here as it is handled by parent */
      padding: 20px;
    }

    /* Print Styles Overrides */
    @media print {
      :host {
        background-color: white;
        padding: 0;
      }
      .container {
        box-shadow: none !important;
        border: none !important;
        margin-top: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .btn, .no-print {
        display: none !important;
      }
      input {
        border: none !important;
        padding: 0 !important;
      }
      * { color: #000 !important; }
    }

    .container {
      width: 100%;
      max-width: 700px;
      background: var(--card-bg);
      border-radius: 16px;
      box-shadow: var(--shadow-lg);
      padding: 40px;
      margin: 0 auto;
      padding-bottom: 20px;
    }

    header {
      text-align: center;
      margin-bottom: 32px;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.025em;
    }

    h2 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 16px;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 8px;
      display: inline-block;
    }

    .section { margin-bottom: 32px; }

    .row {
      display: flex;
      gap: 20px;
      margin-bottom: 16px;
    }

    .col {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      background-color: #fff;
      color: var(--text-main);
    }

    input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .money-input {
      font-family: 'JetBrains Mono', monospace;
      text-align: right;
      font-weight: 500;
    }

    .text-input { font-family: 'Inter', sans-serif; }

    .readonly {
      background-color: var(--readonly-bg);
      color: var(--text-main);
      border-color: transparent;
      font-weight: 600;
      cursor: default;
    }

    .payment-row {
      display: grid;
      grid-template-columns: 2fr 1fr 30px;
      gap: 12px;
      margin-bottom: 12px;
      align-items: center;
    }

    .total-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      margin-top: 12px;
    }

    .total-box label {
      margin-bottom: 0;
      font-weight: 600;
    }

    .total-box input {
      width: 150px;
      font-weight: 700;
      color: var(--primary-color);
    }

    .closing-section {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
    }

    .final-result { margin-top: 20px; }

    .final-result input {
      font-size: 1.5rem;
      padding: 16px;
      color: var(--acc-success);
      border: 2px solid var(--border-color);
      background: #fff;
    }

    .footer {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .btn {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      box-shadow: var(--shadow);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn:hover { background-color: var(--primary-hover); }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.875rem;
      background-color: #fff;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      margin-top: 8px;
      cursor: pointer;
    }

    .btn-sm:hover { background-color: #eff6ff; }
    
    .btn-icon {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-icon:hover { color: #dc2626; }

    .signature-area {
      width: 100%;
      max-width: 300px;
      border-top: 2px solid var(--border-color);
      padding-top: 8px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-top: 20px;
    }

    @media (max-width: 600px) {
      .container { padding: 20px; }
      .row { flex-direction: column; gap: 12px; }
      .payment-row { grid-template-columns: 1fr; }
    }
  `],
  template: `
    <div class="container">
        <header>
            <h1>Control de Caja Diaria</h1>
        </header>

        <!-- Section A: Encabezado -->
        <div class="section">
            <div class="row">
                <div class="col">
                    <label for="fecha">Fecha / Día</label>
                    <input type="text" id="fecha" class="text-input" [value]="fecha()" readonly>
                </div>
                <div class="col">
                    <label for="inicio-dia">Inicio del Día ($)</label>
                    <input type="text" 
                           inputmode="numeric" 
                           id="inicio-dia" 
                           class="money-input" 
                           [value]="formatValue(inicioDia())"
                           (focus)="onFocus($event, inicioDia())"
                           (blur)="onBlur($event, 'inicioDia')">
                </div>
            </div>
        </div>

        <!-- Section B: Caja Chica -->
        <div class="section">
            <h2>Caja Chica</h2>
            <div class="row">
                <div class="col">
                    <label for="saldo-caja-chica">Saldo Caja Chica</label>
                    <input type="text" 
                           inputmode="numeric" 
                           id="saldo-caja-chica" 
                           class="money-input"
                           [value]="formatValue(cajaChicaSaldo())"
                           (focus)="onFocus($event, cajaChicaSaldo())"
                           (blur)="onBlur($event, 'cajaChicaSaldo')">
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <label for="detalle-caja-chica">Detalle</label>
                    <input type="text" id="detalle-caja-chica" class="text-input"
                        placeholder="Ej: Billetes chicos, monedas..."
                        [(ngModel)]="cajaChicaDetalle">
                </div>
            </div>
        </div>

        <!-- Section C: Pagos/Salidas -->
        <div class="section">
            <h2>Pagos del Día</h2>
            <div id="pagos-container">
                @for (pago of pagos(); track $index) {
                  <div class="payment-row">
                      <input type="text" class="text-input" placeholder="Concepto (ej: Proveedor)" 
                             [ngModel]="pago.concepto" (ngModelChange)="updatePago($index, 'concepto', $event)">
                      
                      <input type="text" inputmode="numeric" class="money-input" placeholder="0"
                             [value]="formatValue(pago.monto)"
                             (focus)="onFocus($event, pago.monto)"
                             (blur)="onBlurPago($event, $index)">
                      
                      <button class="btn-icon no-print" (click)="removePago($index)" title="Eliminar fila">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                  </div>
                }
            </div>
            <button class="btn btn-sm no-print" id="btn-add-pago" (click)="addPago()">+ Agregar Pago</button>
            <div class="total-box">
                <label>Total Pagos:</label>
                <input type="text" id="total-pagos" class="money-input readonly" readonly [value]="formatValue(totalPagos())">
            </div>
        </div>

        <!-- Section D: Ingreso Máquinas -->
        <div class="section">
            <h2>Máquinas</h2>
            <div class="row">
                <div class="col">
                    <label for="mg1">KLAP</label>
                    <input type="text" inputmode="numeric" id="mg1" class="money-input"
                           [value]="formatValue(maquinas().klap)"
                           (focus)="onFocus($event, maquinas().klap)"
                           (blur)="onBlurMaquina($event, 'klap')">
                </div>
                <div class="col">
                    <label for="mg2">GETNET</label>
                    <input type="text" inputmode="numeric" id="mg2" class="money-input"
                           [value]="formatValue(maquinas().getnet)"
                           (focus)="onFocus($event, maquinas().getnet)"
                           (blur)="onBlurMaquina($event, 'getnet')">
                </div>
            </div>
            <div class="total-box">
                <label>Total Máquinas:</label>
                <input type="text" id="total-maquinas" class="money-input readonly" readonly [value]="formatValue(totalMaquinas())">
            </div>
        </div>

        <!-- Section E: Cierre & Balance -->
        <div class="section closing-section">
            <h2>Cierre de Caja</h2>
            <div class="row">
                <div class="col">
                    <label for="efectivo-mano">Efectivo en Mano (Término)</label>
                    <input type="text" inputmode="numeric" id="efectivo-mano" class="money-input"
                           [value]="formatValue(efectivoMano())"
                           (focus)="onFocus($event, efectivoMano())"
                           (blur)="onBlur($event, 'efectivoMano')">
                </div>
            </div>
            <div class="final-result">
                <label for="total-final">TOTAL FINAL (Balance)</label>
                <input type="text" id="total-final" class="money-input readonly" readonly [value]="formatValue(balanceFinal())">
            </div>
        </div>

        <footer class="footer">
            <button class="btn no-print" (click)="saveAndPrint()" [disabled]="isSaving()">
              @if (isSaving()) {
                <span>Guardando...</span>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Imprimir / Guardar
              }
            </button>
            <div class="signature-area">
                Firma Responsable
            </div>
        </footer>
    </div>
  `
})
export class DailyCashComponent {
  auth = inject(AuthService);
  dataService = inject(DataService);
  isSaving = signal(false);

  fecha = signal<string>(new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  inicioDia = signal<number>(0);
  cajaChicaSaldo = signal<number>(0);
  cajaChicaDetalle = signal<string>('');
  pagos = signal<{concepto: string, monto: number}[]>([
    { concepto: '', monto: 0 },
    { concepto: '', monto: 0 }
  ]);
  maquinas = signal<{klap: number, getnet: number}>({ klap: 0, getnet: 0 });
  efectivoMano = signal<number>(0);

  totalPagos = computed(() => this.pagos().reduce((acc, curr) => acc + curr.monto, 0));
  totalMaquinas = computed(() => this.maquinas().klap + this.maquinas().getnet);
  balanceFinal = computed(() => this.efectivoMano() + this.totalMaquinas() + this.totalPagos());

  formatValue(val: number): string {
    if (val === 0) return '0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(val);
  }

  parseValue(str: string): number {
    if (!str) return 0;
    const cleanStr = str.toString().replace(/[^0-9-]/g, '');
    const val = parseInt(cleanStr, 10);
    return isNaN(val) ? 0 : val;
  }

  onFocus(e: any, currentVal: number) {
    e.target.value = currentVal === 0 ? '' : currentVal;
    e.target.select();
  }

  onBlur(e: any, field: 'inicioDia' | 'cajaChicaSaldo' | 'efectivoMano') {
    const val = this.parseValue(e.target.value);
    if (field === 'inicioDia') this.inicioDia.set(val);
    if (field === 'cajaChicaSaldo') this.cajaChicaSaldo.set(val);
    if (field === 'efectivoMano') this.efectivoMano.set(val);
    e.target.value = this.formatValue(val);
  }

  onBlurMaquina(e: any, type: 'klap' | 'getnet') {
    const val = this.parseValue(e.target.value);
    this.maquinas.update(m => ({ ...m, [type]: val }));
    e.target.value = this.formatValue(val);
  }

  onBlurPago(e: any, index: number) {
    const val = this.parseValue(e.target.value);
    this.pagos.update(p => {
      const newPagos = [...p];
      newPagos[index].monto = val;
      return newPagos;
    });
    e.target.value = this.formatValue(val);
  }

  addPago() {
    this.pagos.update(p => [...p, { concepto: '', monto: 0 }]);
  }

  updatePago(index: number, field: 'concepto', val: string) {
    this.pagos.update(p => {
      const newPagos = [...p];
      newPagos[index][field] = val;
      return newPagos;
    });
  }

  removePago(index: number) {
    this.pagos.update(p => p.filter((_, i) => i !== index));
  }

  async saveAndPrint() {
    this.isSaving.set(true);
    try {
      const dataToSave: CajaDiaria = {
        fecha: new Date(),
        fechaString: this.fecha(),
        inicioDia: this.inicioDia(),
        cajaChica: { saldo: this.cajaChicaSaldo(), detalle: this.cajaChicaDetalle() },
        pagos: this.pagos(),
        maquinas: this.maquinas(),
        efectivoMano: this.efectivoMano(),
        totales: { pagos: this.totalPagos(), maquinas: this.totalMaquinas(), final: this.balanceFinal() }
      };
      await this.dataService.saveCajaDiaria(dataToSave);
      setTimeout(() => {
        window.print();
        this.isSaving.set(false);
      }, 500);
    } catch (e) {
      console.error("Error saving:", e);
      alert("Error al guardar.");
      this.isSaving.set(false);
    }
  }
}
