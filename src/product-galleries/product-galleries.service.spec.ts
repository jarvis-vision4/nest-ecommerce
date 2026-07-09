import { Test, TestingModule } from '@nestjs/testing';
import { ProductGalleriesService } from './product-galleries.service';

describe('ProductGalleriesService', () => {
  let service: ProductGalleriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductGalleriesService],
    }).compile();

    service = module.get<ProductGalleriesService>(ProductGalleriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
