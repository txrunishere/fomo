import supabase from "./config";
import type {
  CREATE_USER_PROPS,
  LOGIN_USER_PROPS,
  REGISTER_USER_PROPS,
  AUTH_API_RESPONSE,
  QUERY_API_RESPONSE,
  CREATE_POST_PROPS,
  IPOST,
} from "@/types";
import { v4 as UUID } from "uuid";
import { POSTS_LIMIT } from "../constants";

const registerUser = async (
  data: REGISTER_USER_PROPS,
): Promise<AUTH_API_RESPONSE> => {
  try {
    const { email, fullName, password, username } = data;
    const { data: res, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.code === "user_already_exists") {
        return {
          message: "Email already Registered",
          success: false,
        };
      }
      return {
        message: error.message,
        success: false,
      };
    }

    if (!res.user) {
      return {
        success: false,
        message: "an error occured!",
      };
    }

    const createUser = await createUserRow({
      email: res.user.email || email,
      accountId: res.user.id,
      fullName,
      username,
    });

    if (!createUser.success) {
      return {
        success: false,
        message: createUser?.message || "an error occurred!",
      };
    }

    await supabase.auth.updateUser({
      data: {
        fullName: createUser.data.fullName,
        imageUrl: createUser.data.imageUrl || null,
        userId: createUser.data.id,
      },
    });

    return {
      success: true,
      message: "Successfully register!!",
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "signup error occured!",
    };
  }
};

const loginUser = async (
  data: LOGIN_USER_PROPS,
): Promise<AUTH_API_RESPONSE> => {
  try {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Successfully login!!",
    };
  } catch (e) {
    console.error(e);
    return {
      message: "signin error occured!",
      success: false,
    };
  }
};

const logoutUser = async (): Promise<AUTH_API_RESPONSE | undefined> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "logout successfully",
  };
};

const createUserRow = async (
  data: CREATE_USER_PROPS,
): Promise<QUERY_API_RESPONSE> => {
  try {
    const { accountId, email, fullName, username } = data;

    const { error, data: user } = await supabase
      .from("users")
      .insert([
        {
          username,
          fullName,
          email,
          accountId,
        },
      ])
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "User created successfully!",
      data: user,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "an error occured while creating user!",
    };
  }
};

const findUsername = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      exists: !!data?.id,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "an error occured while finding user",
    };
  }
};

const createPost = async (data: CREATE_POST_PROPS) => {
  try {
    const uploadImageResponse = await uploadPostImage({
      image: data.image,
      userId: data.userId,
    });

    if (!uploadImageResponse.success || !uploadImageResponse.data) {
      return uploadImageResponse;
    }

    const { error } = await supabase.from("posts").insert({
      caption: data.caption,
      location: data.location,
      tags: data.tags,
      userId: data.userId,
      postImageUrl: uploadImageResponse.data?.url,
    });

    if (error) {
      await deletePostImage(uploadImageResponse.data.filePath);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Post created successfully!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "an error occurred while creating post",
    };
  }
};

const uploadPostImage = async ({
  image,
  userId,
}: {
  image: File;
  userId: string;
}) => {
  try {
    const filePath = `${userId}/${UUID()}-${image.name}`;

    const { data, error } = await supabase.storage
      .from("postImage")
      .upload(filePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    const { data: publicUrl } = supabase.storage
      .from("postImage")
      .getPublicUrl(data.path);

    return {
      success: true,
      data: {
        url: publicUrl.publicUrl,
        filePath: data.path,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while uploading image",
    };
  }
};

const deletePostImage = async (filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from("postImage")
      .remove([filePath]);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while deleting image",
    };
  }
};

const getPosts = async ({
  pageParam = 0,
}: {
  pageParam?: number | undefined;
}): Promise<{
  data?: { posts: IPOST[]; nextCursor: number | undefined };
  success: boolean;
  message?: string;
}> => {
  try {
    const start = pageParam;

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*, users(id, username, fullName, imageUrl), likes(*), saved(*)")
      .order("created_at", { ascending: false })
      .range(start, start + POSTS_LIMIT - 1);

    console.log(posts);

    if (error)
      return {
        success: false,
        message: error.message,
      };

    return {
      success: true,
      data: {
        posts,
        nextCursor:
          posts.length === POSTS_LIMIT ? start + POSTS_LIMIT : undefined,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "an error occurred while fetching posts!",
    };
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  findUsername,
  createPost,
  getPosts,
};
