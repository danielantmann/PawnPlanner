import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pet } from '../../pets/domain/Pet';
import { Service } from '../../services/domain/Service';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'datetime' })
  startTime!: Date;

  @Column({ type: 'datetime' })
  endTime!: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Pet, (pet) => pet.appointments, { onDelete: 'CASCADE' })
  pet!: Pet;

  @ManyToOne(() => Service, (service) => service.appointments, { onDelete: 'CASCADE' })
  service!: Service;
}
