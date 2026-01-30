import supabase from "./config";
import type {
  CREATE_USER_PROPS,
  LOGIN_USER_PROPS,
  REGISTER_USER_PROPS,
  AUTH_API_RESPONSE,
  QUERY_API_RESPONSE,
  CREATE_POST_PROPS,
  LIKE_POST_PROPS,
  UPLOAD_POST_IMAGE,
  GET_POST_RETURN_PROPS,
  SAVE_POST_PROPS,
  IPOST,
  UPDATE_PROFILE_PROPS,
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

    if (!createUser.success || !createUser.data) {
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
): Promise<QUERY_API_RESPONSE<Record<string, unknown>>> => {
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

const findUsername = async (
  username: string,
): Promise<QUERY_API_RESPONSE<Record<string, boolean>>> => {
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
      success: true,
      data: {
        exists: !!data?.id,
      },
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
}: UPLOAD_POST_IMAGE): Promise<QUERY_API_RESPONSE<Record<string, string>>> => {
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
}): Promise<GET_POST_RETURN_PROPS> => {
  try {
    const start = pageParam;

    const { data: posts, error } = (await supabase
      .from("posts")
      .select(
        "*, users(id, username, fullName, imageUrl), likes(id, user_id), saved(id, user_id))",
      )
      .order("created_at", { ascending: false })
      .range(start, start + POSTS_LIMIT - 1)) as {
      data: IPOST[] | null;
      error: { message: string } | null;
    };

    if (error || !posts)
      return {
        success: false,
        message: error?.message || "an error occurred while fetching posts",
      };

    return {
      success: true,
      data: {
        posts: posts as IPOST[],
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

const likePost = async ({
  postId,
  userId,
}: LIKE_POST_PROPS): Promise<QUERY_API_RESPONSE<Record<string, unknown>>> => {
  try {
    if (!postId || !userId) {
      return {
        success: false,
        message: "Post ID and User ID are required",
      };
    }

    const { error, data: likedPost } = await supabase
      .from("likes")
      .insert({
        post_id: postId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          success: true,
          message: "Post already liked",
          data: undefined,
        };
      }

      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Post liked successfully",
      data: likedPost,
    };
  } catch (error) {
    console.error("Like post error:", error);
    return {
      success: false,
      message: "An error occurred while liking the post. Please try again",
    };
  }
};

const unlikePost = async ({
  postId,
  userId,
}: LIKE_POST_PROPS): Promise<QUERY_API_RESPONSE<Record<string, unknown>>> => {
  try {
    if (!postId || !userId) {
      return {
        success: false,
        message: "Post ID and User ID are required",
      };
    }

    const { error, count } = await supabase
      .from("likes")
      .delete({ count: "exact" })
      .eq("post_id", postId)
      .eq("user_id", userId)
      .select();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (count === 0) {
      return {
        success: true,
        message: "Post was not liked",
        data: undefined,
      };
    }

    return {
      success: true,
      message: "Post unliked successfully",
    };
  } catch (error) {
    console.error("Unlike post error:", error);
    return {
      success: false,
      message: "An error occurred while unliking the post. Please try again",
    };
  }
};

const savePost = async ({
  postId,
  userId,
}: SAVE_POST_PROPS): Promise<QUERY_API_RESPONSE<Record<string, unknown>>> => {
  try {
    if (!postId || !userId) {
      return {
        success: false,
        message: "Post id and User id are required",
      };
    }

    const { data, error } = await supabase
      .from("saved")
      .insert({ post_id: postId, user_id: userId })
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
      message: "Post saved successfully",
      data,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while saving post",
    };
  }
};

const unsavePost = async ({
  postId,
  userId,
}: SAVE_POST_PROPS): Promise<QUERY_API_RESPONSE<Record<string, unknown>>> => {
  try {
    if (!postId || !userId) {
      return {
        success: false,
        message: "Post id and User id are required",
      };
    }

    const { error } = await supabase
      .from("saved")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Post unsaved successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while unsave post",
    };
  }
};

const getUser = async (userId: number) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*, posts(id)")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "An error occurred while fetching user",
    };
  }
};

const updateUserProfile = async ({
  userId,
  fullName,
  username,
  bio,
  profilePicture,
}: UPDATE_PROFILE_PROPS) => {
  try {
    let imageUrl: string | undefined;

    if (profilePicture) {
      const filePath = `avatars/${userId}-${UUID()}-${profilePicture.name}`;

      const { error: uploadError } = await supabase.storage
        .from("profilePicture")
        .upload(filePath, profilePicture, {
          contentType: profilePicture.type,
          upsert: true,
        });

      if (uploadError) {
        return {
          success: false,
          message: uploadError.message,
        };
      }

      const { data } = supabase.storage
        .from("profilePicture")
        .getPublicUrl(filePath);

      imageUrl = data.publicUrl;
    }

    const { error, data } = await supabase
      .from("users")
      .update({
        fullName,
        username,
        bio,
        imageUrl,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    await supabase.auth.updateUser({
      data: {
        imageUrl: data.imageUrl || null,
      },
    });

    return { success: true, message: "User updated Successfully" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occurred while updating user",
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
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getUser,
  updateUserProfile,
};
