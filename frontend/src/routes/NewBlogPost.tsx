import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewBlogPost() {
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [summary, setSummary] = useState('')
	const [content, setContent] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setSubmitting(true)
		setError(null)
		try {
			const base = import.meta.env.VITE_API_URL ?? ''
			const res = await fetch(`${base}/api/blog/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, summary, content }),
			})
			if (!res.ok) throw new Error(`Failed: ${res.status}`)
			const data = await res.json()
			navigate(`/blog/${data.slug}`)
		} catch (e: any) {
			setError(e.message ?? 'Error')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<section className="space-y-6">
			<h1 className="text-2xl font-semibold">New Post</h1>
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
				<button className="btn" type="submit" disabled={submitting}>{submitting ? 'Publishing…' : 'Publish'}</button>
			</form>
		</section>
	)
}


