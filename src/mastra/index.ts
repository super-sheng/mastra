
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { codeReviewAgent } from "./agents/codeReviewAgent";
export const mastra = new Mastra({
  // deployer: new CloudflareDeployer({
  //   scope: "aec27f29b93fcac6ffc53d6b1fa4eac8",
  //   projectName: "my-mastra-app",
  //   // routes: [
  //   //   {
  //   //     pattern: "example.com/*",
  //   //     zone_name: "example.com",
  //   //     custom_domain: true,
  //   //   },
  //   // ],
  //   // workerNamespace: "code-review",
  //   auth: {
  //     // Gj7AKLlsPhKesm3REc6yZMhqy7pqfoHVSInARH9_
  //     // apiToken: "_TLnESenmmLUsKqwJewgRzL07ZVwMy6AvZVSMi5V",
  //     apiToken: "bQzyG9oXaKePQAxuBhNQFK30bnM8LMRJysgx33Wp",
  //     apiEmail: "max.capricorn1209@gmail.com",
  //   },
  // }),
  agents: {
    codeReviewAgent,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  // storage: new CloudflareStore({
  //   apiToken: "00a2py1BPBUCO2nFzkmxCS2wRmTzKtjo31Jv8qVw",
  //   accountId: 'aec27f29b93fcac6ffc53d6b1fa4eac8',
  //   namespacePrefix: 'cr'
  //   // bindings: {
  //   //   cr: 'cr', // KVNamespace binding for threads table
  //   //   // Add other tables as needed
  //   // },
  //   // keyPrefix: "cr", // Optional: isolate keys per environment
  // }),
});
