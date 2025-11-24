import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pet } from '../../pets/domain/Pet';
import { Service } from '../../services/domain/Service';
import { User } from '../../users/domain/User';

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

  @ManyToOne(() => User, (user) => user.animals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser!: User;

  @ManyToOne(() => Pet, (pet) => pet.appointments, { onDelete: 'CASCADE' })
  pet!: Pet;

  @ManyToOne(() => Service, (service) => service.appointments, { onDelete: 'CASCADE' })
  service!: Service;
}
