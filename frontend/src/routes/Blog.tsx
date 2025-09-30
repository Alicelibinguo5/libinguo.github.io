import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { BlogPost } from './blogData'

export default function Blog() {
	const [posts, setPosts] = useState<BlogPost[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'

	useEffect(() => {
		const controller = new AbortController()
		async function fetchPosts() {
			try {
				const res = await fetch(`${base}/api/blog/`, { signal: controller.signal })
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				const data: BlogPost[] = await res.json()
				setPosts(data)
			} catch (e: any) {
				if (e.name !== 'AbortError') setError(e.message ?? 'Error')
			} finally {
				setLoading(false)
			}
		}
		fetchPosts()
		return () => controller.abort()
	}, [])

	if (loading) return <div>Loading posts…</div>
	if (error) return <div className="text-red-600">{error}</div>
	return (
		<section className="space-y-6">
			<h1 className="text-2xl font-semibold">Blog</h1>
			<div>
				<Link className="nav-link" to="/blog/new">New Post</Link>
			</div>
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<a className="nav-link" href={`${base}/api/blog/backup`} target="_blank" rel="noreferrer">Export JSON</a>
					<label className="nav-link cursor-pointer">
						Import JSON
						<input type="file" accept="application/json" className="hidden" onChange={async (e) => {
							const file = e.target.files?.[0]
							if (!file) return
							try {
								const text = await file.text()
								const data = JSON.parse(text)
								await fetch(`${base}/api/blog/restore`, {
									method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
								})
								// reload
								setLoading(true)
								const res = await fetch(`${base}/api/blog/`)
								setPosts(await res.json())
							} catch (err) {
								console.error(err)
							}
						}} />
					</label>
				</div>
				{posts.map((p) => (
					<article key={p.slug} className="card">
						<h2 className="font-semibold text-lg">
							<Link className="nav-link" to={`/blog/${p.slug}`}>{p.title}</Link>
						</h2>
						<p className="text-xs text-zinc-500">{new Date(p.created_at).toLocaleDateString()}</p>
						<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{p.summary}</p>
					</article>
				))}
			</div>
		</section>
	)
}


