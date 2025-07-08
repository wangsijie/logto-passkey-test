import { requestWebauthnAuthentication } from '@/app/account-api';

export async function POST(request: Request) {
  const { verificationRecordId } = await request.json();

  try {
    const data = await requestWebauthnAuthentication(verificationRecordId);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}