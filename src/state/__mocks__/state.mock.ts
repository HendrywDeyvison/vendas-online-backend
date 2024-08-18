import { StateEntity } from '../entities/state.entity';

export const stateMock: StateEntity = {
  createdAt: new Date(),
  id: 12345,
  uf: 'MG',
  name: 'Test StateMock',
  updatedAt: new Date(),
  cities: [],
};
