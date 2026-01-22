import { Service } from '../../../core/services/domain/Service';

export class ServiceMapper {
  static toResponse(service: Service) {
    return {
      id: service.id,
      name: service.name,
      price: service.price,
      userId: service.userId,
    };
  }
}
