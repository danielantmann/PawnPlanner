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
import { Animal } from '../../animals/domain/Animal';
import { Pet } from '../../pets/domain/Pet';
import { User } from '../../users/domain/User';

@Entity('breeds')
@Unique(['name', 'animalId'])
export class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'int' })
  animalId!: number;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.breeds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser?: User;

  @ManyToOne(() => Animal, (animal) => animal.breeds, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animalId' })
  animal!: Animal;

  @OneToMany(() => Pet, (pet) => pet.breed)
  pets!: Pet[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeName() {
    if (this.name) {
      this.name = this.name.toLowerCase().trim();
    }
  }
}
