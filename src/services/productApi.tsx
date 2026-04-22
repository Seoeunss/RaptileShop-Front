import api from '../lib/api';

export interface ProductFilter {
  q?: string;
  species?: string;
  morphTags?: string[];
  region?: string;
  sex?: string;
  priceMin?: number;
  priceMax?: number;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductCreateData {
  title: string;
  species: string;
  morphTags: string[];
  sex: string;
  birthYm?: string;
  region?: string;
  price?: number;
  priceNegotiable: boolean;
  description: string;
  imageUrls: string[];
}

export const productApi = {
  getList: (params: ProductFilter = {}) => {
    const { page, size, sort } = params;
    const body = {
      q: params.q ?? '',
      species: params.species ?? '',
      morphTags: params.morphTags ?? [],
      region: params.region ?? '',
      sex: params.sex ?? '',
      priceMin: params.priceMin ?? null,
      priceMax: params.priceMax ?? null,
      status: params.status ?? '',
    };

    return api
      .post('/products/search', body, { params: { page, size, sort } })
      .then((r) => r.data.data);
  },

  getMorphTags: (q?: string): Promise<string[]> =>
    api.get('/products/morph-tags', { params: q ? { q } : {} }).then((r) => r.data.data),

  getDetail: (productId: number) =>
    api.get(`/products/${productId}`).then((r) => r.data.data),

  create: (data: ProductCreateData) =>
    api.post('/products', data).then((r) => r.data.data),

  update: (productId: number, data: Partial<ProductCreateData>) =>
    api.patch(`/products/${productId}`, data).then((r) => r.data.data),

  delete: (productId: number) =>
    api.delete(`/products/${productId}`).then((r) => r.data),

  changeStatus: (productId: number, status: string) =>
    api.post(`/products/${productId}/status`, { status }).then((r) => r.data.data),
};
