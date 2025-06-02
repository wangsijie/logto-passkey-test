import { fetchMfaVerifications } from '@/app/account-api';

export async function GET() {
  try {
    const data = await fetchMfaVerifications();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
