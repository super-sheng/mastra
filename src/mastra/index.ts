
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { codeReviewAgent } from "./agents/codeReviewAgent";
import { LibSQLStore } from '@mastra/libsql';
import {CloudflareDeployer} from '@mastra/deployer-cloudflare'
export const mastra = new Mastra({
  deployer: new CloudflareDeployer({
    scope: "aec27f29b93fcac6ffc53d6b1fa4eac8",
    projectName: "my-mastra-app",
    // routes: [
    //   {
    //     pattern: "example.com/*",
    //     zone_name: "example.com",
    //     custom_domain: true,
    //   },
    // ],
    workerNamespace: "your-namespace",
    auth: {
      apiToken: "your-api-token",
      apiEmail: "your-email",
    },
  }),
  agents: {
    codeReviewAgent,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
});
// export const mastra = new Mastra({
//   workflows: { weatherWorkflow },
//   agents: { weatherAgent },
  // storage: new LibSQLStore({
  //   // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
  //   url: ":memory:",
  // }),
  
// });
