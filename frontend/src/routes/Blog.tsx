import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { BlogPost } from './blogData'

export default function Blog() {
	const [posts, setPosts] = useState<BlogPost[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()
		async function fetchPosts() {
			try {
				const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
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


