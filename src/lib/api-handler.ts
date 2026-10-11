import { NextResponse } from 'next/server';
import { ApiError } from './errors/api-error';

export async function apiHandler<T>(callback: () => Promise<T>, statusCode: number = 200) {
	try {
		const result = await callback();
		return NextResponse.json(
			{
				success: true,
				data: result,
			},
			{
				status: statusCode,
			},
		);
	} catch (error) {
		if (error instanceof ApiError) {
			return NextResponse.json(
				{
					success: false,
					error: error.message,
				},
				{ status: error.statusCode },
			);
		} else {
			console.error('Unexpected error:', error);
			return NextResponse.json(
				{
					success: false,
					error: 'Internal Server Error',
				},
				{ status: 500 },
			);
		}
	}
}
