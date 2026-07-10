import { Test, TestingModule } from '@nestjs/testing';
import { VariantItemsController } from './variant-items.controller';
import { VariantItemsService } from './variant-items.service';

describe('VariantItemsController', () => {
  let controller: VariantItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VariantItemsController],
      providers: [VariantItemsService],
    }).compile();

    controller = module.get<VariantItemsController>(VariantItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
