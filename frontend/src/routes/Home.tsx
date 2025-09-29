export default function Home() {
	return (
		<section className="space-y-6">
			<h1 className="text-3xl font-bold tracking-tight">Hi, I’m Alice.</h1>
			<p className="text-zinc-600 dark:text-zinc-300 max-w-2xl">
				I build performant web apps. This portfolio showcases selected projects and ways to reach me.
			</p>
			<div className="grid md:grid-cols-2 gap-6">
				<div className="card">
					<h2 className="font-semibold mb-2">Featured</h2>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Check out my latest work in the Projects page.</p>
				</div>
				<div className="card">
					<h2 className="font-semibold mb-2">Get in touch</h2>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">Use the Contact page to send a message.</p>
				</div>
			</div>
		</section>
	)
}


