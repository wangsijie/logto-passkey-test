import { bindPasskeyToAccount } from '@/app/account-api';

export async function POST(request: Request) {
  const { verificationRecordId, newIdentifierVerificationRecordId } =
    await request.json();

  try {
    const data = await bindPasskeyToAccount(
      verificationRecordId,
      newIdentifierVerificationRecordId
    );
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 400 });
  }
}
