import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
} from 'typeorm';

import { OwnerEntity } from './OwnerEntity';
import { BreedEntity } from './BreedEntity';
import { AppointmentEntity } from './AppointmentEntity';
import { UserEntity } from './UserEntity';

// Normalizadores
import { normalizeName } from '../../../shared/normalizers/normalizeName';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@Entity('pets')
export class PetEntity {
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

  @Column({ type: 'int' })
  ownerId!: number;

  @ManyToOne(() => OwnerEntity, (owner) => owner.pets)
  @JoinColumn({ name: 'ownerId' })
  owner!: OwnerEntity;

  @Column({ type: 'int' })
  breedId!: number;

  @ManyToOne(() => BreedEntity, (breed) => breed.pets)
  @JoinColumn({ name: 'breedId' })
  breed!: BreedEntity;

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.pets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser!: UserEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.pet)
  appointments!: AppointmentEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    // Normalización del nombre
    if (this.name) {
      const normalizedName = normalizeName(this.name);
      this.name = normalizedName;
      this.searchName = normalizeSearch(normalizedName);
    }

    // 🔥 Mantener claves foráneas SIEMPRE sincronizadas
    if (this.owner && this.owner.id) {
      this.ownerId = this.owner.id;
    }

    if (this.breed && this.breed.id) {
      this.breedId = this.breed.id;
    }

    if (this.createdByUser && this.createdByUser.id) {
      this.userId = this.createdByUser.id;
    }
  }
}
