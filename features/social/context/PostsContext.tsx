import { createContext } from "react";
import { postsService } from "../services/postsService";
import { Post, PostComment, PostImage } from "../types/post";

interface PostsContextProps {
  // Post fetching
  getMyPosts: (page: number, pageSize: number) => Promise<Post[]>;
  getMyFeed: (page: number, pageSize: number) => Promise<Post[]>;
  getUserPosts: (
    username: string,
    page: number,
    pageSize: number
  ) => Promise<Post[]>;
  getPostComments: (
    postId: string,
    page: number,
    pageSize: number
  ) => Promise<PostComment[]>;

  // Post management
  createPost: (content: string, images: PostImage[]) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;

  // Post interactions
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<PostComment>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
}

export const PostsContext = createContext<PostsContextProps | null>(null);

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
  // Post fetching
  const getMyPosts = async (page: number, pageSize: number) => {
    try {
      return await postsService.getMyPosts(page, pageSize);
    } catch (error) {
      console.error("Failed to fetch my posts:", error);
      return [];
    }
  };

  const getMyFeed = async (page: number, pageSize: number) => {
    try {
      return await postsService.getMyFeed(page, pageSize);
    } catch (error) {
      console.error("Failed to fetch my feed:", error);
      return [];
    }
  };

  const getUserPosts = async (
    username: string,
    page: number,
    pageSize: number
  ) => {
    try {
      return await postsService.getUserPosts(username, page, pageSize);
    } catch (error) {
      console.error(`Failed to fetch posts for user ${username}:`, error);
      return [];
    }
  };

  const getPostComments = async (
    postId: string,
    page: number,
    pageSize: number
  ) => {
    try {
      return await postsService.getPostComments(postId, page, pageSize);
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      return [];
    }
  };

  // Post management
  const createPost = async (content: string, images: PostImage[]) => {
    try {
      return await postsService.createPost(content, images);
    } catch (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      return await postsService.deletePost(postId);
    } catch (error) {
      console.error(`Failed to delete post ${postId}:`, error);
      throw error;
    }
  };

  // Post interactions
  const likePost = async (postId: string) => {
    try {
      return await postsService.likePost(postId);
    } catch (error) {
      console.error(`Failed to like post ${postId}:`, error);
      throw error;
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      return await postsService.unlikePost(postId);
    } catch (error) {
      console.error(`Failed to unlike post ${postId}:`, error);
      throw error;
    }
  };

  const addComment = async (postId: string, content: string) => {
    try {
      return await postsService.addComment(postId, content);
    } catch (error) {
      console.error(`Failed to add comment to post ${postId}:`, error);
      throw error;
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      return await postsService.deleteComment(postId, commentId);
    } catch (error) {
      console.error(
        `Failed to delete comment ${commentId} from post ${postId}:`,
        error
      );
      throw error;
    }
  };

  return (
    <PostsContext.Provider
      value={{
        // Post fetching
        getMyPosts,
        getMyFeed,
        getUserPosts,
        getPostComments,
        // Post management
        createPost,
        deletePost,
        // Post interactions
        likePost,
        unlikePost,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};
