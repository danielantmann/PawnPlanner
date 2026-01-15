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
import { Pet } from '../../pets/domain/Pet';
import { User } from '../../users/domain/User';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  searchName!: string; // NUEVO

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone!: string;

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets!: Pet[];

  @Column({ type: 'int' })
  userId!: number;

  @ManyToOne(() => User, (user) => user.owners, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser!: User;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.name) {
      const normalizedName = this.normalizeName(this.name);
      this.name = normalizedName;
      this.searchName = this.normalizeSearch(normalizedName);
    }

    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  private normalizeName(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita tildes
      .replace(/\s+/g, ' ') // colapsa espacios
      .trim();
  }

  private normalizeSearch(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
  }
}
