import { graphql } from "@/src/graphql";

const createNewProject = graphql(`
mutation createProject {
  projectCreate(input:{name: "test-project"}){
    id
  }
}
`)

const createServiceMutation = graphql(`
  mutation serviceCreate {
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
  }
`);
