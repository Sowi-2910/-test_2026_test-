
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Abono, Habitacion, PagoHabitacion, BancoMovimiento } from '../services/data.service';

@Component({
  selector: 'app-main-cash',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      --primary: #2563eb;
      --primary-dark: #1e40af;
      --bg-body: #f3f4f6;
      --bg-card: #ffffff;
      --text-dark: #111827;
      --text-gray: #6b7280;
      --border: #e5e7eb;
      --success: #10b981;
      --danger: #ef4444;
      --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      display: block;
      font-family: 'Inter', sans-serif;
      color: var(--text-dark);
      padding: 20px;
    }

    /* Reset & Base */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* Layout Grid */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      gap: 24px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 1024px) {
      .container {
        grid-template-columns: 2fr 1fr;
        /* Main Content (Left), Stats (Right) */
        grid-template-areas:
            "header header"
            "abonos resumen"
            "habitaciones bancos"
            "pagos bancos";
      }
      .header { grid-area: header; }
      .section-abonos { grid-area: abonos; }
      .section-resumen { grid-area: resumen; }
      .section-bancos { grid-area: bancos; }
      .section-habitaciones { grid-area: habitaciones; }
      .section-pagos { grid-area: pagos; }
    }

    /* Common Card Style */
    .card {
      background: var(--bg-card);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 24px;
      border: 1px solid var(--border);
    }

    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: var(--shadow);
    }

    .header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-dark);
    }

    .date-picker {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      font-family: inherit;
    }

    /* Tables & Lists */
    .table-container { overflow-x: auto; }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 500px;
    }

    th {
      text-align: left;
      padding: 12px;
      font-size: 0.875rem;
      color: var(--text-gray);
      font-weight: 500;
      border-bottom: 2px solid var(--bg-body);
    }

    td {
      padding: 12px;
      border-bottom: 1px solid var(--bg-body);
      font-size: 0.95rem;
    }

    tr:last-child td { border-bottom: none; }

    .col-money {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 500;
    }

    .col-action { width: 40px; text-align: center; }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-gray);
      transition: color 0.2s;
    }
    .btn-icon:hover { color: var(--danger); }

    /* Forms in Tables */
    .input-inline {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.9rem;
    }
    .input-inline:focus {
      outline: 2px solid var(--primary);
      border-color: transparent;
    }

    .btn-add {
      background: var(--primary);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-add:hover { background: var(--primary-dark); }

    /* Resumen Card (Sticky) */
    .section-resumen { align-self: start; }

    .summary-box {
      background-color: #eff6ff;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin-bottom: 24px;
      border: 1px solid #bfdbfe;
    }

    .summary-label {
      font-size: 0.875rem;
      color: #1e3a8a;
      font-weight: 500;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .summary-total {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
      font-family: 'JetBrains Mono', monospace;
    }

    .breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: var(--text-gray);
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    .breakdown-item span:last-child {
      font-weight: 600;
      color: var(--text-dark);
      font-family: 'JetBrains Mono', monospace;
    }

    /* Section Specifics */
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-active { background: #dcfce7; color: #166534; }
    .status-inactive { background: #f3f4f6; color: #374151; }

    /* Modal / Dialog */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }

    .modal-content {
      border: none;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 0;
      max-width: 500px;
      width: 90%;
      background: white;
      position: relative;
    }

    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 { font-size: 1.25rem; font-weight: 600; }

    .modal-body {
      padding: 24px;
      display: grid;
      gap: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-family: inherit;
    }

    .modal-footer {
      padding: 16px 24px;
      background: #f9fafb;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-cancel {
      background: white;
      border: 1px solid var(--border);
      color: var(--text-dark);
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    .btn-save {
      background: var(--primary);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }

    /* Print Styles */
    @media print {
      body { background: white; padding: 0; }
      .container { display: block; max-width: 100%; }
      .card { box-shadow: none; border: 1px solid #eee; margin-bottom: 20px; break-inside: avoid; }
      .btn-add, .btn-icon, .btn-cancel, .btn-save, .col-action, tfoot, .modal-header .btn-icon, aside select, aside input, aside button { display: none !important; }
      header input[type="date"] { border: none; font-weight: bold; }
      .section-bancos div[style*="background: #f9fafb"] { display: none !important; }
      .header { margin-bottom: 20px; }
      table { min-width: 100%; }
      .signature-section { display: block !important; margin-top: 100px !important; }
    }
  `],
  template: `
    <div class="container">
        <header class="header">
            <div>
                <h1>Caja Principal</h1>
                <input type="date" [(ngModel)]="mainDate" class="date-picker">
            </div>
            <button class="btn-add" (click)="saveAndPrint()"
                style="background: var(--primary); padding: 10px 24px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="margin-right: 8px;">
                    <path d="M6 9V2h12v7"></path>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Imprimir / Guardar
            </button>
        </header>

        <!-- 2. Abonos Comercial (Local) -->
        <section class="card section-abonos">
            <h2>
                Abonos Comercial (Local)
                <span style="font-size: 0.9rem; color: var(--text-gray); font-weight: 400;">Subtotal: <span>{{ formatCLP(subtotalAbonos()) }}</span></span>
            </h2>
            <div class="table-container">
                <table id="table-abonos">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Detalle</th>
                            <th class="col-money">Monto</th>
                            <th class="col-action"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (item of abonos(); track item.id) {
                          <tr class="fade-in">
                              <td>{{ item.date }}</td>
                              <td>{{ item.desc }}</td>
                              <td class="col-money">{{ formatCLP(item.monto) }}</td>
                              <td class="col-action">
                                  <button class="btn-icon" (click)="removeAbono(item.id)">🗑️</button>
                              </td>
                          </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><input type="date" [(ngModel)]="newAbono.date" class="input-inline"></td>
                            <td><input type="text" [(ngModel)]="newAbono.desc" class="input-inline" placeholder="Descripción..."></td>
                            <td class="col-money"><input type="text" 
                                class="input-inline currency-input" 
                                placeholder="0" 
                                style="text-align: right;"
                                [value]="formatCLP(newAbono.monto)"
                                (focus)="onFocus($event, newAbono.monto)"
                                (blur)="onBlurAbono($event)"></td>
                            <td><button class="btn-add" (click)="addAbono()" style="padding: 6px 10px;">+</button></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>

        <!-- 3. Resumen Total (Right Column) -->
        <aside class="card section-resumen">
            <h2>Resumen Total</h2>
            <div class="summary-box">
                <div class="summary-label">Total Disponible</div>
                <div class="summary-total">{{ formatCLP(totalDisponible()) }}</div>
            </div>
            <div class="breakdown">
                <div class="breakdown-item">
                    <span>(+) Suma Abonos</span>
                    <span>{{ formatCLP(subtotalAbonos()) }}</span>
                </div>
                <div class="breakdown-item">
                    <span>(+) Suma Pagos Habitaciones</span>
                    <span>{{ formatCLP(totalPagosEfectivo()) }}</span>
                </div>
            </div>
        </aside>

        <!-- 4. Gestión de Habitaciones -->
        <section class="card section-habitaciones">
            <h2>
                Gestión de Habitaciones
                <button class="btn-add" (click)="openRoomModal('add')">+ Añadir Habitación</button>
            </h2>
            <div class="table-container">
                <table id="table-habitaciones">
                    <thead>
                        <tr>
                            <th>Nº Hab</th>
                            <th>Piso/Nivel</th>
                            <th>Estado</th>
                            <th>Costo Mensual</th>
                            <th>Fecha de Pago</th>
                            <th class="col-action"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (hab of sortedHabitaciones(); track hab.id) {
                          <tr>
                              <td style="font-weight: 600;">Hab. {{ hab.id }}</td>
                              <td>{{ hab.piso }}</td>
                              <td>
                                <span class="status-badge" 
                                      [class.status-active]="hab.estado === 'active'"
                                      [class.status-inactive]="hab.estado === 'inactive'">
                                  {{ hab.estado === 'active' ? 'Activo' : 'Inactivo' }}
                                </span>
                              </td>
                              <td class="col-money">{{ formatCLP(hab.costo) }}</td>
                              <td>{{ hab.fechaPago }}</td>
                              <td class="col-action">
                                  <div style="display: flex; gap: 8px;">
                                      <button class="btn-icon" (click)="openRoomModal('edit', hab.id)" title="Editar">✏️</button>
                                      <button class="btn-icon" (click)="removeRoom(hab.id)" title="Eliminar">🗑️</button>
                                  </div>
                              </td>
                          </tr>
                        }
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 5. Registro de Pagos de Habitaciones -->
        <section class="card section-pagos">
            <h2>Registro de Pagos de Habitaciones</h2>

            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 20px; display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 150px;">
                    <label style="display: block; font-size: 0.875rem; margin-bottom: 4px; font-weight: 500;">Seleccionar Habitación</label>
                    <select [(ngModel)]="newPago.habId" class="input-inline">
                        <option value="">-- Seleccionar --</option>
                        @for (hab of habitaciones(); track hab.id) {
                          <option [value]="hab.id">Hab. {{ hab.id }} - {{ formatCLP(hab.costo) }}</option>
                        }
                    </select>
                </div>
                <div style="flex: 1; min-width: 150px;">
                    <label style="display: block; font-size: 0.875rem; margin-bottom: 4px; font-weight: 500;">Monto a Pagar ($)</label>
                    <input type="text" class="input-inline currency-input" placeholder="0"
                           [value]="formatCLP(newPago.monto)"
                           (focus)="onFocus($event, newPago.monto)"
                           (blur)="onBlurPagoHab($event)">
                </div>
                <div style="flex: 1; min-width: 150px;">
                    <label style="display: block; font-size: 0.875rem; margin-bottom: 4px; font-weight: 500;">Medio de Pago</label>
                    <select [(ngModel)]="newPago.metodo" class="input-inline">
                        <option value="efectivo">Efectivo 💵</option>
                        <option value="transferencia">Transferencia 🏦</option>
                    </select>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <input type="checkbox" id="pago-check" [(ngModel)]="newPago.confirmed" style="width: 16px; height: 16px; margin-right: 8px;">
                    <label for="pago-check" style="font-size: 0.9rem;">Confirmado</label>
                </div>
                <button class="btn-add" (click)="addPagoHabitacion()">Registrar Pago</button>
            </div>

            <h3>Historial de Pagos</h3>
            <div class="table-container">
                <table id="table-pagos-historial">
                    <thead>
                        <tr>
                            <th>Habitación</th>
                            <th>Fecha Registro</th>
                            <th>Medio</th>
                            <th class="col-money">Monto</th>
                            <th>Estado</th>
                            <th class="col-action"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (p of pagos(); track p.id) {
                          <tr class="fade-in">
                              <td>Habitación {{ p.habId }}</td>
                              <td>{{ p.date }}</td>
                              <td style="text-transform: capitalize; font-size: 0.85rem; color: var(--text-gray);">{{ p.metodo }}</td>
                              <td class="col-money">{{ formatCLP(p.monto) }}</td>
                              <td>{{ p.confirmed ? '✅' : '⏳' }}</td>
                              <td class="col-action">
                                  <button class="btn-icon" (click)="removePago(p.id)">🗑️</button>
                              </td>
                          </tr>
                        }
                    </tbody>
                </table>
            </div>
        </section>

        <!-- 6. Cuentas Bancarias (Right Column) -->
        <aside class="card section-bancos">
            <h2>Disponible en Cuentas Bancarias</h2>
            <div class="summary-box" style="background-color: #f0fdf4; border-color: #bbf7d0;">
                <div class="summary-label" style="color: #166534;">Total Bancos</div>
                <div class="summary-total" style="color: var(--success);">{{ formatCLP(totalRealBancos()) }}</div>
            </div>

            <div style="background: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                <div style="display: grid; gap: 8px;">
                    <div>
                        <label style="font-size: 0.8rem; font-weight: 500;">Tipo</label>
                        <select [(ngModel)]="newBanco.tipo" class="form-control" style="padding: 6px;">
                            <option value="transferencia">Transferencia</option>
                            <option value="abono">Abono</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; font-weight: 500;">Banco Asociado</label>
                        <select [(ngModel)]="newBanco.banco" class="form-control" style="padding: 6px;">
                            <option value="Banco Chile">Banco Chile</option>
                            <option value="Banco Santander">Banco Santander</option>
                            <option value="Banco Estado">Banco Estado</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.8rem; font-weight: 500;">Monto Aportado ($)</label>
                        <input type="text" class="form-control currency-input" style="padding: 6px;" placeholder="0"
                               [value]="formatCLP(newBanco.monto)"
                               (focus)="onFocus($event, newBanco.monto)"
                               (blur)="onBlurBanco($event)">
                    </div>
                    <button class="btn-add" (click)="addBancoMovimiento()"
                        style="width: 100%; justify-content: center; margin-top: 4px;">+ Añadir</button>
                </div>
            </div>

            <div class="table-container">
                <table style="min-width: unset; font-size: 0.85rem;">
                    <thead>
                        <tr>
                            <th>Detalle</th>
                            <th class="col-money">Monto</th>
                            <th class="col-action"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (b of bancos(); track b.id) {
                          <tr>
                              <td>
                                  <div style="font-weight: 600;">{{ b.banco }}</div>
                                  <div style="font-size: 0.75rem; color: var(--text-gray); text-transform: capitalize;">{{ b.tipo }}</div>
                              </td>
                              <td class="col-money">{{ formatCLP(b.monto) }}</td>
                              <td class="col-action">
                                  <button class="btn-icon" (click)="removeBanco(b.id)">🗑️</button>
                              </td>
                          </tr>
                        }
                        
                        @if (totalTransferenciasHab() > 0) {
                          <tr style="background-color: #f0fdf4;">
                              <td>
                                  <div style="font-weight: 600;">Pagos Habitaciones</div>
                                  <div style="font-size: 0.75rem; color: #166534;">Total Transferencias</div>
                              </td>
                              <td class="col-money" style="color: #166534;">{{ formatCLP(totalTransferenciasHab()) }}</td>
                              <td class="col-action"></td>
                          </tr>
                        }
                    </tbody>
                </table>
            </div>
        </aside>

        <!-- 7. Firma (Print Only or Bottom) -->
        <footer class="signature-section"
            style="grid-column: 1 / -1; margin-top: 40px; padding: 20px 0; text-align: center; display: none;">
            <div style="max-width: 300px; margin: 0 auto;">
                <div style="border-top: 2px solid var(--border); margin-bottom: 8px;"></div>
                <div style="color: var(--text-gray); font-size: 0.9rem; font-weight: 500;">Firma Responsable</div>
            </div>
        </footer>
    </div>

    <!-- Modal de Habitación -->
    @if (isModalOpen()) {
      <div class="modal-backdrop">
          <div class="modal-content">
              <div class="modal-header">
                  <h3>{{ modalMode() === 'add' ? 'Añadir Nueva Habitación' : 'Editar Habitación ' + modalHab.id }}</h3>
                  <button class="btn-icon" (click)="closeRoomModal()">✕</button>
              </div>
              <div class="modal-body">
                  <div class="form-group">
                      <label>Número de Habitación</label>
                      <input type="text" [(ngModel)]="modalHab.id" class="form-control" placeholder="Ej: 101" [disabled]="modalMode() === 'edit'">
                  </div>
                  <div class="form-group">
                      <label>Piso / Nivel</label>
                      <input type="text" [(ngModel)]="modalHab.piso" class="form-control" placeholder="Ej: 1">
                  </div>
                  <div class="form-group">
                      <label>Estado</label>
                      <select [(ngModel)]="modalHab.estado" class="form-control">
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                      </select>
                  </div>
                  <div class="form-group">
                      <label>Costo Mensual ($)</label>
                      <input type="text" class="form-control currency-input" placeholder="0"
                             [value]="formatCLP(modalHab.costo)"
                             (focus)="onFocus($event, modalHab.costo)"
                             (blur)="onBlurModalCost($event)">
                  </div>
                  <div class="form-group">
                      <label>Fecha de Pago</label>
                      <input type="date" [(ngModel)]="modalHab.fechaPago" class="form-control">
                  </div>
              </div>
              <div class="modal-footer">
                  <button class="btn-cancel" (click)="closeRoomModal()">Cancelar</button>
                  <button class="btn-save" (click)="saveRoom()">Guardar</button>
              </div>
          </div>
      </div>
    }
  `
})
export class MainCashComponent implements OnInit {
  dataService = inject(DataService);
  
  mainDate = new Date().toISOString().split('T')[0];
  
  // Data Signals
  abonos = signal<Abono[]>([]);
  habitaciones = signal<Habitacion[]>([
    { id: '101', piso: '1', estado: 'active', costo: 150000, fechaPago: '2026-02-01' },
    { id: '201', piso: '2', estado: 'active', costo: 130000, fechaPago: '2026-02-20' }
  ]);
  pagos = signal<PagoHabitacion[]>([]);
  bancos = signal<BancoMovimiento[]>([]);

  // Inputs State
  newAbono = { date: new Date().toISOString().split('T')[0], desc: '', monto: 0 };
  newPago = { habId: '', monto: 0, metodo: 'efectivo', confirmed: false };
  newBanco = { tipo: 'transferencia', banco: 'Banco Chile', monto: 0 };
  
  // Modal State
  isModalOpen = signal(false);
  modalMode = signal<'add' | 'edit'>('add');
  modalHab: Habitacion = { id: '', piso: '', estado: 'active', costo: 0, fechaPago: '' };

  // Computeds
  subtotalAbonos = computed(() => this.abonos().reduce((sum, item) => sum + item.monto, 0));
  
  sortedHabitaciones = computed(() => {
    return this.habitaciones().sort((a, b) => a.id.localeCompare(b.id));
  });

  totalPagosEfectivo = computed(() => {
    return this.pagos()
      .filter(p => (p.metodo || 'efectivo') === 'efectivo')
      .reduce((sum, item) => sum + item.monto, 0);
  });

  totalDisponible = computed(() => this.subtotalAbonos() + this.totalPagosEfectivo());
  
  totalTransferenciasHab = computed(() => {
    return this.pagos()
      .filter(p => p.metodo === 'transferencia')
      .reduce((sum, item) => sum + item.monto, 0);
  });

  totalRealBancos = computed(() => {
    const movs = this.bancos().reduce((acc, b) => acc + b.monto, 0);
    return movs + this.totalTransferenciasHab();
  });

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const state = await this.dataService.loadMainCashState();
      if (state) {
        this.abonos.set(state.abonos || []);
        this.habitaciones.set(state.habitaciones || []);
        this.pagos.set(state.pagos || []);
        this.bancos.set(state.bancos || []);
      }
    } catch (e) {
      console.error("Error loading main cash data", e);
    }
  }

  async saveAll() {
    try {
      await this.dataService.saveMainCashState({
        abonos: this.abonos(),
        habitaciones: this.habitaciones(),
        pagos: this.pagos(),
        bancos: this.bancos()
      });
    } catch (e) {
      console.error("Error saving main cash data", e);
    }
  }

  async saveAndPrint() {
    await this.saveAll();
    window.print();
  }

  // --- Logic: Abonos ---
  addAbono() {
    if (this.newAbono.monto <= 0) return alert('Monto inválido');
    this.abonos.update(prev => [...prev, { ...this.newAbono, id: Date.now() }]);
    this.newAbono.monto = 0;
    this.newAbono.desc = '';
    this.saveAll();
  }

  removeAbono(id: number) {
    this.abonos.update(prev => prev.filter(a => a.id !== id));
    this.saveAll();
  }

  // --- Logic: Rooms Modal ---
  openRoomModal(mode: 'add' | 'edit', id: string | null = null) {
    this.modalMode.set(mode);
    if (mode === 'edit' && id) {
      const h = this.habitaciones().find(r => r.id === id);
      if (h) this.modalHab = { ...h };
    } else {
      this.modalHab = { id: '', piso: '', estado: 'active', costo: 0, fechaPago: '' };
    }
    this.isModalOpen.set(true);
  }

  closeRoomModal() {
    this.isModalOpen.set(false);
  }

  saveRoom() {
    if (!this.modalHab.id) return alert('Falta número habitación');
    if (this.modalHab.costo <= 0) return alert('Costo inválido');

    this.habitaciones.update(prev => {
      const exists = prev.some(h => h.id === this.modalHab.id);
      if (this.modalMode() === 'add' && exists) {
        alert('Ya existe esta habitación');
        return prev;
      }
      
      let newList = [...prev];
      if (this.modalMode() === 'edit') {
        const idx = newList.findIndex(h => h.id === this.modalHab.id);
        if (idx !== -1) newList[idx] = { ...this.modalHab };
      } else {
        newList.push({ ...this.modalHab });
      }
      return newList;
    });

    this.saveAll();
    this.closeRoomModal();
  }

  removeRoom(id: string) {
    if (!confirm('¿Eliminar habitación ' + id + '?')) return;
    this.habitaciones.update(prev => prev.filter(h => h.id !== id));
    this.saveAll();
  }

  // --- Logic: Pagos Habitacion ---
  addPagoHabitacion() {
    if (!this.newPago.habId) return alert('Seleccione habitación');
    if (this.newPago.monto <= 0) return alert('Monto inválido');

    this.pagos.update(prev => [...prev, { 
      id: Date.now(), 
      ...this.newPago, 
      date: new Date().toLocaleDateString('es-CL') 
    }]);

    this.newPago.habId = '';
    this.newPago.monto = 0;
    this.newPago.confirmed = false;
    this.saveAll();
  }

  removePago(id: number) {
    this.pagos.update(prev => prev.filter(p => p.id !== id));
    this.saveAll();
  }

  // --- Logic: Bancos ---
  addBancoMovimiento() {
    if (this.newBanco.monto <= 0) return alert('Monto inválido');
    this.bancos.update(prev => [...prev, { id: Date.now(), ...this.newBanco }]);
    this.newBanco.monto = 0;
    this.saveAll();
  }

  removeBanco(id: number) {
    this.bancos.update(prev => prev.filter(b => b.id !== id));
    this.saveAll();
  }

  // --- Formatters & Handlers ---
  formatCLP(num: number): string {
    if (num === 0) return '$0';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(num);
  }

  parseCLP(val: any): number {
    if (!val) return 0;
    const clean = val.toString().replace(/[^0-9-]/g, '');
    const num = parseInt(clean, 10);
    return isNaN(num) ? 0 : num;
  }

  onFocus(e: any, val: number) {
    e.target.value = val === 0 ? '' : val;
    e.target.select();
  }

  onBlurAbono(e: any) {
    this.newAbono.monto = this.parseCLP(e.target.value);
    e.target.value = this.formatCLP(this.newAbono.monto);
  }
  
  onBlurPagoHab(e: any) {
    this.newPago.monto = this.parseCLP(e.target.value);
    e.target.value = this.formatCLP(this.newPago.monto);
  }

  onBlurBanco(e: any) {
    this.newBanco.monto = this.parseCLP(e.target.value);
    e.target.value = this.formatCLP(this.newBanco.monto);
  }

  onBlurModalCost(e: any) {
    this.modalHab.costo = this.parseCLP(e.target.value);
    e.target.value = this.formatCLP(this.modalHab.costo);
  }
}
