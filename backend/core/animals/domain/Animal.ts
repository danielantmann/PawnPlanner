import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Breed } from '../../breeds/domain/Breed';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  species!: string;

  @OneToMany(() => Breed, (breed) => breed.animal)
  breeds!: Breed[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeSpecies() {
    if (this.species) {
      this.species = this.species.toLowerCase().trim();
    }
  }
}
