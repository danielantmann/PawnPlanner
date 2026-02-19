import { Worker } from '../../../core/workers/domain/Worker';
import { WorkerResponseDTO } from '../dto/WorkerResponseDTO';

export class WorkerMapper {
  static toDTO(worker: Worker): WorkerResponseDTO {
    return {
      id: worker.id!,
      name: worker.name,
      phone: worker.phone,
      isActive: worker.isActive,
      maxSimultaneous: worker.maxSimultaneous ?? null,
    };
  }
}
