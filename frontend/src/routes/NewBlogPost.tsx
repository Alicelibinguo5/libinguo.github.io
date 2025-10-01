import { FormEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewBlogPost() {
	const navigate = useNavigate()
	const [title, setTitle] = useState('')
	const [summary, setSummary] = useState('')
	const [content, setContent] = useState('')
	const contentRef = useRef<HTMLTextAreaElement | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	function wrapSelection(before: string, after: string = before) {
		const el = contentRef.current
		if (!el) {
			setContent((c) => `${before}${c}${after}`)
			return
		}
		const start = el.selectionStart ?? 0
		const end = el.selectionEnd ?? 0
		const selected = content.slice(start, end)
		const next = content.slice(0, start) + before + selected + after + content.slice(end)
		setContent(next)
		setTimeout(() => { el.focus(); el.selectionStart = start + before.length; el.selectionEnd = start + before.length + selected.length }, 0)
	}

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setSubmitting(true)
		setError(null)
		try {
			const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
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
				<div className="flex flex-wrap items-center gap-3 text-sm">
					<button type="button" className="nav-link" onClick={() => wrapSelection('**')}>Bold</button>
					<button type="button" className="nav-link" onClick={() => wrapSelection('_')}>Italic</button>
					<button type="button" className="nav-link" onClick={() => wrapSelection('`')}>Code</button>
					<button type="button" className="nav-link" onClick={() => wrapSelection('\n```\n', '\n```\n')}>Code block</button>
					<button type="button" className="nav-link" onClick={() => {
						const url = prompt('Image URL')?.trim()
						if (!url) return
						const alt = prompt('Alt text (optional)')?.trim() ?? ''
						const tag = `<img src="${url}" alt="${alt}" loading="lazy" style="max-width:100%;height:auto;" />`
						const el = contentRef.current
						if (el) {
							const start = el.selectionStart ?? content.length
							const end = el.selectionEnd ?? content.length
							const next = content.slice(0, start) + tag + content.slice(end)
							setContent(next)
							setTimeout(() => { el.focus(); el.selectionStart = el.selectionEnd = start + tag.length }, 0)
						} else {
							setContent((c) => c + tag)
						}
					}}>Insert image</button>
				</div>
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
					<textarea
						ref={contentRef}
						className="w-full input"
						value={content}
						onChange={e => setContent(e.target.value)}
						rows={10}
						required
						onPaste={async (e) => {
							const items = e.clipboardData?.items
							if (!items) return
							for (const item of items) {
								if (item.type.startsWith('image/')) {
									e.preventDefault()
									const file = item.getAsFile()
									if (!file) return
									const reader = new FileReader()
									reader.onload = () => {
										const dataUrl = String(reader.result)
										const tag = `<img src="${dataUrl}" alt="pasted image" loading="lazy" style="max-width:100%;height:auto;" />`
										const el = contentRef.current
										if (el) {
											const start = el.selectionStart ?? content.length
											const end = el.selectionEnd ?? content.length
											const next = content.slice(0, start) + tag + content.slice(end)
											setContent(next)
											setTimeout(() => { el.focus(); el.selectionStart = el.selectionEnd = start + tag.length }, 0)
										} else {
											setContent((c) => c + tag)
										}
									}
									reader.readAsDataURL(file)
									break
								}
							}
						}}
					/>
				</div>
				{error && <div className="text-red-600 text-sm">{error}</div>}
				<button className="btn" type="submit" disabled={submitting}>{submitting ? 'Publishing…' : 'Publish'}</button>
			</form>
		</section>
	)
}


