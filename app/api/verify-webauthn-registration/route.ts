import { verifyWebauthnRegistration } from '@/app/account-api';

export async function POST(request: Request) {
  const { verificationRecordId, payload } = await request.json();

  try {
    const data = await verifyWebauthnRegistration(
      verificationRecordId,
      payload
    );
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
