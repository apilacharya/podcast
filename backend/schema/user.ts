import { z } from "zod";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(50)
      .refine((value): boolean => !value.includes(" "), {
        message: "Username cannot contain spaces",
      }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(1, { message: "Is required" })
      .max(191, { message: "Too long" }),
    password: z.string().min(6).max(120, {
      message: "Password must be between 6 and 120 characters",
    }),
    confirmPassword: z.string().min(6).max(120, {
      message: "Password must be between 6 and 120 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

const signInSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Email or username is required" })
    .refine(
      (value) => {
        // Check if it's a valid email OR valid username
        const isEmail = z.string().email().safeParse(value).success;
        const isUsername = z
          .string()
          .min(3)
          .max(50)
          .regex(/^[a-zA-Z0-9_]+$/)
          .safeParse(value).success;
        return isEmail || isUsername;
      },
      {
        message: "Please enter a valid email or username",
      }
    ),
  password: z.string().min(6).max(120, {
    message: "Password must be between 6 and 120 characters",
  }),
});
