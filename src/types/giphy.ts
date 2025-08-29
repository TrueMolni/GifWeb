export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  size?: string;
  mp4?: string;
  mp4_size?: string;
  webp?: string;
  webp_size?: string;
}

export interface GiphyImages {
  original: GiphyImage;
  fixed_height: GiphyImage;
  fixed_width: GiphyImage;

  // далі - опційні
  preview_gif?: GiphyImage;
  preview_webp?: GiphyImage;
  fixed_width_small_still?: GiphyImage;
  fixed_height_small_still?: GiphyImage;

  downsized?: GiphyImage;
  downsized_medium?: GiphyImage;
  downsized_large?: GiphyImage;
  downsized_small?: GiphyImage;
  fixed_height_downsampled?: GiphyImage;
  fixed_width_downsampled?: GiphyImage;
}

export interface GiphyUser {
  avatar_url?: string;
  banner_image?: string;
  banner_url?: string;
  profile_url?: string;
  username?: string;
  display_name?: string;
  description?: string;
  instagram_url?: string;
  website_url?: string;
  is_verified?: boolean;
}

export interface GiphyGif {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;

  import_datetime: string;
  trending_datetime: string;
  images: GiphyImages;
  user?: GiphyUser;
  tags?: string[];
}

export interface GiphySearchResponse {
  data: GiphyGif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

export interface GiphyDetailsResponse {
  data: GiphyGif;
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

// Internal app types
export interface Gif {
  id: string;
  title: string;
  slug: string;
  url: string;
  previewUrl: string;
  originalUrl: string;
  downloadUrl: string;
  width?: number;
  height?: number;
  size?: number;
  rating: string;
  createdAt?: string;
  source?: string;
  user?: {
    username?: string;
    displayName?: string;
    profileUrl?: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  tags?: string[];
}

export interface SearchParams {
  query: string;
  limit?: number;
  offset?: number;
  rating?: string;
  lang?: string;
}

export interface SearchResult {
  gifs: Gif[];
  totalCount: number;
  hasMore: boolean;
  nextOffset: number;
}
