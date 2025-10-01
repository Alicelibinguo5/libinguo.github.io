import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { BlogPost } from './blogData'

export default function BlogPost() {
	const { slug } = useParams()
	const [post, setPost] = useState<BlogPost | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!slug) return
		const controller = new AbortController()
		async function fetchPost() {
			try {
				const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
				const res = await fetch(`${base}/api/blog/${slug}`, { signal: controller.signal })
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				const data: BlogPost = await res.json()
				setPost(data)
			} catch (e: any) {
				if (e.name !== 'AbortError') setError(e.message ?? 'Error')
			} finally {
				setLoading(false)
			}
		}
		fetchPost()
		return () => controller.abort()
	}, [slug])

	if (loading) return <div>Loading…</div>
	if (error) return <div className="text-red-600">{error}</div>
	if (!post) return <div>Post not found.</div>

	return (
		<article className="space-y-4">
			<h1 className="text-2xl font-semibold">{post.title}</h1>
			<p className="text-xs text-zinc-500">{new Date(post.created_at).toLocaleDateString()}</p>
			<div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
				{post.content}
			</div>
			<div className="mt-4 flex items-center gap-4">
				<Link className="nav-link" to={`/blog/${post.slug}/edit`}>Edit</Link>
				<button
					className="text-sm text-red-600 hover:underline"
					onClick={async () => {
						if (!confirm('Delete this post? This cannot be undone.')) return
						const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
						const res = await fetch(`${base}/api/blog/${post.slug}`, { method: 'DELETE' })
						if (res.ok) {
							window.location.href = '/#/blog'
						}
					}}
				>
					Delete
				</button>
			</div>
		</article>
	)
}


