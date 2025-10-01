import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import RootLayout from './routes/RootLayout'
import Home from './routes/Home'
import Projects from './routes/Projects'
import About from './routes/About'
import Contact from './routes/Contact'
import ProjectDojLegalResearcherAgent from './routes/ProjectDojLegalResearcherAgent'
import Blog from './routes/Blog'
import BlogPost from './routes/BlogPost'
import NewBlogPost from './routes/NewBlogPost'
import EditBlogPost from './routes/EditBlogPost'

// Use a hash router to avoid GitHub Pages history API issues
const router = createHashRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'projects', element: <Projects /> },
			{ path: 'projects/doj-legal-researcher-agent', element: <ProjectDojLegalResearcherAgent /> },
			{ path: 'blog', element: <Blog /> },
			{ path: 'blog/new', element: <NewBlogPost /> },
			{ path: 'blog/:slug/edit', element: <EditBlogPost /> },
			{ path: 'blog/:slug', element: <BlogPost /> },
			{ path: 'about', element: <About /> },
			{ path: 'contact', element: <Contact /> },
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)


