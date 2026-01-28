import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { AppointmentEntity } from './AppointmentEntity';
import { UserEntity } from './UserEntity';
import { normalizeName } from '../../../shared/normalizers/normalizeName';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  searchName!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int', nullable: true })
  userId!: number | null;

  @ManyToOne(() => UserEntity, (user) => user.services, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  createdByUser!: UserEntity | null;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.service)
  appointments!: AppointmentEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.name) {
      const normalized = normalizeName(this.name);
      this.name = normalized;
      this.searchName = normalizeSearch(normalized);
    }
  }
}
