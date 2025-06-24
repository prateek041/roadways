"use server";

import { Project } from "@/src/graphql/graphql";

export type Response<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function deleteProject(id: string) {
  if (!process.env.RAILWAY_API_TOKEN) {
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
        Authorization: `Bearer ${process.env.RAILWAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          mutation deleteProject {
            projectDelete(id:"${id}")
          }
        `,
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
  if (!process.env.RAILWAY_API_TOKEN) {
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
        Authorization: `Bearer ${process.env.RAILWAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query me {
  me{
    id
    workspaces {
      id
      team{
        projects{
          edges{
            node{
              id
              name
              services {
                edges {
                  node{
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
        `,
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
    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${railwayToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation delete {
            serviceDelete(environmentId:"${environmentId}", id:"${serviceId}")
          }
        `,
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

const railwayToken = process.env.RAILWAY_API_TOKEN;

export async function createDeployment(
  projectId: string,
  serviceId: string,
  environmentId: string
) {
  const templateId = "89d35db4-3f3d-4317-aa47-ad53ccbbf587";
  console.log(
    `Creating deployment for service ${serviceId} in project ${projectId} and environment ${environmentId}.`
  );
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
        query: `mutation createDeploymentTrigger {
      deploymentTriggerCreate(
        input: {
          branch: "main"
          environmentId: "${environmentId}"
          provider: "railway"
          repository: "alphasecio/nodejs"
          serviceId: "${serviceId}"
          projectId: "${projectId}"
        }
      ) {
        id
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

    const deployment = result.data.deploymentTriggerCreate;

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
          query getProject {
        project(id:"${id}") {
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

async function getProjectDefaultEnvironmentId(
  projectId: string,
  token: string
): Promise<string | undefined> {
  const response = await fetch("https://backboard.railway.app/graphql/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query getProjectEnvironments($projectId: String!) {
          project(id: $projectId) {
            environments {
              edges {
                node {
                  id
                  name
                }
              }
            }
          }
        }
      `,
      variables: {
        projectId: projectId,
      },
    }),
    cache: "no-store",
  });

  const result = await response.json();

  console.log("result", result);

  if (result.errors) {
    console.error("GraphQL Errors (Get Project Environments):", result.errors);
    return undefined;
  }

  const defaultEnv = result.data.project.environments.edges.find(
    (edge: any) => edge.node.isDefault
  )?.node.id;

  if (!defaultEnv) {
    console.warn(
      `No default environment found for project ${projectId}. You might need to specify one manually.`
    );
  }
  return defaultEnv;
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
    const templateResponse = await fetch(
      "https://backboard.railway.app/graphql/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${railwayToken}`,
        },
        body: JSON.stringify({
          query: `
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
          `,
          variables: {
            code: templateCode,
          },
        }),
        cache: "no-store",
      }
    );

    let templateResult = await templateResponse.json();

    console.log(
      "Template Result Data:",
      JSON.stringify(templateResult.data, null, 2)
    );

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

    console.log(
      "Fetched Serialized Config:",
      JSON.stringify(fetchedSerializedConfig, null, 2)
    );

    console.log("Template ID for Mutation:", templateIdForMutation);

    console.log(
      "Fetched Serialized Config:",
      JSON.stringify(fetchedSerializedConfig, null, 2)
    );

    console.log("Project ID:", projectId);
    console.log("Template ID for Mutation:", templateIdForMutation);

    const serviceCreateResponse = await fetch(
      "https://backboard.railway.app/graphql/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${railwayToken}`,
        },
        body: JSON.stringify({
          query: `
            mutation serviceCreate {
  serviceCreate(input:{projectId: "fd05c667-db43-466f-a3be-17777e5b6e8e"
    source: { repo: "railwayapp-templates/nodejs" }}){
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
          `,
          variables: {
            projectId: projectId,
          },
        }),
        cache: "no-store",
      }
    );

    let serviceCreateResult = await serviceCreateResponse.json();
    console.log(
      "Service Create Result Data:",
      JSON.stringify(serviceCreateResult.data, null, 2)
    );

    const deployResponse = await fetch(
      "https://backboard.railway.app/graphql/v2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${railwayToken}`,
        },
        body: JSON.stringify({
          query: `
            mutation templateDeployV2($input: TemplateDeployV2Input!)
            {
              templateDeployV2(input: $input)
                {projectId
                workflowId
            }}
          `,
          variables: {
            input: {
              projectId: projectId,
              environmentId: environmentId,
              serializedConfig: fetchedSerializedConfig,
              templateId: templateIdForMutation,
            },
          },
        }),
        cache: "no-store",
      }
    );

    let deployResult = await deployResponse.json();
    console.log("Final Deploy Result:", JSON.stringify(deployResult, null, 2));

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
