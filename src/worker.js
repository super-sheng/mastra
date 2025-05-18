import { mastra } from './mastra/mastra';
import { createMastraApiHandler } from '@mastra/deploy';

// 创建 API 处理程序
export default {
  async fetch(request, env, ctx) {
    // 通过环境变量接收 API 密钥
    process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;

    // 创建 Mastra API 处理程序
    const handler = createMastraApiHandler({ mastra });
    
    try {
      // 处理请求
      return await handler(request);
    } catch (error) {
      // 错误处理
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};