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

import { BreedEntity } from './BreedEntity';
import { UserEntity } from './UserEntity';

// Normalizadores (si quieres aplicarlos aquí también)
//import { normalizeName } from '../../../shared/normalizers/normalizeName';

@Entity('animals')
export class AnimalEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  species!: string;

  @Column({ type: 'int', nullable: true })
  userId!: number | null;

  @ManyToOne(() => UserEntity, (user) => user.animals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  createdByUser?: UserEntity;

  @OneToMany(() => BreedEntity, (breed) => breed.animal)
  breeds!: BreedEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeSpecies() {
    if (this.species) {
      this.species = this.species.toLowerCase().trim();
    }
  }
}
