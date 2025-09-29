import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { BlogPost } from './blogData'

export default function EditBlogPost() {
	const { slug } = useParams()
	const navigate = useNavigate()
	const [post, setPost] = useState<BlogPost | null>(null)
	const [title, setTitle] = useState('')
	const [summary, setSummary] = useState('')
	const [content, setContent] = useState('')
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!slug) return
		const controller = new AbortController()
		async function fetchPost() {
			try {
				const base = import.meta.env.VITE_API_URL ?? ''
				const res = await fetch(`${base}/api/blog/${slug}`, { signal: controller.signal })
				if (!res.ok) throw new Error(`Failed: ${res.status}`)
				const data: BlogPost = await res.json()
				setPost(data)
				setTitle(data.title)
				setSummary(data.summary)
				setContent(data.content)
			} catch (e: any) {
				if (e.name !== 'AbortError') setError(e.message ?? 'Error')
			} finally {
				setLoading(false)
			}
		}
		fetchPost()
		return () => controller.abort()
	}, [slug])

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		if (!slug) return
		setSaving(true)
		setError(null)
		try {
			const base = import.meta.env.VITE_API_URL ?? ''
			const res = await fetch(`${base}/api/blog/${slug}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, summary, content })
			})
			if (!res.ok) throw new Error(`Failed: ${res.status}`)
			navigate(`/blog/${slug}`)
		} catch (e: any) {
			setError(e.message ?? 'Error')
		} finally {
			setSaving(false)
		}
	}

	if (loading) return <div>Loading…</div>
	if (!post) return <div>Post not found.</div>

	return (
		<section className="space-y-6">
			<h1 className="text-2xl font-semibold">Edit Post</h1>
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Title</label>
					<input className="w-full input" value={title} onChange={e => setTitle(e.target.value)} required />
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Summary</label>
					<textarea className="w-full input" value={summary} onChange={e => setSummary(e.target.value)} rows={3} required />
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Content</label>
					<textarea className="w-full input" value={content} onChange={e => setContent(e.target.value)} rows={10} required />
				</div>
				{error && <div className="text-red-600 text-sm">{error}</div>}
				<button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
			</form>
		</section>
	)
}


