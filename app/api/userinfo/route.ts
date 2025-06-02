import { fetchAccountInfo } from '@/app/account-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await fetchAccountInfo());
}
