import { NextResponse } from 'next/server'
 
export async function POST(request) {
    return new NextResponse(undefined, {status: 204})
}
