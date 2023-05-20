import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
 
export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const users = db.collection("users")

    const body = await request.json()
    const user = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        phone: body.phone
    }

    let result;
    try{
        result = await users.deleteOne(user)
    } catch(e){
        result = false
    }

    if(result !== false && result.deletedCount > 0){
        return new NextResponse(undefined, {status: 204})
    }
    else{
        return new NextResponse(undefined, {status: 409})
    }
}
