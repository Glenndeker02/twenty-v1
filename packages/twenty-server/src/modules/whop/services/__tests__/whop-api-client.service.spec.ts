import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

import { WhopApiClientService } from '../whop-api-client.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

describe('WhopApiClientService', () => {
  let service: WhopApiClientService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'AUTH_WHOP_CLIENT_ID') return 'test-client-id';
      if (key === 'AUTH_WHOP_CLIENT_SECRET') return 'test-secret';
      return 'test-value';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhopApiClientService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: TwentyConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<WhopApiClientService>(WhopApiClientService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthenticatedUser', () => {
    it('should fetch authenticated user', async () => {
      const mockUser = {
        id: 'user_123',
        username: 'testuser',
        email: 'test@example.com',
        created_at: Date.now(),
      };

      mockHttpService.get.mockReturnValue(
        of({ data: mockUser, status: 200, statusText: 'OK', headers: {}, config: {} as any }),
      );

      const result = await service.getAuthenticatedUser('test-token');

      expect(result).toEqual(mockUser);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        expect.stringContaining('/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        }),
      );
    });
  });

  describe('listProducts', () => {
    it('should list products with pagination', async () => {
      const mockProducts = {
        data: [
          { id: 'prod_1', name: 'Product 1', created_at: Date.now() },
          { id: 'prod_2', name: 'Product 2', created_at: Date.now() },
        ],
        pagination: {
          current_page: 1,
          total_page: 1,
          total_count: 2,
        },
      };

      mockHttpService.get.mockReturnValue(
        of({ data: mockProducts, status: 200, statusText: 'OK', headers: {}, config: {} as any }),
      );

      const result = await service.listProducts('test-token', 1, 100);

      expect(result).toEqual(mockProducts);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('isRateLimitError', () => {
    it('should detect rate limit errors', () => {
      const error = {
        response: {
          status: 429,
        },
      };

      expect(service.isRateLimitError(error)).toBe(true);
    });

    it('should not detect non-rate-limit errors', () => {
      const error = {
        response: {
          status: 400,
        },
      };

      expect(service.isRateLimitError(error)).toBe(false);
    });
  });

  describe('isAuthError', () => {
    it('should detect auth errors', () => {
      const error = {
        response: {
          status: 401,
        },
      };

      expect(service.isAuthError(error)).toBe(true);
    });
  });
});
