import { z } from "zod";

export const SignupFormSchema = z.object({
  displayName: z.string().trim().min(2, "ニックネームは2文字以上で入力してください。"),
  email: z.email("正しいメールアドレスを入力してください。").trim(),
  password: z.string().min(8, "パスワードは8文字以上で入力してください。"),
});

export const LoginFormSchema = z.object({
  email: z.email("正しいメールアドレスを入力してください。").trim(),
  password: z.string().min(1, "パスワードを入力してください。"),
});

export type AuthFormState =
  | {
      errors?: {
        displayName?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
