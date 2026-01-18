import { z } from "zod";

const trimString = z.string().trim().min(1, "Field cannot be empty");

export const registerSchema = z.object({
  email: trimString
    .email("Invalid email address")
    .max(254, "Email is too long")
    .transform((v) => v.toLowerCase()),

  username: trimString
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username can contain letters, numbers, dots, and underscores only",
    )
    .refine(
      (v) => !v.startsWith(".") && !v.endsWith("."),
      "Username cannot start or end with a dot",
    )
    .transform((v) => v.toLowerCase()),

  fullName: trimString
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name is too long")
    .regex(
      /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
      "Full name can contain letters and single spaces only",
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password is too long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(254, "Email is too long")
    .transform((v) => v.toLowerCase()),

  password: z
    .string()
    .min(8, "Invalid email or password")
    .max(64, "Invalid email or password"),
});

export const postSchema = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(500, "Caption too long"),

  tags: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.split(",").every((tag) => tag.trim().length > 0),
      {
        message: "Tags must be comma separated values",
      },
    ),

  location: z.string().max(100, "Location too long").optional(),

  postImage: z
    .instanceof(File, { message: "Image is required" })
    .refine((file) => file.size <= 8 * 1024 * 1024, {
      message: "Image must be less than 8MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPG, PNG or WEBP images are allowed",
      },
    ),
});

export const editProfileSchema = z.object({
  username: trimString
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username can contain letters, numbers, dots, and underscores only",
    )
    .refine(
      (v) => !v.startsWith(".") && !v.endsWith("."),
      "Username cannot start or end with a dot",
    )
    .transform((v) => v.toLowerCase()),

  fullName: trimString
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name is too long")
    .regex(
      /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
      "Full name can contain letters and single spaces only",
    ),

  bio: z.string().max(160, "Bio must be under 160 characters").optional(),

  profilePicture: z
    .instanceof(File, { message: "Image is required" })
    .refine((file) => file.size <= 8 * 1024 * 1024, {
      message: "Image must be less than 8MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only JPG, PNG or WEBP images are allowed",
      },
    )
    .optional(),
});
