import resumePdf from '../resume.pdf?url'

export default function About() {
	return (
		<section className="space-y-4">
			<h1 className="text-2xl font-semibold">Resume</h1>
			<p className="text-zinc-600 dark:text-zinc-300">Download or view my latest resume below.</p>
			<div className="mt-4">
				<a className="nav-link" href={resumePdf} target="_blank" rel="noreferrer">Download PDF</a>
			</div>
			<div className="mt-4 border rounded-lg overflow-hidden" style={{height: '80vh'}}>
				<iframe
						src={resumePdf}
					title="Resume"
					className="w-full h-full"
				/>
			</div>
		</section>
	)
}


