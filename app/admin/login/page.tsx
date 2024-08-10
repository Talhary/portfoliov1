'use client';

import { LoginUser } from '@/actions/login';
import { FormEvent, useState } from 'react';

const Login = () => {
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = { email: formData.get('email'), password: formData.get('password') };
    if (!user.email || !user.password) return;
    const res = await LoginUser(user.email as string, user.password as string);
    console.log(res);
    if (res?.success) {
      console.log(res?.token);
      return;
    }
    return setError(res?.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md ">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full px-3 py-2 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-full px-3 py-2 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Login
        </button>
        {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
