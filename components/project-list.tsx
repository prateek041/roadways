'use client'

import { useEffect, useState } from 'react';
import { Project } from '@/src/graphql/graphql';
import { getAllProjects } from '@/app/actions/actions';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      const result = await getAllProjects();

      if (result.success) {
        setProjects(result.data as Project[]);
      } else {
        setError(result.error as string);
      }

      setIsLoading(false);
    };

    loadProjectData();
  }, []);

  // Render a loading state
  if (isLoading) {
    return <div>Loading your Railway project...</div>;
  }

  // Render an error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log('response', projects)

  // Render the data on success
  return (
    <div>
      <h1>Project Details</h1>
      {projects && projects.length > 0 ? (
        <div>
          <h2>{projects[0].name}</h2>
          <p>Project ID: {projects[0].id}</p>

          <h3>Services:</h3>
          <ul>
            {projects.map(edge => (
              <li key={edge.id}>
                {edge.name}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No project data found.</div>
      )}
    </div>
  );
}
