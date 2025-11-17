import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';

// Whop API Response Types
export type WhopUser = {
  id: string;
  username: string;
  email?: string;
  profile_pic_url?: string;
  created_at: number;
};

export type WhopProduct = {
  id: string;
  name: string;
  description?: string;
  visibility: 'visible' | 'hidden';
  created_at: number;
  experiences: Array<{
    id: string;
    name: string;
  }>;
};

export type WhopMembership = {
  id: string;
  user: WhopUser;
  product: WhopProduct;
  plan: {
    id: string;
    plan_type: string;
    release_method: string;
  };
  status: string;
  valid: boolean;
  cancel_at_period_end: boolean;
  license_key?: string;
  metadata?: Record<string, unknown>;
  quantity: number;
  renewal_period_start: number;
  renewal_period_end: number;
  created_at: number;
  expires_at?: number;
};

export type WhopListResponse<T> = {
  data: T[];
  pagination?: {
    current_page: number;
    total_page: number;
    total_count: number;
  };
};

@Injectable()
export class WhopApiClientService {
  private readonly logger = new Logger(WhopApiClientService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {
    this.baseUrl = 'https://api.whop.com/v5';
  }

  /**
   * Fetch the authenticated user's information
   */
  async getAuthenticatedUser(accessToken: string): Promise<WhopUser> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<WhopUser>(`${this.baseUrl}/me`, {
          headers: this.getHeaders(accessToken),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch authenticated user from Whop', error);
      throw new Error(`Whop API Error: ${error.message}`);
    }
  }

  /**
   * Fetch a specific user by ID
   */
  async getUserById(userId: string, accessToken: string): Promise<WhopUser> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<WhopUser>(`${this.baseUrl}/users/${userId}`, {
          headers: this.getHeaders(accessToken),
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId} from Whop`, error);
      throw new Error(`Whop API Error: ${error.message}`);
    }
  }

  /**
   * List all products
   */
  async listProducts(
    accessToken: string,
    page = 1,
    perPage = 100,
  ): Promise<WhopListResponse<WhopProduct>> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<WhopListResponse<WhopProduct>>(
          `${this.baseUrl}/company/products`,
          {
            headers: this.getHeaders(accessToken),
            params: { page, per: perPage },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to list products from Whop', error);
      throw new Error(`Whop API Error: ${error.message}`);
    }
  }

  /**
   * Get a specific product by ID
   */
  async getProductById(
    productId: string,
    accessToken: string,
  ): Promise<WhopProduct> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<WhopProduct>(
          `${this.baseUrl}/company/products/${productId}`,
          {
            headers: this.getHeaders(accessToken),
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch product ${productId} from Whop`, error);
      throw new Error(`Whop API Error: ${error.message}`);
    }
  }

  /**
   * List all memberships
   */
  async listMemberships(
    accessToken: string,
    page = 1,
    perPage = 100,
    filters?: {
      valid?: boolean;
      productId?: string;
    },
  ): Promise<WhopListResponse<WhopMembership>> {
    try {
      const params: Record<string, unknown> = { page, per: perPage };

      if (filters?.valid !== undefined) {
        params.valid = filters.valid;
      }
      if (filters?.productId) {
        params.product = filters.productId;
      }

      const response = await firstValueFrom(
        this.httpService.get<WhopListResponse<WhopMembership>>(
          `${this.baseUrl}/company/memberships`,
          {
            headers: this.getHeaders(accessToken),
            params,
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to list memberships from Whop', error);
      throw new Error(`Whop API Error: ${error.message}`);
    }
  }

  /**
   * Get a specific membership by ID
   */
  async getMembershipById(
    membershipId: string,
    accessToken: string,
  ): Promise<WhopMembership> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<WhopMembership>(
          `${this.baseUrl}/company/memberships/${membershipId}`,
          {
            headers: this.getHeaders(accessToken),
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch membership ${membershipId} from Whop`,
        error,
      );
      throw new Error(`Whop API Error: ${error.message}`);
    }
  }

  /**
   * Fetch all products (handles pagination automatically)
   */
  async getAllProducts(accessToken: string): Promise<WhopProduct[]> {
    const allProducts: WhopProduct[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await this.listProducts(accessToken, currentPage);
      allProducts.push(...response.data);

      if (
        response.pagination &&
        currentPage < response.pagination.total_page
      ) {
        currentPage++;
      } else {
        hasMorePages = false;
      }
    }

    return allProducts;
  }

  /**
   * Fetch all memberships (handles pagination automatically)
   */
  async getAllMemberships(
    accessToken: string,
    filters?: { valid?: boolean; productId?: string },
  ): Promise<WhopMembership[]> {
    const allMemberships: WhopMembership[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await this.listMemberships(
        accessToken,
        currentPage,
        100,
        filters,
      );
      allMemberships.push(...response.data);

      if (
        response.pagination &&
        currentPage < response.pagination.total_page
      ) {
        currentPage++;
      } else {
        hasMorePages = false;
      }
    }

    return allMemberships;
  }

  /**
   * Generate common headers for Whop API requests
   */
  private getHeaders(accessToken: string): Record<string, string> {
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Check if an error is a rate limit error
   */
  isRateLimitError(error: unknown): boolean {
    return (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 429
    );
  }

  /**
   * Check if an error is an authentication error
   */
  isAuthError(error: unknown): boolean {
    return (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'status' in error.response &&
      error.response.status === 401
    );
  }
}
