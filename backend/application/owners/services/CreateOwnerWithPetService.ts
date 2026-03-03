import { inject, injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { ConflictError } from '../../../shared/errors/ConflictError';
import { IOwnerRepository } from '../../../core/owners/domain/IOwnerRepository';
import { Owner } from '../../../core/owners/domain/Owner';
import { Pet } from '../../../core/pets/domain/Pet';
import { OwnerEntity } from '../../../infrastructure/orm/entities/OwnerEntity';
import { PetEntity } from '../../../infrastructure/orm/entities/PetEntity';
import { normalizeName } from '../../../shared/normalizers/normalizeName';
import { normalizeSearch } from '../../../shared/normalizers/normalizeSearch';
import { normalizeEmail } from '../../../shared/normalizers/normalizeEmail';
import { normalizePhone } from '../../../shared/normalizers/normalizePhone';
import { CreateOwnerWithPetDTO } from '../dto/CreateOwnerWithPetDTO';
import { OwnerMapper } from '../mappers/OwnerMapper';

@injectable()
export class CreateOwnerWithPetService {
  constructor(
    @inject('OwnerRepository') private ownerRepository: IOwnerRepository,
    @inject('DataSource') private dataSource: DataSource
  ) {}

  async execute(dto: CreateOwnerWithPetDTO, userId: number) {
    if (dto.owner.email) {
      const existingEmail = await this.ownerRepository.findByEmail(dto.owner.email, userId);
      if (existingEmail) throw new ConflictError('Email already in use');
    }

    const existingPhone = await this.ownerRepository.findByPhone(dto.owner.phone, userId);
    if (existingPhone) throw new ConflictError('Phone already in use');

    return await this.dataSource.transaction(async (manager) => {
      const ownerEntity = new OwnerEntity();
      ownerEntity.name = normalizeName(dto.owner.name);
      ownerEntity.searchName = normalizeSearch(dto.owner.name);
      ownerEntity.email = dto.owner.email ? normalizeEmail(dto.owner.email) : null;
      ownerEntity.phone = normalizePhone(dto.owner.phone);
      ownerEntity.userId = userId;

      const savedOwner = await manager.save(OwnerEntity, ownerEntity);

      let savedPet: PetEntity | null = null;

      if (dto.pet) {
        const petEntity = new PetEntity();
        petEntity.name = normalizeName(dto.pet.name);
        petEntity.searchName = normalizeSearch(dto.pet.name);
        petEntity.birthDate = dto.pet.birthDate ? new Date(dto.pet.birthDate) : undefined;
        petEntity.importantNotes = dto.pet.importantNotes ?? undefined;
        petEntity.quickNotes = dto.pet.quickNotes ?? undefined;
        petEntity.ownerId = savedOwner.id;
        petEntity.breedId = dto.pet.breedId;
        petEntity.userId = userId;

        savedPet = await manager.save(PetEntity, petEntity);
      }

      const ownerDomain = new Owner(
        savedOwner.id,
        savedOwner.name,
        savedOwner.searchName,
        savedOwner.email,
        savedOwner.phone,
        savedOwner.userId
      );

      const petsDomain = savedPet
        ? [
            new Pet(
              savedPet.id,
              savedPet.name,
              savedPet.searchName,
              savedPet.birthDate ?? null,
              savedPet.importantNotes ?? null,
              savedPet.quickNotes ?? null,
              savedPet.ownerId,
              savedPet.breedId,
              savedPet.userId
            ),
          ]
        : [];

      return OwnerMapper.toDTO(ownerDomain, petsDomain);
    });
  }
}
