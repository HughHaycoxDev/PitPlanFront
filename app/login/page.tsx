"use client";

export default function LoginPage(){
	const handleLogin = () => {
		window.location.href = "http://localhost:8000/login";
	};

	return (
	<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
	      <h1 className="text-3xl font-bold mb-6">Login with iRacing</h1>
	      <button
		onClick={handleLogin}
		className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
	      >
		Continue with iRacing
	      </button>
	    </div>
  );
}
