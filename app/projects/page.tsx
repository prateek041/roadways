'use client';

import { useEffect, useState } from 'react';
import { getAllProjects } from '../actions/actions';
import { Project } from '@/src/graphql/graphql';

export default function HomePage() {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjectData = async () => {
      const result = await getAllProjects();

      if (result.success) {
        setProject(result.data);
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

  // Render the data on success
  return (
    <div>
      <h1>Project Details</h1>
      {project ? (
        <div>
          <h2>{project.name}</h2>
          <p>Project ID: {project.id}</p>

          <h3>Services:</h3>
          <ul>
            {project.services.edges.map(edge => (
              <li key={edge.node.id}>
                {edge.node.name}
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
