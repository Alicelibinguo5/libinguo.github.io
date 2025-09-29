export type BlogPost = {
	slug: string
	title: string
	created_at: string
	summary: string
	content: string
}

export const blogPosts: BlogPost[] = [
	{
		slug: 'shipping-a-doj-multi-agent-researcher',
		title: 'Shipping a DOJ Multi-Agent Researcher',
		created_at: '2025-09-01',
		summary: 'Design notes from building a LangGraph + FastAPI multi-agent that analyzes DOJ press releases.',
		content: `
In this post I walk through coordination strategies (sequential, parallel, adaptive), tracing with Langfuse, and deployment notes for the DOJ legal researcher agent.
`
	},
	{
		slug: 'real-time-ads-metrics-pipeline',
		title: 'A Minimal Real‑Time Ads Metrics Pipeline',
		created_at: '2025-08-20',
		summary: 'Kafka → Flink → Iceberg → Superset: choices, pitfalls, and a pragmatic baseline.',
		content: `
Why I prefer a single-topic start, how to size checkpoints, and a thin semantic layer for Superset.
`
	}
]


