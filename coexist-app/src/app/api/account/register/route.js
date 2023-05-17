import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
 
export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const users = db.collection("users")

    const body = await request.json()
    const user = {
        firstName: body.first,
        lastName: body.last,
        email: body.email,
        password: body.password,
        phone: body.phone
    }

    let result;
    try{
        result = await users.insertOne(user)
    } catch(e){
        result = false
    }

    if(result !== false){
        const data = {
            email: user.email,
            password: user.password
        }

        NextResponse.json({message:data}, {status: 201})
    }
    else{
        NextResponse.json({}, {status: 409})
    }
}
