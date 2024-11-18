export interface Resource {
  id: number;
  url: string;
  section: string;
  description: string | null;
  preview: {
    title: string;
    description: string;
    image: string | null;
    favicon: string;
    domain: string;
  };
  createdAt: string;
}

export interface ResourcesBySection {
  [key: string]: Resource[];
} 