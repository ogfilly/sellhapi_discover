import type { LookProduct } from "./product";
import type { CreatorSummary } from "./creator";

export interface Look {
  id:          string;
  creatorId:   string;
  creator:     CreatorSummary;
  coverImage:  string;
  images:      string[];
  caption:     string | null;
  likeCount:   number;
  viewCount:   number;
  isLiked:     boolean;
  products:    LookProduct[];
  publishedAt: string;
}

export interface LookSummary
  extends Pick<Look, "id" | "coverImage" | "likeCount" | "viewCount" | "publishedAt"> {
  productCount: number;
}
