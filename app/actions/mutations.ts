import { graphql } from "@/src/graphql";

const createTemplateDeployment = graphql(`
  mutation templateDeployV2($input: TemplateDeployV2Input!)
  { templateDeployV2(input: $input)
    {projectId
    workflowId 
  }}"
`);

const createNewDeployment = graphql(`
  mutation createDeploymentTrigger {
    deploymentTriggerCreate(
      input: {
        branch: "main"
        environmentId: "make-this-random"
        provider: "railway"
        repository: "alphasecio/nodejs"
        serviceId: "66962bd2-e59e-47c5-9111-66c45ce3433c"
        projectId: "ccf86e90-e7be-4a98-95d4-f4f33390fda7"
      }
    ) {
      id
    }
  }
`);

const createNewProject = graphql(`
  mutation createProject {
    projectCreate(input: { name: "test-project" }) {
      id
    }
  }
`);

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
