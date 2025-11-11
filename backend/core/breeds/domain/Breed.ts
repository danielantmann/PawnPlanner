import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Animal } from '../../animals/domain/Animal';

@Entity('breeds')
export class Breed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Animal, (animal) => animal.breeds, { onDelete: 'CASCADE' })
  animal!: Animal;
}
