import { graphql } from "@/src/graphql";

const getProjectByIdQuery = graphql(`
  query GetProjectById {
    project(id: "ccf86e90-e7be-4a98-95d4-f4f33390fda7") {
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
`);

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
`);


