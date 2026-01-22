import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { AppointmentMapper } from '../../../application/appointments/mappers/AppointmentMapper';
import { Appointment } from '../../../core/appointments/domain/Appointment';

describe('AppointmentMapper', () => {
  const appointment = new Appointment(
    1,
    1,
    1,
    1,
    'Michi',
    'Juan',
    '555-1234',
    'Baño',
    100,
    120,
    new Date('2026-01-25T10:00:00Z'),
    new Date('2026-01-25T11:00:00Z'),
    60,
    'completed',
    false
  );

  describe('toDTO', () => {
    it('should convert Appointment to AppointmentDTO', () => {
      const result = AppointmentMapper.toDTO(appointment);

      expect(result.id).toBe(1);
      expect(result.petId).toBe(1);
      expect(result.petName).toBe('Michi');
      expect(result.ownerName).toBe('Juan');
      expect(result.ownerPhone).toBe('555-1234');
      expect(result.serviceId).toBe(1);
      expect(result.serviceName).toBe('Baño');
      expect(result.estimatedPrice).toBe(100);
      expect(result.finalPrice).toBe(120);
      expect(result.status).toBe('completed');
    });

    it('should convert startTime and endTime to ISO strings', () => {
      const result = AppointmentMapper.toDTO(appointment);

      expect(typeof result.startTime).toBe('string');
      expect(typeof result.endTime).toBe('string');
      expect(result.startTime).toBe('2026-01-25T10:00:00.000Z');
      expect(result.endTime).toBe('2026-01-25T11:00:00.000Z');
    });

    it('should include duration in minutes', () => {
      const result = AppointmentMapper.toDTO(appointment);

      expect(result.durationMinutes).toBe(60);
    });

    it('should include all denormalized fields', () => {
      const result = AppointmentMapper.toDTO(appointment);

      expect(result).toHaveProperty('petName');
      expect(result).toHaveProperty('ownerName');
      expect(result).toHaveProperty('ownerPhone');
      expect(result).toHaveProperty('serviceName');
    });

    it('should handle different appointment statuses', () => {
      const noShowAppointment = new Appointment(
        2,
        1,
        1,
        1,
        'Michi',
        'Juan',
        '555-1234',
        'Baño',
        100,
        100,
        new Date('2026-02-01T10:00:00Z'),
        new Date('2026-02-01T11:00:00Z'),
        60,
        'no-show',
        false
      );

      const result = AppointmentMapper.toDTO(noShowAppointment);
      expect(result.status).toBe('no-show');
    });

    it('should preserve numerical values for prices', () => {
      const result = AppointmentMapper.toDTO(appointment);

      expect(typeof result.estimatedPrice).toBe('number');
      expect(typeof result.finalPrice).toBe('number');
      expect(result.estimatedPrice).toBe(100);
      expect(result.finalPrice).toBe(120);
    });
  });
});
