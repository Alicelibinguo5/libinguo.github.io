import { Link } from 'react-router-dom'

export default function Home() {
	return (
		<section className="space-y-6">
			<h1 className="text-3xl font-bold tracking-tight">Hi, I’m Libin.</h1>
			<p className="text-zinc-600 dark:text-zinc-300 max-w-2xl">
				I’m a software engineer focused on data pipelines and platform engineering—turning complex data challenges into robust, production-ready systems. Currently at Apple; previously at JPMorgan and a healthcare startup.
			</p>
			{(() => {
				const linkedinUrl = (import.meta.env.VITE_LINKEDIN_URL as string | undefined) || 'https://www.linkedin.com/in/libinguo/'
				const githubUrl = 'https://github.com/Alicelibinguo5'
				return (
					<div className="grid md:grid-cols-2 gap-6">
						<div className="card">
							<h2 className="font-semibold mb-2">Connect</h2>
							<ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
								{linkedinUrl && (
									<li><a className="nav-link" href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a></li>
								)}
								<li><a className="nav-link" href={githubUrl} target="_blank" rel="noreferrer">GitHub</a></li>
							</ul>
						</div>
						<div className="card">
							<h2 className="font-semibold mb-2">Get in touch</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Use the Contact page to send a message.</p>
							<div className="mt-2">
								<Link className="nav-link" to="/contact">Contact</Link>
							</div>
						</div>
					</div>
				)
			})()}
		</section>
	)
}


