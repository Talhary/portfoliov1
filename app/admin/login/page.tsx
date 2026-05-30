import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import { redirect } from "next/navigation";
import LoginForm from "./_components/login-form";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  let isValid = false;

  if (token) {
    try {
      jwt.verify(token.value, process.env.JWT_TOKEN || '');
      isValid = true;
    } catch (err) {
      console.warn('Invalid admin token found on login page, ignoring:', err);
    }
  }

  // Next.js redirect must be called outside of try-catch blocks to prevent catching NEXT_REDIRECT
  if (isValid) {
    redirect('/admin/dashboard');
  }

  return <LoginForm />;
};

export default Page;
