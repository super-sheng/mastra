import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * 代码分析工具 - 分析代码结构、复杂度和质量
 */
export const analyzeCodeTool = createTool({
  id: "analyze-code",
  description: "分析代码结构、复杂度和质量，找出潜在问题和改进空间",
  inputSchema: z.object({
    code: z.string().describe("要分析的代码"),
    language: z.string().describe("代码语言，例如: typescript, javascript, python 等"),
    context: z.string().optional().describe("代码的上下文或用途说明（可选）"),
  }),
  outputSchema: z.object({
    issues: z.array(z.object({
      type: z.string().describe("问题类型，如：错误、警告、建议等"),
      message: z.string().describe("问题描述"),
      line: z.number().optional().describe("问题所在行号（如果适用）"),
      severity: z.enum(["critical", "high", "medium", "low"]).describe("问题严重程度"),
    })),
    complexityScore: z.number().describe("代码复杂度评分（1-10，越低越好）"),
    readabilityScore: z.number().describe("代码可读性评分（1-10，越高越好）"),
    summary: z.string().describe("总体分析摘要"),
    suggestions: z.array(z.string()).describe("改进建议列表"),
  }),
  // @ts-ignore
  execute: async ({ context }) => {
    const { code, language, context: codeContext } = context;

    // 实际实现中，这里可以集成静态代码分析工具
    // 例如 ESLint、TypeScript 编译器 API 等
    // 以下是简化的模拟实现

    // 基本问题检测（这里是简化示例）
    const issues = [];

    // 检测未使用的变量（简化示例）
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 检测可能的问题
      if (language === "typescript" || language === "javascript") {
        if (line.includes("var ")) {
          issues.push({
            type: "suggestion",
            message: "考虑使用 let 或 const 代替 var",
            line: i + 1,
            severity: "medium",
          });
        }

        if (line.includes("console.log")) {
          issues.push({
            type: "warning",
            message: "在生产代码中应移除调试用的 console.log 语句",
            line: i + 1,
            severity: "low",
          });
        }

        if (line.includes("any") && language === "typescript") {
          issues.push({
            type: "suggestion",
            message: "避免使用 any 类型，尽量使用更具体的类型",
            line: i + 1,
            severity: "medium",
          });
        }
      }
    }

    // 计算复杂度（简化示例）
    const complexityScore = Math.min(
      10,
      Math.max(
        1,
        Math.round(
          (code.length / 500) +
          (code.split('if').length - 1) * 0.5 +
          (code.split('for').length - 1) * 0.7
        )
      )
    );

    // 计算可读性（简化示例）
    const readabilityScore = Math.min(
      10,
      Math.max(
        1,
        10 - complexityScore * 0.5 +
        (code.includes("// ") ? 1 : 0) +
        (code.includes("/**") ? 2 : 0)
      )
    );

    // 生成建议
    const suggestions = [];

    if (complexityScore > 5) {
      suggestions.push("考虑将复杂函数拆分为更小的函数以提高可读性和可维护性");
    }

    if (readabilityScore < 5) {
      suggestions.push("添加更多注释和文档来解释代码的目的和工作方式");
    }

    if (issues.filter(i => i.severity === "critical" || i.severity === "high").length > 0) {
      suggestions.push("优先修复高优先级问题");
    }

    // 返回分析结果
    return {
      issues,
      complexityScore,
      readabilityScore,
      summary: `代码分析完成，发现 ${issues.length} 个问题。复杂度评分: ${complexityScore}/10，可读性评分: ${readabilityScore}/10。`,
      suggestions,
    };
  }
});