import { fetchAccountInfo, updateUserAddress } from '@/app/account-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await fetchAccountInfo());
}

export async function POST(request: Request) {
  const { address } = await request.json();

  return Response.json(await updateUserAddress(address));
}
