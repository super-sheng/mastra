import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * 测试建议工具 - 为代码生成测试建议
 */
export const suggestTestsTool = createTool({
  id: "suggest-tests",
  description: "分析代码并提供测试策略和测试用例建议",
  inputSchema: z.object({
    code: z.string().describe("要为其建议测试的代码"),
    language: z.string().describe("代码语言，例如: typescript, javascript, python 等"),
    testFramework: z.string().optional().default("jest").describe("首选的测试框架，默认为 Jest"),
  }),
  outputSchema: z.object({
    testStrategy: z.string().describe("推荐的整体测试策略"),
    testCases: z.array(z.object({
      description: z.string().describe("测试用例描述"),
      scenario: z.string().describe("测试场景"),
      expectedOutcome: z.string().describe("预期结果"),
      testCode: z.string().optional().describe("测试代码示例（如果适用）"),
    })),
    coverage: z.object({
      functions: z.array(z.string()).describe("应该测试的关键函数列表"),
      edgeCases: z.array(z.string()).describe("应考虑的边缘情况"),
    }),
  }),
  execute: async ({ context }) => {
    const { code, language, testFramework } = context;

    // 实际实现中，这里可以进行代码分析，提取函数、类等
    // 以下是简化的模拟实现

    // 简单分析代码提取函数（示例）
    const functionMatches = code.match(/function\s+(\w+)/g) || [];
    const arrowFunctionMatches = code.match(/const\s+(\w+)\s*=\s*(\([^)]*\)|[^=]*)\s*=>/g) || [];
    const classMatches = code.match(/class\s+(\w+)/g) || [];

    const functions = [
      ...functionMatches.map(f => f.replace('function ', '')),
      // @ts-ignore
      ...arrowFunctionMatches.map(f => f.match(/const\s+(\w+)/)[1]),
    ];

    const classes = classMatches.map(c => c.replace('class ', ''));

    // 生成测试策略
    let testStrategy = `建议使用 ${testFramework} 创建单元测试`;
    if (classes.length > 0) {
      testStrategy += `，为每个类编写单独的测试套件`;
    }
    if (functions.length > 2) {
      testStrategy += `，并为关键函数编写单独的测试用例`;
    }
    testStrategy += `。优先测试公共 API 和复杂逻辑。`;

    // 生成测试用例（示例）
    const testCases = [];

    if (functions.length > 0) {
      functions.slice(0, 3).forEach(func => {
        testCases.push({
          description: `测试 ${func} 功能`,
          scenario: `调用 ${func} 使用有效输入`,
          expectedOutcome: `函数返回预期结果且没有抛出错误`,
          testCode: generateTestExample(func, testFramework, language),
        });

        testCases.push({
          description: `测试 ${func} 错误处理`,
          scenario: `调用 ${func} 使用无效输入`,
          expectedOutcome: `函数适当处理错误情况`,
        });
      });
    }

    if (classes.length > 0) {
      classes.forEach(cls => {
        testCases.push({
          description: `测试 ${cls} 类的实例化`,
          scenario: `使用有效参数创建 ${cls} 实例`,
          expectedOutcome: `实例正确创建且具有预期属性`,
        });
      });
    }

    // 额外添加一些通用测试用例
    testCases.push({
      description: "测试边缘情况",
      scenario: "传入边缘值或特殊情况",
      expectedOutcome: "代码正确处理边缘情况",
    });

    // 确定覆盖范围
    const coverage = {
      functions: functions.slice(0, 5), // 只显示前5个函数
      edgeCases: [
        "空输入值",
        "极大/极小值",
        "无效格式的输入",
        "边界条件"
      ]
    };

    return {
      testStrategy,
      testCases,
      coverage,
    };
  }
});
// @ts-ignore
function generateTestExample (functionName, framework, language) {
  if (framework === "jest" && (language === "typescript" || language === "javascript")) {
    return `
      describe('${functionName}', () => {
        test('should work with valid input', () => {
          // 准备测试数据
          const input = 'valid input';
          
          // 执行被测函数
          const result = ${functionName}(input);
          
          // 验证结果
          expect(result).toBeDefined();
          // 添加更多具体的断言...
        });
        
        test('should handle invalid input', () => {
          // 准备无效测试数据
          const invalidInput = null;
          
          // 验证函数行为
          expect(() => ${functionName}(invalidInput)).toThrow();
          // 或者验证其他错误处理行为...
        });
      });`;
  }
}