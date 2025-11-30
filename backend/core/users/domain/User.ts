import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Owner } from '../../owners/domain/Owner';
import { Pet } from '../../pets/domain/Pet';
import { Appointment } from '../../appointments/domain/Appointment';
import { Service } from '../../services/domain/Service';
import { Animal } from '../../animals/domain/Animal';
import { Breed } from '../../breeds/domain/Breed';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  secondLastName?: string;

  @Column({ type: 'varchar', length: 150 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @OneToMany(() => Owner, (owner) => owner.createdByUser)
  owners!: Owner[];

  @OneToMany(() => Pet, (pet) => pet.createdByUser)
  pets!: Pet[];

  @OneToMany(() => Appointment, (appointment) => appointment.createdByUser)
  appointments!: Appointment[];

  @OneToMany(() => Service, (service) => service.createdByUser)
  services!: Service[];

  @OneToMany(() => Animal, (animal) => animal.createdByUser)
  animals!: Animal[];

  @OneToMany(() => Breed, (breed) => breed.createdByUser)
  breeds!: Breed[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
    if (this.firstName) {
      this.firstName = this.firstName.toLowerCase().trim();
    }
    if (this.lastName) {
      this.lastName = this.lastName.toLowerCase().trim();
    }
    if (this.secondLastName) {
      this.secondLastName = this.secondLastName.toLowerCase().trim();
    }
  }
}
