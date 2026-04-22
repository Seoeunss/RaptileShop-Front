import api from '../lib/api';

export type InheritanceType = 'RECESSIVE' | 'CODOMINANT' | 'DOMINANT';
export type Zygosity = 'NORMAL' | 'HET' | 'VISUAL' | 'SINGLE' | 'SUPER';

export interface Species {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Gene {
  id: number;
  speciesId: number;
  name: string;
  slug: string;
  inheritanceType: InheritanceType;
  singleName: string | null;
  doubleName: string | null;
  badgeColor: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface MorphGene {
  geneId: number;
  geneName: string;
  zygosity: Zygosity;
}

export interface Morph {
  id: number;
  speciesId: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  genes: MorphGene[];
}

export interface ParentGeneInput {
  geneId: number;
  zygosity: Zygosity;
}

export interface CalculateRequest {
  speciesId: number;
  parent1MorphId?: number;
  parent2MorphId?: number;
  parent1Genes?: ParentGeneInput[];
  parent2Genes?: ParentGeneInput[];
}

export interface OutcomeGene {
  geneId: number;
  geneName: string;
  traitName: string;
  zygosity: Zygosity;
  inheritanceType: InheritanceType;
  badgeColor: string | null;
}

export interface Outcome {
  probability: number;
  fraction: string;
  percentage: string;
  displayName: string;
  traitCount: number;
  genes: OutcomeGene[];
}

export interface CalculateResult {
  totalOutcomes: number;
  outcomes: Outcome[];
}

export interface SpeciesCreateData {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface GeneCreateData {
  speciesId: number;
  name: string;
  slug: string;
  inheritanceType: InheritanceType;
  singleName?: string;
  doubleName?: string;
  badgeColor?: string;
  description?: string;
  sortOrder?: number;
}

export interface MorphCreateData {
  speciesId: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  genes: { geneId: number; zygosity: Zygosity }[];
}

export const geneticsApi = {
  getSpecies: () =>
    api.get('/genetics/species').then((r) => r.data.data as Species[]),

  getGenes: (speciesId: number) =>
    api.get(`/genetics/species/${speciesId}/genes`).then((r) => r.data.data as Gene[]),

  getMorphs: (speciesId: number) =>
    api.get(`/genetics/species/${speciesId}/morphs`).then((r) => r.data.data as Morph[]),

  calculate: (body: CalculateRequest) =>
    api.post('/genetics/calculate', body).then((r) => r.data.data as CalculateResult),

  // ADMIN
  admin: {
    createSpecies: (data: SpeciesCreateData) =>
      api.post('/admin/genetics/species', data).then((r) => r.data.data as Species),
    updateSpecies: (id: number, data: Partial<SpeciesCreateData>) =>
      api.patch(`/admin/genetics/species/${id}`, data).then((r) => r.data.data as Species),
    deleteSpecies: (id: number) =>
      api.delete(`/admin/genetics/species/${id}`).then((r) => r.data),

    createGene: (data: GeneCreateData) =>
      api.post('/admin/genetics/genes', data).then((r) => r.data.data as Gene),
    updateGene: (id: number, data: Partial<GeneCreateData>) =>
      api.patch(`/admin/genetics/genes/${id}`, data).then((r) => r.data.data as Gene),
    deleteGene: (id: number) =>
      api.delete(`/admin/genetics/genes/${id}`).then((r) => r.data),

    createMorph: (data: MorphCreateData) =>
      api.post('/admin/genetics/morphs', data).then((r) => r.data.data as Morph),
    updateMorph: (id: number, data: Partial<MorphCreateData>) =>
      api.patch(`/admin/genetics/morphs/${id}`, data).then((r) => r.data.data as Morph),
    deleteMorph: (id: number) =>
      api.delete(`/admin/genetics/morphs/${id}`).then((r) => r.data),
  },
};
