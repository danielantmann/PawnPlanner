import { validateAppointmentForm } from '@/src/modules/appointments/schemas/appointment.schema';

describe('Appointment Schema Validation', () => {
  describe('Valid data', () => {
    it('should validate a complete appointment', () => {
      const validData = {
        petId: '1',
        serviceId: '2',
        workerId: '3',
        startTime: '10:00',
        endTime: '11:00',
        finalPrice: '50.00',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(validData);
      expect(result.success).toBe(true);
    });

    it('should validate without optional fields', () => {
      const validData = {
        petId: '1',
        serviceId: '2',
        startTime: '10:00',
        endTime: '11:00',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid data', () => {
    it('should fail without petId', () => {
      const invalidData = {
        serviceId: '2',
        startTime: '10:00',
        endTime: '11:00',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail without serviceId', () => {
      const invalidData = {
        petId: '1',
        startTime: '10:00',
        endTime: '11:00',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with endTime before startTime', () => {
      const invalidData = {
        petId: '1',
        serviceId: '2',
        startTime: '11:00',
        endTime: '10:00',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with invalid price format', () => {
      const invalidData = {
        petId: '1',
        serviceId: '2',
        startTime: '10:00',
        endTime: '11:00',
        finalPrice: 'invalid',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with negative price', () => {
      const invalidData = {
        petId: '1',
        serviceId: '2',
        startTime: '10:00',
        endTime: '11:00',
        finalPrice: '-10',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(invalidData);
      expect(result.success).toBe(false);
    });

    it('should fail with price of zero', () => {
      const invalidData = {
        petId: '1',
        serviceId: '2',
        startTime: '10:00',
        endTime: '11:00',
        finalPrice: '0',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Time validation', () => {
    it('should accept valid 24h format', () => {
      const validData = {
        petId: '1',
        serviceId: '2',
        startTime: '23:00',
        endTime: '23:59',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid time format', () => {
      const invalidData = {
        petId: '1',
        serviceId: '2',
        startTime: '25:00',
        endTime: '11:00',
        status: 'completed' as const,
      };

      const result = validateAppointmentForm(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
