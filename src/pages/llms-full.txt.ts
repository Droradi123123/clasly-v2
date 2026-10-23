import type { APIRoute } from 'astro';
import { llmsFull } from '@/lib/llms';
export const GET: APIRoute = async () => new Response(await llmsFull(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
