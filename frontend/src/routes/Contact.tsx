import { useState } from 'react'

export default function Contact() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
	const [error, setError] = useState<string | null>(null)

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setStatus('submitting')
		setError(null)
		try {
			const base = (import.meta.env.VITE_API_URL as string | undefined) || 'https://libinguo-io.onrender.com'
			const res = await fetch(`${base}/api/contact/`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, subject, message }),
			})
			if (!res.ok) throw new Error(`Failed: ${res.status}`)
			setStatus('success')
			setName(''); setEmail(''); setSubject(''); setMessage('')
		} catch (e: any) {
			setStatus('error')
			setError(e.message ?? 'Error')
		}
	}

	return (
		<section className="space-y-6 max-w-xl">
			<h1 className="text-2xl font-semibold">Contact</h1>
			<div className="card flex items-center gap-4">
				<a className="nav-link" href="https://www.linkedin.com/in/libinguo/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0H12v2.2h.06c.62-1.17 2.14-2.4 4.41-2.4 4.72 0 5.59 3.11 5.59 7.14V24h-5v-7.28c0-1.74-.03-3.97-2.42-3.97-2.42 0-2.79 1.89-2.79 3.84V24h-5V8z"/></svg>
				</a>
				<a className="nav-link" href="https://github.com/Alicelibinguo5" target="_blank" rel="noreferrer" aria-label="GitHub">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.84 3.14 8.94 7.49 10.39.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.05.66-3.69-1.3-3.69-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.47-2.44-.28-5.01-1.22-5.01-5.42 0-1.2.43-2.17 1.13-2.94-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.12A10.6 10.6 0 0 1 12 6.8c.94 0 1.89.13 2.78.37 2.12-1.42 3.05-1.12 3.05-1.12.6 1.53.22 2.66.11 2.94.7.77 1.13 1.74 1.13 2.94 0 4.21-2.58 5.13-5.04 5.4.39.34.73 1 .73 2.02 0 1.46-.01 2.63-.01 2.99 0 .29.2.63.76.52A10.52 10.52 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z"/></svg>
				</a>
				<a className="nav-link" href="mailto:libinguo89@gmail.com" aria-label="Email">libinguo89@gmail.com</a>
			</div>
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label className="block text-sm mb-1">Name</label>
					<input className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
				</div>
				<div>
					<label className="block text-sm mb-1">Email</label>
					<input type="email" className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div>
					<label className="block text-sm mb-1">Subject</label>
					<input className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" value={subject} onChange={(e) => setSubject(e.target.value)} required />
				</div>
				<div>
					<label className="block text-sm mb-1">Message</label>
					<textarea className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
				</div>
				<button disabled={status === 'submitting'} className="px-4 py-2 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
					{status === 'submitting' ? 'Sending…' : 'Send'}
				</button>
				{status === 'success' && <div className="text-green-600">Message sent!</div>}
				{status === 'error' && <div className="text-red-600">{error ?? 'Something went wrong'}</div>}
			</form>
		</section>
	)
}


