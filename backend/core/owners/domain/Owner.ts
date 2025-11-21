import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Pet } from '../../pets/domain/Pet';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone!: string;

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets!: Pet[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }
}
