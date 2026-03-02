import React, { useState } from 'react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ...login logic...
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="flex flex-col gap-6 w-full max-w-md p-8 bg-white rounded-xl shadow-lg border"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Connexion</h2>
        <div className="w-full flex flex-col gap-2 mb-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="email"
            type="email"
            className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
            placeholder="example@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="w-full flex flex-col gap-2 mb-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative w-full">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full p-3 bg-gray-100 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 pr-10"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 text-sm focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <button
           type="submit"
           className="w-full p-3 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;