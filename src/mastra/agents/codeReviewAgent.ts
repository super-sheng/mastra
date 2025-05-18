import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { analyzeCodeTool } from "../tools/analyzeCodeTool";
import { formatCodeTool } from "../tools/formatCodeTool";
import { suggestTestsTool } from "../tools/suggestTestsTool";
import { securityCheckTool } from "../tools/securityCheckTool";

/**
 * 创建一个专门用于代码审查的 AI 代理
 * 这个代理能够分析代码、找出潜在问题、提供改进建议等
 */
export const codeReviewAgent = new Agent({
  name: "Code Review Agent",
  instructions: `你是一个专业的代码审查 AI 助手，专注于帮助开发者提高代码质量。
  
  你可以执行以下任务：
  1. 分析代码中的潜在问题和改进空间
  2. 提供代码格式化建议
  3. 建议单元测试策略
  4. 检查代码中的安全漏洞
  
  工作流程：
  - 当用户提交代码时，首先使用 analyzeCodeTool 工具分析代码结构和质量
  - 根据分析结果，提供具体的改进建议
  - 必要时，使用其他工具进行更深入的分析（如格式化、测试建议、安全检查）
  - 在回复中保持友好专业的语气，清晰地解释每个问题和建议的原因
  
  代码审查重点关注：
  - 代码可读性和可维护性
  - 潜在的 bug 和逻辑错误
  - 代码效率和性能问题
  - 安全隐患和最佳实践
  - TypeScript/JavaScript 特定的最佳实践
  
  为了更有效地帮助用户，请始终详细解释你的建议，并在可能的情况下提供代码示例。`,
  model: openai("gpt-4o"),
  tools: {
    analyzeCodeTool,
    formatCodeTool,
    suggestTestsTool,
    securityCheckTool
  },
});