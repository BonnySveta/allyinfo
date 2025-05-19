import { CategoryId } from './category';

export interface Resource {
  id: number | string;
  url: string;
  section: string;
  section_id?: string;
  sectionLabel?: string;
  description: string | null;
  categories: CategoryId[];
  createdAt: string;
  title: string;
  descriptionFull: string;
  image: string;
  favicon: string;
  domain: string;
}

export interface ResourcesBySection {
  [key: string]: Resource[];
}

export interface ResourceWithSectionSlug extends Resource {
  section_slug?: string;
} 