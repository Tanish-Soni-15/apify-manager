import React, { useState } from 'react';
import { Key, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const AuthForm = ({setIsAuthenticated ,setUser}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit =async (e) => {
    e.preventDefault();
        if (!apiKey.trim()) {
      setError('Please enter your Apify API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/validate-key`, {
        method: "POST",
        headers: {
      "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
        credentials: "include", // ✅ Automatically sets multipart/form-data
      });
      const res = await response.json();
     
      
      if (response.ok) {
        if(res.valid==true){
        setUser(res.user);
        console.log(res);
        setIsAuthenticated(true);
        }
        else{
           setError('Invalid API key. Please check your credentials.');
      setIsAuthenticated(false);
        }
      }
    } catch (err) {
      setError('Invalid API key. Please check your credentials.');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apify Actor Manager</h1>
          <p className="text-gray-600">Enter your Apify API key to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Apify API key"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating...</span>
              </>
            ) : (
              <span>Connect to Apify</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>Get your API key from your <a href="https://console.apify.com/account#/integrations" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Apify Console</a></p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;