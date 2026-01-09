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
