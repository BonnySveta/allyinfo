import { CategoryId } from './category';

export interface Resource {
  id: number;
  url: string;
  section: string;
  section_id?: string;
  sectionLabel?: string;
  description: string | null;
  categories: CategoryId[];
  preview: {
    title: string;
    description: string;
    image: string;
    favicon: string;
    domain: string;
  };
  createdAt: string;
}

export interface ResourcesBySection {
  [key: string]: Resource[];
} 