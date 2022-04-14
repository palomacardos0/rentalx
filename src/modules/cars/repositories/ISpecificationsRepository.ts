import { Specification } from '../models/Specification';

interface ISpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ISpecificationDTO): void;
  findByName(name: string): Specification;
}

export { ISpecificationsRepository, ISpecificationDTO };
