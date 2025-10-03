import { UserSummary } from "./user";

export interface Post {
  id: string;
  author: UserSummary;
  content: string;
  imageUrls: string[];
  createdAt: Date;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface PostImage {
  uri: string;
  type: string;
  name: string;
}

export interface PostComment {
  id: string;
  postId: string;
  author: UserSummary;
  content: string;
  createdAt: Date;
}
