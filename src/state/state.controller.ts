import { StateEntity } from './entities/state.entity';
import { StateService } from './state.service';
import { Controller, Get } from '@nestjs/common';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async getAllUsers(): Promise<StateEntity[]> {
    return this.stateService.getAllStates();
  }
}
