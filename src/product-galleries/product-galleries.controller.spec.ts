import { Test, TestingModule } from '@nestjs/testing';
import { ProductGalleriesController } from './product-galleries.controller';
import { ProductGalleriesService } from './product-galleries.service';

describe('ProductGalleriesController', () => {
  let controller: ProductGalleriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductGalleriesController],
      providers: [ProductGalleriesService],
    }).compile();

    controller = module.get<ProductGalleriesController>(
      ProductGalleriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
