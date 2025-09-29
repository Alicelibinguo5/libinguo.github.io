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
			const res = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/contact/`, {
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


