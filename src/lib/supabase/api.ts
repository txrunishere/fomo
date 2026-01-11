import supabase from "./config";
import type {
  CREATE_USER_PROPS,
  LOGIN_USER_PROPS,
  REGISTER_USER_PROPS,
  AUTH_API_RESPONSE,
} from "@/types";

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
      return createUser;
    }

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
): Promise<AUTH_API_RESPONSE> => {
  try {
    const { accountId, email, fullName, username } = data;

    const { error } = await supabase
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

export { registerUser, loginUser, logoutUser, findUsername };
