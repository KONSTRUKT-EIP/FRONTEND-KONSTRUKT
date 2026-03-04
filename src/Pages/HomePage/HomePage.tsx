import React from 'react';

const HomePage: React.FC = () => {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
			<div className="max-w-2xl w-full text-center p-10 bg-white/80 rounded-3xl shadow-2xl border border-orange-100">
				<h1 className="text-5xl font-extrabold text-orange-500 mb-4 drop-shadow-lg">Welcome to KONSTRUKT</h1>
				<p className="text-lg text-gray-700 mb-8">
					Your all-in-one platform for managing construction projects, weather alerts, planning, and more.<br/>
					Get started by signing in or exploring the dashboard!
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<a href="/signin" className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold text-lg shadow hover:bg-orange-600 transition">Sign in</a>
					<a href="/signup" className="px-8 py-3 bg-white border border-orange-400 text-orange-500 rounded-full font-semibold text-lg shadow hover:bg-orange-50 transition">Sign up</a>
				</div>
			</div>
			<div className="mt-12 text-gray-400 text-sm">© 2026 KONSTRUKT. All rights reserved.</div>
		</main>
	);
};

export default HomePage;
