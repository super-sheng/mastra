import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * 安全检查工具 - 检查代码中的安全漏洞
 */
export const securityCheckTool = createTool({
  id: "security-check",
  description: "分析代码中的安全漏洞和最佳实践违规",
  inputSchema: z.object({
    code: z.string().describe("要进行安全检查的代码"),
    language: z.string().describe("代码语言，例如: typescript, javascript, python 等"),
    context: z.string().optional().describe("代码的上下文或用途说明（可选）"),
  }),
  outputSchema: z.object({
    vulnerabilities: z.array(z.object({
      type: z.string().describe("漏洞类型"),
      description: z.string().describe("漏洞描述"),
      severity: z.enum(["critical", "high", "medium", "low"]).describe("严重程度"),
      line: z.number().optional().describe("问题所在行号（如果适用）"),
      recommendation: z.string().describe("修复建议"),
    })),
    overallRisk: z.enum(["critical", "high", "medium", "low", "minimal"]).describe("总体风险评估"),
    secureCodeExamples: z.record(z.string()).optional().describe("安全代码示例（可选）"),
  }),
  // @ts-ignore
  execute: async ({ context }) => {
    const { code, language, context: codeContext } = context;

    // 实际实现中，这里可以集成安全扫描工具
    // 例如 Snyk、SonarQube 等
    // 以下是简化的模拟实现

    const vulnerabilities = [];
    const lines = code.split('\n');

    // 检测常见安全问题（简化示例）
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (language === "typescript" || language === "javascript") {
        // 检测可能的 XSS 漏洞
        if (line.includes("innerHTML") || line.includes("document.write")) {
          vulnerabilities.push({
            type: "XSS",
            description: "检测到可能的跨站脚本 (XSS) 漏洞",
            severity: "high",
            line: i + 1,
            recommendation: "使用 textContent 或 innerText 代替 innerHTML，或使用 DOMPurify 库净化 HTML",
          });
        }

        // 检测可能的注入漏洞
        if (line.includes("eval(") || line.includes("new Function(")) {
          vulnerabilities.push({
            type: "代码注入",
            description: "使用 eval 或 Function 构造函数可能导致代码注入攻击",
            severity: "critical",
            line: i + 1,
            recommendation: "避免使用 eval 或 Function 构造函数，寻找更安全的替代方案",
          });
        }

        // 检测硬编码密钥
        if (line.match(/key|api[_-]?key|secret|password|token/i) &&
          line.match(/['"][a-zA-Z0-9]{16,}['"]/) &&
          !line.includes("process.env")) {
          vulnerabilities.push({
            type: "硬编码密钥",
            description: "检测到可能的硬编码 API 密钥或密码",
            severity: "high",
            line: i + 1,
            recommendation: "使用环境变量或安全的密钥管理服务存储敏感信息",
          });
        }

        // 检测不安全的密码学
        if (line.includes("Math.random()") &&
          (line.toLowerCase().includes("password") ||
            line.toLowerCase().includes("token") ||
            line.toLowerCase().includes("secret"))) {
          vulnerabilities.push({
            type: "不安全的随机性",
            description: "使用 Math.random() 生成安全凭据，这不是密码学安全的",
            severity: "high",
            line: i + 1,
            recommendation: "使用 crypto.getRandomValues() 或其他密码学安全的随机数生成器",
          });
        }
      }
    }

    // 确定总体风险
    let overallRisk = "minimal";
    if (vulnerabilities.some(v => v.severity === "critical")) {
      overallRisk = "critical";
    } else if (vulnerabilities.some(v => v.severity === "high")) {
      overallRisk = "high";
    } else if (vulnerabilities.some(v => v.severity === "medium")) {
      overallRisk = "medium";
    } else if (vulnerabilities.some(v => v.severity === "low")) {
      overallRisk = "low";
    }

    // 安全代码示例
    const secureCodeExamples = {};

    if (vulnerabilities.some(v => v.type === "XSS")) {
      // @ts-ignore
      secureCodeExamples["XSS 防护"] = `
// 不安全代码
element.innerHTML = userProvidedContent;

// 安全替代方案
// 方案 1: 使用 textContent (不解析 HTML)
element.textContent = userProvidedContent;

// 方案 2: 使用 DOMPurify 库净化 HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userProvidedContent);
`;
    }

    if (vulnerabilities.some(v => v.type === "硬编码密钥")) {
      // @ts-ignore
      secureCodeExamples["安全的密钥管理"] = `
// 不安全代码
const apiKey = "ab12cd34ef56gh78ij90kl";

// 安全替代方案
// 使用环境变量
const apiKey = process.env.API_KEY;
`;
    }

    return {
      vulnerabilities,
      overallRisk,
      secureCodeExamples,
    };
  }
});