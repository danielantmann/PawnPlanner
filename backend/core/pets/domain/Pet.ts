import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';
import { Owner } from '../../owners/domain/Owner';
import { Breed } from '../../breeds/domain/Breed';
import { Appointment } from '../../appointments/domain/Appointment';
import { User } from '../../users/domain/User';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  searchName!: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'text', nullable: true })
  importantNotes?: string;

  @Column({ type: 'text', nullable: true })
  quickNotes?: string;

  @ManyToOne(() => Owner, (owner) => owner.pets)
  owner!: Owner;

  @ManyToOne(() => Breed, (breed) => breed.pets)
  breed!: Breed;

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => User, (user) => user.pets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser!: User;

  @OneToMany(() => Appointment, (appointment) => appointment.pet)
  appointments!: Appointment[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.name) {
      // Normalización para búsqueda flexible
      const normalized = this.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');

      this.searchName = normalized;

      // Nombre visible limpio
      this.name = this.name.trim();
    }
  }
}
