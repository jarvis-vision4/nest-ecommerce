import { Test, TestingModule } from '@nestjs/testing';
import { VariantItemsService } from './variant-items.service';

describe('VariantItemsService', () => {
  let service: VariantItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariantItemsService],
    }).compile();

    service = module.get<VariantItemsService>(VariantItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
