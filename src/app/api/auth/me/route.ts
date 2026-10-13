import { verifyToken } from '@/lib/utils/verifyToken';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const user = await verifyToken();

		return NextResponse.json({
			authenticated: true,
			role: user.role,
		});
	} catch {
		return NextResponse.json({
			authenticated: false,
			role: null,
		});
	}
}
