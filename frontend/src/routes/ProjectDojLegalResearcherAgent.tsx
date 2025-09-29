export default function ProjectDojLegalResearcherAgent() {
	return (
		<section className="space-y-6">
			<h1 className="text-2xl font-semibold">
				<a className="nav-link" href="https://github.com/Alicelibinguo5/doj-legal-researcher-agent" target="_blank" rel="noreferrer">doj-legal-researcher-agent</a>
			</h1>
			<p className="text-zinc-600 dark:text-zinc-300 max-w-2xl">
				Build a multi-agent system to analyze DOJ press releases and categorize fraud and money-laundering cases.
			</p>
			<div className="grid md:grid-cols-2 gap-6">
				<div className="card space-y-2">
					<h2 className="font-semibold">Overview</h2>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						Multi-agent architecture with Research, Evaluation, Legal, and Meta agents coordinated via LangGraph. Backend in FastAPI; monitoring via Langfuse; React dashboard for status and metrics.
					</p>
				</div>
				<div className="card space-y-2">
					<h2 className="font-semibold">Links</h2>
					<ul className="list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
						<li><a className="nav-link" href="https://github.com/Alicelibinguo5/doj-legal-researcher-agent" target="_blank" rel="noreferrer">GitHub Repository</a></li>
					</ul>
				</div>
			</div>
		</section>
	)
}


