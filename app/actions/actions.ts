"use server";

import { graphql } from "@/src/graphql";
import { Project } from "@/src/graphql/graphql";

export type Response<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function createNewProject(
  name: string
): Promise<Response<Project>> {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }

  try {
    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${railwayToken}`,
      },
      body: JSON.stringify({
        query: `
         mutation createProject {
  projectCreate(input:{name: "${name}"}){
    id
  }
}`,
      }),
      cache: "no-store",
    });

    const responseText = await response.text();

    const result = JSON.parse(responseText);

    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }

    const project: Project = result.data.projectCreate;

    console.log(`Successfully created deployment for service ${project.id}.`);
    return { success: true, data: project };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

const createDeploymentTriggerMutation = graphql(`
  mutation createDeploymentTrigger {
    deploymentTriggerCreate(
      input: {
        branch: "main"
        environmentId: "make-this-random"
        provider: "railway"
        repository: "https://github.com/alphasecio/nodejs"
        serviceId: "24db89b6-d5a9-438a-a214-54a20460a062"
        projectId: "ccf86e90-e7be-4a98-95d4-f4f33390fda7"
      }
    ) {
      id
    }
  }
`);

const railwayToken = process.env.RAILWAY_API_TOKEN;

export async function createDeployment() {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }
  try {
    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${railwayToken}`,
      },
      body: JSON.stringify({
        query: `mutation createDeployment {
          deploymentTrigger(
            input: {
              serviceId: "24db89b6-d5a9-438a-a214-54a20460a062"
              projectId: "ccf86e90-e7be-4a98-95d4-f4f33390fda7"
            }
          ) {
            id
            status
          }
        }`,
      }),
      cache: "no-store",
    });

    const responseText = await response.text();

    const result = JSON.parse(responseText);

    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }

    const deployment = result.data.deploymentCreate;

    console.log(
      `Successfully created deployment for service ${deployment.service.name}.`
    );
    return { success: true, data: deployment };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getProjectById(id: string) {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }

  try {
    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${railwayToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetProjectById {
            project(id: "${id}") {
              name
              services {
                edges {
                  node {
                    name
                    deployments {
                      edges{
                        node {
                          environment {
                            name
                          }
                          environmentId
                        }
                      }
                    }
                  }
                }
              }
            }
          }
`,
      }),
      cache: "no-store",
    });

    const responseText = await response.text();

    const result = JSON.parse(responseText);

    console.log("result", result);
    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }

    const project: Project = result.data.project;
    console.log(`Successfully fetched ${project} projects.`);
    return { success: true, data: project };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function createNewService() {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }

  try {
    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${railwayToken}`,
      },
      body: JSON.stringify({
        query: `mutation serviceCreate {
          serviceCreate(
            input: {
              projectId: "ccf86e90-e7be-4a98-95d4-f4f33390fda7"
              source: { repo: "railwayapp-templates/django" }
            }
          ) {
            id
            name
            deployments {
              edges {
                node {
                  environmentId
                }
              }
            }
          }
        }`,
      }),
      cache: "no-store",
    });

    const responseText = await response.text();

    const result = JSON.parse(responseText);

    console.log("response", result);

    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }

    const projects: Project[] = result.data.projects.edges.map(
      (edge: any) => edge.node
    );

    console.log(`Successfully fetched ${projects.length} projects.`);
    return { success: true, data: projects };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getAllProjects() {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }

  try {
    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${railwayToken}`,
      },
      body: JSON.stringify({
        query: `query GetAllProjects {
        projects(first: 100) {
            edges {
              node {
              id
              name
              description
            }
          }
        }
      }`,
      }),
      cache: "no-store",
    });

    const responseText = await response.text();

    const result = JSON.parse(responseText);

    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }

    const projects: Project[] = result.data.projects.edges.map(
      (edge: any) => edge.node
    );

    console.log(`Successfully fetched ${projects.length} projects.`);
    return { success: true, data: projects };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}
