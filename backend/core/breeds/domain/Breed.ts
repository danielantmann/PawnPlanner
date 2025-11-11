import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Animal } from '../../animals/domain/Animal';
import { Pet } from '../../pets/domain/Pet';

@Entity('breeds')
export class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Animal, (animal) => animal.breeds, { onDelete: 'CASCADE' })
  animal!: Animal;

  @OneToMany(() => Pet, (pet) => pet.breed)
  pets!: Pet[];
}
