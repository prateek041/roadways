'use server'

import { graphql } from "@/src/graphql"

const getProjectById = graphql(`
  query GetProjectById {
      project(id: ""){
        name
      }
    }
`)

const getAllProjectsQuery = graphql(`
  query GetAllProjects {
    projects(first: 100) {
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`)

const railwayToken = process.env.RAILWAY_API_TOKEN

export async function getAllProjects() {
  console.log("--- Executing getAllProjects Server Action ---");
  console.log("Using Token:", railwayToken ? `A token is set (length: ${railwayToken.length})` : "TOKEN IS UNDEFINED!");

  if (!railwayToken) {
    return { success: false, error: "Server configuration error: API token missing." };
  }

  try {
    const response = await fetch('https://backboard.railway.app/graphql/v2', {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${railwayToken}`
      },
      body: JSON.stringify({
        query: getAllProjectsQuery,
      }),
      cache: 'no-store',
    });

    const responseText = await response.text();
    console.log("Raw response from Railway API:", responseText);

    const result = JSON.parse(responseText);

    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return { success: false, error: `API Error: ${result.errors[0].message}` };
    }

    const projects = result.data.projects.edges.map((edge: any) => edge.node);

    console.log(`Successfully fetched ${projects.length} projects.`);
    return { success: true, data: projects };

  } catch (error: any) {
    console.error("A critical error occurred in the fetch block:", error.message);
    return { success: false, error: "An unexpected error occurred." };
  }
}
