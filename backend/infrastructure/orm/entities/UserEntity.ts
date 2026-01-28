import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { OwnerEntity } from './OwnerEntity';
import { PetEntity } from './PetEntity';
import { AppointmentEntity } from './AppointmentEntity';
import { ServiceEntity } from './ServiceEntity';
import { AnimalEntity } from './AnimalEntity';
import { BreedEntity } from './BreedEntity';

import { normalizeEmail } from '../../../shared/normalizers/normalizeEmail';
import { normalizeName } from '../../../shared/normalizers/normalizeName';

@Entity('users')
@Unique(['email'])
export class UserEntity {
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

  @OneToMany(() => OwnerEntity, (owner) => owner.createdByUser)
  owners!: OwnerEntity[];

  @OneToMany(() => PetEntity, (pet) => pet.createdByUser)
  pets!: PetEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.user)
  appointments!: AppointmentEntity[];

  @OneToMany(() => ServiceEntity, (service) => service.createdByUser)
  services!: ServiceEntity[];

  @OneToMany(() => AnimalEntity, (animal) => animal.createdByUser)
  animals!: AnimalEntity[];

  @OneToMany(() => BreedEntity, (breed) => breed.createdByUser)
  breeds!: BreedEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.email) {
      this.email = normalizeEmail(this.email);
    }
    if (this.firstName) {
      this.firstName = normalizeName(this.firstName);
    }
    if (this.lastName) {
      this.lastName = normalizeName(this.lastName);
    }
    if (this.secondLastName) {
      this.secondLastName = normalizeName(this.secondLastName);
    }
  }
}
