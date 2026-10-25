import { CONTACT_EMAIL, BRAND_NAME, DOMAIN } from '@/config/site';
import { getEnv } from './env';
import type { LeadInsert } from './db';

/** Email notification via Resend (RESEND_API_KEY). Swap the provider here if needed. */
export async function notifyNewLead(lead: LeadInsert & { id: string | null }) {
  const { RESEND_API_KEY } = getEnv();
  if (!RESEND_API_KEY || CONTACT_EMAIL.startsWith('{{')) return;
  const lines = [
    `ליד חדש (${lead.source})`,
    `שם: ${lead.name ?? ''}`,
    `ארגון: ${lead.organization ?? ''}`,
    `יצירת קשר: ${lead.contact ?? ''}`,
    `קהל: ${lead.audience_type ?? 'לא ידוע'} | עמוד: ${lead.page ?? ''}`,
    `נושא: ${lead.topic ?? ''}`,
    '',
    lead.message ?? '',
    '',
    lead.id ? `ID: ${lead.id}` : '',
  ];
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        // Sender must be on a domain verified in Resend (realai.co.il), never the recipient's mailbox domain.
        from: `${BRAND_NAME} <leads@${DOMAIN}>`,
        to: [CONTACT_EMAIL],
        subject: `ליד חדש: ${lead.organization ?? lead.name ?? ''}`,
        text: lines.join('\n'),
      }),
    });
  } catch (e) { console.error('notify failed', e); }
}
