export interface PreviewData {
  title: string;
  description: string;
  image?: string;
  favicon: string;
  siteName?: string;
  type?: string;
  url: string;
  domain: string;
  twitterCard?: {
    card: string;
    site?: string;
    creator?: string;
  };
  og?: {
    type?: string;
    site_name?: string;
    locale?: string;
  };
} 