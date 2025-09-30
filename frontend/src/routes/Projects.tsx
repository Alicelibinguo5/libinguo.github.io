import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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
                const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
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

	// Feature the DOJ legal researcher agent as #1 with a clear goal sentence
	const FEATURED_FULL_NAME = 'Alicelibinguo5/doj-legal-researcher-agent'
	const FEATURED_GOAL = 'Build a multi-agent system to analyze DOJ press releases and categorize fraud and money-laundering cases.'

	// Make Ads Campaign Metrics the #2 project with a concise goal
	const SECOND_FULL_NAME = 'Alicelibinguo5/ads-compaign-metric'
	const SECOND_GOAL = 'Real-time streaming pipeline for ad campaign metrics using Kafka, Flink, and Iceberg with Superset dashboards.'

	// Make A/B Test Analysis the #3 project with a concise goal
	const THIRD_FULL_NAME = 'Alicelibinguo/Analyzing-Website-Landing-Page-A-B-Test-Results-'
	const THIRD_REPO_NAME = 'Analyzing-Website-Landing-Page-A-B-Test-Results-'
	const THIRD_GOAL = 'A/B testing analysis to assess if a new landing page increases conversion, using pandas, matplotlib, and regression.'

	// Only show repos that have at least one GitHub star
	let displayRepos: GithubRepo[] = repos.filter(r => (r.stargazers_count ?? 0) > 0)
	const featuredIndex = displayRepos.findIndex(r => r.full_name === FEATURED_FULL_NAME)
	if (featuredIndex >= 0) {
		const [featured] = displayRepos.splice(featuredIndex, 1)
		displayRepos = [featured, ...displayRepos]
	} else {
		// If not returned by API for any reason, insert a minimal featured card
		displayRepos = [
			{
				id: -1,
				name: 'doj-legal-researcher-agent',
				full_name: FEATURED_FULL_NAME,
				html_url: 'https://github.com/Alicelibinguo5/doj-legal-researcher-agent',
				description: FEATURED_GOAL,
				language: 'Python',
				stargazers_count: undefined,
				forks_count: undefined,
				topics: ['multi-agent', 'FastAPI', 'LangGraph']
			},
			...displayRepos,
		]
	}

	// Ensure Ads Campaign Metrics appears as the second project
	const secondIndex = displayRepos.findIndex(r => r.full_name === SECOND_FULL_NAME)
	if (secondIndex >= 0) {
		const [second] = displayRepos.splice(secondIndex, 1)
		const insertPos = Math.min(1, displayRepos.length)
		displayRepos.splice(insertPos, 0, second)
	} else {
		const insertPos = Math.min(1, displayRepos.length)
		displayRepos.splice(insertPos, 0, {
			id: -2,
			name: 'ads-compaign-metric',
			full_name: SECOND_FULL_NAME,
			html_url: 'https://github.com/Alicelibinguo5/ads-compaign-metric',
			description: SECOND_GOAL,
			language: 'Python',
			stargazers_count: undefined,
			forks_count: undefined,
			topics: ['Kafka', 'Flink', 'Iceberg', 'Superset']
		})
	}

	// Ensure A/B Test project appears as the third project
	const thirdIndex = displayRepos.findIndex(r => r.full_name === THIRD_FULL_NAME || r.name === THIRD_REPO_NAME)
	if (thirdIndex >= 0) {
		const [third] = displayRepos.splice(thirdIndex, 1)
		const insertPos3 = Math.min(2, displayRepos.length)
		displayRepos.splice(insertPos3, 0, third)
	} else {
		const insertPos3 = Math.min(2, displayRepos.length)
		displayRepos.splice(insertPos3, 0, {
			id: -3,
			name: THIRD_REPO_NAME,
			full_name: THIRD_FULL_NAME,
			html_url: 'https://github.com/Alicelibinguo/Analyzing-Website-Landing-Page-A-B-Test-Results-',
			description: THIRD_GOAL,
			language: 'Python',
			stargazers_count: undefined,
			forks_count: undefined,
			topics: ['pandas', 'matplotlib', 'statsmodels', 'sklearn']
		})
	}

	// Deduplicate by repository name to avoid showing forks and the pinned card together
	const seenNames = new Set<string>()
	displayRepos = displayRepos.filter(r => {
		if (seenNames.has(r.name)) return false
		seenNames.add(r.name)
		return true
	})

	// Limit to a maximum of 8 projects
	displayRepos = displayRepos.slice(0, 8)

	return (
		<section className="space-y-6">
			<h1 className="text-2xl font-semibold">Projects</h1>
			<div className="grid md:grid-cols-2 gap-6">
				{displayRepos.map((r, i) => {
					const isFeatured = r.full_name === FEATURED_FULL_NAME
					const isSecond = r.full_name === SECOND_FULL_NAME
					const isThird = r.full_name === THIRD_FULL_NAME
					const baseTags = (r.topics && r.topics.length ? r.topics : (r.language ? [r.language] : []))
					const tags = isFeatured ? Array.from(new Set([...baseTags, 'multi-agent', 'FastAPI'])) : baseTags
					return (
					<article key={r.id} className="card">
							<div className="flex items-center gap-2">
								<h2 className="font-semibold text-lg">
									<a className="hover:underline cursor-pointer" href={r.html_url} target="_blank" rel="noreferrer noopener" aria-label={`Open ${r.name} on GitHub`}>{r.name}</a>
								</h2>
								{isFeatured && (
									<span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">Featured</span>
								)}
							</div>
							{(isFeatured ? FEATURED_GOAL : isSecond ? SECOND_GOAL : isThird ? THIRD_GOAL : r.description) && (
								<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{isFeatured ? FEATURED_GOAL : isSecond ? SECOND_GOAL : isThird ? THIRD_GOAL : r.description}</p>
							)}
							<div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
							{r.language && <span>{r.language}</span>}
							{typeof r.stargazers_count === 'number' && <span>★ {r.stargazers_count}</span>}
							{typeof r.forks_count === 'number' && <span>⑂ {r.forks_count}</span>}
						</div>
							<div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
								<a className="nav-link" href={r.html_url} target="_blank" rel="noreferrer">GitHub</a>
								{isFeatured && (
									<Link className="nav-link" to="/projects/doj-legal-researcher-agent">Read Case Study</Link>
								)}
							</div>
							{tags.length > 0 && (
								<div className="mt-3 flex flex-wrap gap-2 text-xs">
									{tags.slice(0, 6).map(t => (
										<span key={t} className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">{t}</span>
									))}
								</div>
							)}
					</article>
					)
				})}
			</div>
		</section>
	)
}


