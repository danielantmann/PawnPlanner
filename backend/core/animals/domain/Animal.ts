import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Breed } from '../../breeds/domain/Breed';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  species!: string;

  @OneToMany(() => Breed, (breed) => breed.animal)
  breeds!: Breed[];
}
