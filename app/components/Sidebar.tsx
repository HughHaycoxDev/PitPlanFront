"use client";

import Link from "next/link";
import { Calendar, Home, User } from "lucide-react";

export default function Sidebar(){
	return (
	 <aside className="h-screen w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-6">
	      {/* Logo */}
	      <div className="font-bold text-2xl text-blue-600 tracking-tight">
		PitPlan
	      </div>

	      {/* Navigation */}
	      <nav className="flex flex-col gap-4">
		<Link className="flex items-center gap-3 text-gray-700 hover:text-blue-600" href="/home">
		  <Home size={20} /> Home
		</Link>

		<Link className="flex items-center gap-3 text-gray-700 hover:text-blue-600" href="/calendar">
		  <Calendar size={20} /> Calendar
		</Link>

		<Link className="flex items-center gap-3 text-gray-700 hover:text-blue-600" href="/profile">
		  <User size={20} /> Profile
		</Link>
	      </nav>
	    </aside>
	);
}
