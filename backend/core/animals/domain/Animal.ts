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
import { Breed } from '../../breeds/domain/Breed';
import { User } from '../../users/domain/User';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  species!: string;

  @Column({ type: 'int', nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.animals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser?: User;

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
