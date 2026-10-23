import type { APIRoute } from 'astro';
import { llmsShort } from '@/lib/llms';
export const GET: APIRoute = async () => new Response(await llmsShort(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
