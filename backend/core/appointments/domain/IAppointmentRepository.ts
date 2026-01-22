import { Appointment } from './Appointment';

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment | null>;
  delete(id: number, userId: number): Promise<void>;

  findById(id: number, userId: number): Promise<Appointment | null>;

  // Para evitar solapamientos
  findOverlapping(userId: number, startTime: Date, endTime: Date): Promise<Appointment[]>;

  // Para calendario (vista mensual, semanal, diaria)
  findByDateRange(userId: number, start: Date, end: Date): Promise<Appointment[]>;

  // Para estadísticas (solo citas completadas)
  findCompletedInRange(userId: number, start: Date, end: Date): Promise<Appointment[]>;
}
