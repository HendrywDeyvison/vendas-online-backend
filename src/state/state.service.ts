import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StateEntity } from './entities/state.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(StateEntity)
    private readonly stateRepository: Repository<StateEntity>,
  ) {}

  async getAllStates(): Promise<StateEntity[]> {
    return this.stateRepository.find();
  }
}
