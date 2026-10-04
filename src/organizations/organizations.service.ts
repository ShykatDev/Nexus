import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository.js';
import { CreateOrganizationDto } from './dto/create-organization.dto.js';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationRepository: OrganizationsRepository,
  ) {}

  async create(dto: CreateOrganizationDto) {
    const existingOrg = await this.organizationRepository.findBySlug(dto.slug);

    if (existingOrg) {
      throw new ConflictException('Organization with this slug already exist');
    }

    return this.organizationRepository.create(dto);
  }

  async findOne(id: number) {
    const organization = await this.organizationRepository.findById(id);

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }
}
