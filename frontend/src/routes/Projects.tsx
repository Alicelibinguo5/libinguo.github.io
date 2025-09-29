import { useEffect, useState } from 'react'

type GithubRepo = {
	id: number
	name: string
	full_name: string
	html_url: string
	description?: string | null
	language?: string | null
	stargazers_count?: number
	forks_count?: number
	topics?: string[]
}

export default function Projects() {
	const [repos, setRepos] = useState<GithubRepo[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()
		async function fetchRepos() {
			try {
				const base = import.meta.env.VITE_API_URL ?? ''
				const url = `${base}/api/github/repos?username=Alicelibinguo5&per_page=12`
				const res = await fetch(url, { signal: controller.signal })
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				const data: GithubRepo[] = await res.json()
				setRepos(data)
			} catch (e: any) {
				if (e.name !== 'AbortError') setError(e.message ?? 'Error')
			} finally {
				setLoading(false)
			}
		}
		fetchRepos()
		return () => controller.abort()
	}, [])

	if (loading) return <div>Loading projects…</div>
	if (error) return <div className="text-red-600">{error}</div>

	return (
		<section className="space-y-6">
			<h1 className="text-2xl font-semibold">Projects</h1>
			<div className="grid md:grid-cols-2 gap-6">
				{repos.map((r) => (
					<article key={r.id} className="card">
						<h2 className="font-semibold text-lg">{r.name}</h2>
						{r.description && (
							<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{r.description}</p>
						)}
						<div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
							{r.language && <span>{r.language}</span>}
							{typeof r.stargazers_count === 'number' && <span>★ {r.stargazers_count}</span>}
							{typeof r.forks_count === 'number' && <span>⑂ {r.forks_count}</span>}
						</div>
						<div className="mt-3 flex gap-3 text-sm">
							<a className="nav-link" href={r.html_url} target="_blank" rel="noreferrer">GitHub</a>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}


