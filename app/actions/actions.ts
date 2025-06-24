"use server";

import { Project } from "@/src/graphql/graphql";

export type Response<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const RAILWAY_API_URL = "https://backboard.railway.app/graphql/v2";
const railwayToken = process.env.RAILWAY_API_TOKEN;

async function fetchGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<any> {
  const response = await fetch(RAILWAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${railwayToken}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse GraphQL response: " + text);
  }
}

export async function deleteProject(id: string) {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }
  try {
    const query = `
      mutation deleteProject($id: String!) {
        projectDelete(id: $id)
      }
    `;
    const result = await fetchGraphQL(query, { id });
    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }
    console.log(`Successfully deleted project ${id}.`);
    return { success: true };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getMe() {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }
  try {
    const query = `
      query me {
        me {
          id
          workspaces {
            id
            team {
              projects {
                edges {
                  node {
                    id
                    name
                    services {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
    const result = await fetchGraphQL(query);
    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }
    return { success: true, data: result.data.me };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteService(
  environmentId: string,
  serviceId: string
): Promise<Response<void>> {
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }
  try {
    const query = `
      mutation deleteService($environmentId: String!, $serviceId: String!) {
        serviceDelete(environmentId: $environmentId, id: $serviceId)
      }
    `;
    const result = await fetchGraphQL(query, { environmentId, serviceId });
    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }
    console.log(`Successfully deleted service ${serviceId}.`);
    return { success: true };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

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
    const query = `
      mutation createProject($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
          id
        }
      }
    `;
    const variables = { input: { name } };
    const result = await fetchGraphQL(query, variables);
    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }
    const project: Project = result.data.projectCreate;
    console.log(`Successfully created project ${project.id}.`);
    return { success: true, data: project };
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
    const query = `
      query getProject($id: String!) {
        project(id: $id) {
          name
          services {
            edges {
              node {
                id
                name
              }
            }
          }
          environments {
            edges {
              node {
                name
                id
              }
            }
          }
        }
      }
    `;
    const result = await fetchGraphQL(query, { id });
    if (result.errors) {
      console.error("GraphQL API Errors:", result.errors);
      return {
        success: false,
        error: `API Error: ${result.errors[0].message}`,
      };
    }
    const project: Project = result.data.project;
    console.log(`Successfully fetched project ${project?.name}.`);
    return { success: true, data: project };
  } catch (error: any) {
    console.error(
      "A critical error occurred in the fetch block:",
      error.message
    );
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function createNewService(
  projectId: string,
  environmentId: string
) {
  const templateCode = "Abo1zu";
  if (!railwayToken) {
    return {
      success: false,
      error: "Server configuration error: API token missing.",
    };
  }
  try {
    // Get template config
    const templateQuery = `
      query getTemplate($code: String!) {
        template(code: $code) {
          id
          name
          description
          image
          category
          serializedConfig
        }
      }
    `;
    const templateResult = await fetchGraphQL(templateQuery, {
      code: templateCode,
    });
    if (templateResult.errors) {
      console.error("GraphQL Errors (Template Query):", templateResult.errors);
      return {
        success: false,
        error:
          templateResult.errors[0]?.message ||
          "Failed to fetch template configuration.",
      };
    }
    const fetchedSerializedConfig =
      templateResult.data.template.serializedConfig;
    const templateIdForMutation = templateResult.data.template.id;
    if (!fetchedSerializedConfig) {
      return {
        success: false,
        error: "Serialized configuration not found for the template.",
      };
    }
    if (!templateIdForMutation) {
      return {
        success: false,
        error: "Template ID not found from the template query. Cannot deploy.",
      };
    }
    // Create service
    const serviceCreateQuery = `
      mutation serviceCreate($input: ServiceCreateInput!) {
        serviceCreate(input: $input) {
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
      }
    `;
    const serviceCreateVariables = {
      input: {
        projectId,
        source: { repo: "railwayapp-templates/nodejs" },
      },
    };
    const serviceCreateResult = await fetchGraphQL(
      serviceCreateQuery,
      serviceCreateVariables
    );
    if (serviceCreateResult.errors) {
      console.error(
        "GraphQL Errors (Service Create):",
        serviceCreateResult.errors
      );
      return {
        success: false,
        error:
          serviceCreateResult.errors[0]?.message || "Failed to create service.",
      };
    }
    // Deploy template
    const deployQuery = `
      mutation templateDeployV2($input: TemplateDeployV2Input!) {
        templateDeployV2(input: $input) {
          projectId
          workflowId
        }
      }
    `;
    const deployVariables = {
      input: {
        projectId,
        environmentId,
        serializedConfig: fetchedSerializedConfig,
        templateId: templateIdForMutation,
      },
    };
    const deployResult = await fetchGraphQL(deployQuery, deployVariables);
    if (deployResult.errors) {
      console.error(
        "GraphQL Errors (Deployment Mutation):",
        deployResult.errors
      );
      return {
        success: false,
        error: deployResult.errors[0]?.message || "Failed to deploy template.",
      };
    }
    return { success: true, data: deployResult.data.templateDeployV2 };
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
    const query = `
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
    `;
    const result = await fetchGraphQL(query);
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
