import { getVerificationRecord } from '@/app/account-api';

export async function POST(request: Request) {
  const { password } = await request.json();

  try {
    const { verificationRecordId } = await getVerificationRecord(password);

    // This is for demo purpose, in production,
    // it is not recommended to return the verification record id to the client.
    // Instead, you should save the verification record id in user session.
    return Response.json({ verificationRecordId });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
