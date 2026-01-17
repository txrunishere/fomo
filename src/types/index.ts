export type REGISTER_USER_PROPS = {
  username: string;
  fullName: string;
  email: string;
  password: string;
};

export type LOGIN_USER_PROPS = {
  email: string;
  password: string;
};

export type CREATE_USER_PROPS = {
  username: string;
  fullName: string;
  email: string;
  accountId: string;
};

export type AUTH_API_RESPONSE = {
  success: boolean;
  message: string;
};

export type QUERY_API_RESPONSE = {
  success: boolean;
  data?: any;
  message?: string;
};

export type CREATE_POST_PROPS = {
  caption: string;
  tags: Array<string>;
  userId: string;
  location: string | null;
  image: File;
};

export type UPLOAD_POST_IMAGE = {
  image: File;
  userId: string;
};

export type IPOST = {
  id: number;
  caption: string;
  userId: number;
  tags: Array<string>;
  postImageUrl: string;
  location: string;
  created_at: string;
  users: {
    id: number;
    fullName: string;
    username: string;
    imageUrl: string;
  };
  likes: {
    id: number;
    user_id: number;
  }[];
  saved: {
    id: number;
    user_id: number;
  }[];
};

export type LIKE_POST_PROPS = {
  postId: number;
  userId: number;
};

export type SAVE_POST_PROPS = {
  postId: number;
  userId: number;
};

export type GET_POST_RETURN_PROPS = {
  data?: { posts: IPOST[]; nextCursor: number | undefined };
  success: boolean;
  message?: string;
};
