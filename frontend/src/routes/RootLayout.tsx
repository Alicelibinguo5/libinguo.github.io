import { NavLink, Outlet } from 'react-router-dom'

export default function RootLayout() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b border-zinc-200 dark:border-zinc-800">
				<div className="container flex items-center justify-between py-4">
					<div className="text-lg font-semibold">Libin Guo</div>
					<nav className="flex items-center gap-4">
						<NavLink to="/" className="nav-link">Home</NavLink>
						<NavLink to="/projects" className="nav-link">Projects</NavLink>
						<NavLink to="/blog" className="nav-link">Blog</NavLink>
						<NavLink to="/about" className="nav-link">About</NavLink>
						<NavLink to="/contact" className="nav-link">Contact</NavLink>
					</nav>
				</div>
			</header>
			<main className="container flex-1 py-8">
				<Outlet />
			</main>
			<footer className="border-t border-zinc-200 dark:border-zinc-800">
				<div className="container py-6 text-sm text-zinc-500">© {new Date().getFullYear()} Libin Guo</div>
			</footer>
		</div>
	)
}


