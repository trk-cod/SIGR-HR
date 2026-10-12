import { Test, TestingModule } from '@nestjs/testing';
import { HuespedService } from './huesped.service.js';

describe('HuespedService', () => {
  let service: HuespedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HuespedService],
    }).compile();

    service = module.get<HuespedService>(HuespedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
