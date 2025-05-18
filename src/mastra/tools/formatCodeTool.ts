import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * 代码格式化工具 - 根据最佳实践格式化代码
 */
export const formatCodeTool = createTool({
  id: "format-code",
  description: "根据语言的最佳实践格式化代码",
  inputSchema: z.object({
    code: z.string().describe("要格式化的代码"),
    language: z.string().describe("代码语言，例如: typescript, javascript, python 等"),
    formatRules: z.object({
      indentSize: z.number().default(2).describe("缩进大小"),
      useTabs: z.boolean().default(false).describe("是否使用制表符而不是空格"),
      singleQuote: z.boolean().default(true).describe("是否使用单引号"),
      trailingComma: z.enum(["none", "es5", "all"]).default("es5").describe("尾随逗号样式"),
      printWidth: z.number().default(80).describe("每行最大字符数"),
    }).optional().describe("格式化规则（可选）"),
  }),
  outputSchema: z.object({
    formattedCode: z.string().describe("格式化后的代码"),
    changes: z.array(z.string()).describe("所做的主要更改列表"),
  }),
  execute: async ({ context }) => {
    const { code, language, formatRules = {} } = context;

    // 实际实现中，这里可以集成 Prettier 或其他格式化工具
    // 以下是简化的模拟实现

    // 简单的格式化实现（这里只是示例）
    let formattedCode = code;
    const changes = [];

    // 处理缩进（简化示例）
    // @ts-ignore
    const indentSize = formatRules.indentSize || 2;
    // @ts-ignore
    const indent = formatRules.useTabs ? '\t' : ' '.repeat(indentSize);

    if (language === "typescript" || language === "javascript") {
      // 简单替换缩进（仅作示例，实际中需更复杂的实现）
      const lines = formattedCode.split('\n');
      formattedCode = lines.map(line => {
        // 计算前导空格数量
        // @ts-ignore
        const leadingSpaces = line.match(/^\s*/)[0].length;
        const indentLevel = Math.floor(leadingSpaces / 2); // 假设原代码使用 2 空格缩进
        return indent.repeat(indentLevel) + line.trim();
      }).join('\n');
      // @ts-ignore
      changes.push(`调整缩进为 ${formatRules.useTabs ? '制表符' : indentSize + ' 空格'}`);

      // 处理引号样式（简化示例）
      // @ts-ignore
      if (formatRules.singleQuote) {
        // 将双引号转换为单引号（这里的实现非常简化）
        const doubleQuotesCount = (formattedCode.match(/"/g) || []).length;
        formattedCode = formattedCode.replace(/"/g, "'");
        if (doubleQuotesCount > 0) {
          changes.push(`将双引号转换为单引号`);
        }
      }

      // 处理行宽（简化示例）
      // @ts-ignore
      const printWidth = formatRules.printWidth || 80;
      const longLines = formattedCode.split('\n').filter(line => line.length > printWidth).length;
      if (longLines > 0) {
        changes.push(`标记了 ${longLines} 行超过 ${printWidth} 个字符的行`);
      }
    }

    return {
      formattedCode,
      changes
    };
  }
});