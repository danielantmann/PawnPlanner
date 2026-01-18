import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { PetEntity } from './PetEntity';
import { UserEntity } from './UserEntity';

// Normalizadores centralizados
import { normalizeName } from '../../../shared/normalizers/normalizeName';
import { normalizeEmail } from '../../../shared/normalizers/normalizeEmail';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@Entity('owners')
export class OwnerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  searchName!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone!: string;

  @OneToMany(() => PetEntity, (pet) => pet.owner)
  pets!: PetEntity[];

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.owners, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser!: UserEntity;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.name) {
      const normalizedName = normalizeName(this.name);
      this.name = normalizedName;
      this.searchName = normalizeSearch(normalizedName);
    }

    if (this.email) {
      this.email = normalizeEmail(this.email);
    }
  }
}
