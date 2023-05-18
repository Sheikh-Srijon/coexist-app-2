import { NextResponse } from 'next/server'
 
export async function POST(request) {
    return new NextResponse({init: {status: 204}})
}
