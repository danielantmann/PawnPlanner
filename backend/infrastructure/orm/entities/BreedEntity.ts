import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { AnimalEntity } from './AnimalEntity';
import { PetEntity } from './PetEntity';
import { UserEntity } from './UserEntity';

// Normalizadores (si quieres aplicarlos aquí también)
import { normalizeName } from '../../../shared/normalizers/normalizeName';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@Entity('breeds')
@Unique(['name', 'animalId', 'userId'])
export class BreedEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'int' })
  animalId!: number;

  @Column({ type: 'int', nullable: true })
  userId!: number | null;

  @ManyToOne(() => UserEntity, (user) => user.breeds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser?: UserEntity;

  @ManyToOne(() => AnimalEntity, (animal) => animal.breeds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animalId' })
  animal!: AnimalEntity;

  @OneToMany(() => PetEntity, (pet) => pet.breed)
  pets!: PetEntity[];

  @Column({ type: 'varchar', length: 255 })
  searchName!: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.name) {
      const normalized = normalizeName(this.name);
      this.name = normalized;
      this.searchName = normalizeSearch(normalized);
    }
  }
}
