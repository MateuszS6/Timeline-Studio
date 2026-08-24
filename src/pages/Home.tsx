import { useEffect, useState } from 'react'
import type { Project } from '../types/project';
import { getProjects } from '../services/projects'

function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      const data = await getProjects();
      setProjects(data);
    }

    loadProjects();
  }, [])

  return (
    <div>
      <h1>Marvel Timelines</h1>

      {projects.map(project => (
        <p key={project.id}>
          {project.title} | {project.release_date.getFullYear()}
        </p>
      ))}
    </div>

  )
}

export default Home;