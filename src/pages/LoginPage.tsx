import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, Lock, User, Shield, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuth();

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success('Login successful!');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('Login error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'AI-powered lead enrichment',
    'Automatic data analysis',
    'Multiple API integrations',
    'Real-time dashboards'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white/5 opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Database className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            DEO - <span className="text-blue-400">Arthur's Case</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Lead Data Enrichment Platform
          </p>
          <p className="text-gray-400">
            Log in to access the data enrichment platform
          </p>
        </div>

        <div className="flex max-w-6xl mx-auto">
          {/* Login Form */}
          <div className="w-full lg:w-1/2 sm:mx-auto sm:max-w-md lg:max-w-lg">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 py-10 px-8">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Restricted Area</h2>
                  <p className="text-gray-300">Secure access</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Logging in...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Access Platform
                        <ArrowRight className="ml-3 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Features Panel - Hidden on mobile */}
          <div className="hidden lg:block lg:w-1/2 lg:pl-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 h-full">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Platform Features</h3>
                  <p className="text-gray-300">All the case assignments in one place :)</p>
                </div>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-4 flex-shrink-0" />
                    <span className="text-white font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* <div className="mt-8 text-center">
                <div className="inline-flex items-center text-gray-400">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm">Conexão segura e dados protegidos</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 DEO - Arthur Case. Plataforma de enriquecimento de dados com IA.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 