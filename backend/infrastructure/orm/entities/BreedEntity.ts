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

@Entity('breeds')
@Unique(['name', 'animalId'])
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

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    if (this.name) {
      this.name = normalizeName(this.name);
    }
  }
}
