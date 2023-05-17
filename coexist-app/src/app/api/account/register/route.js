import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
 
export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const users = db.collection("users")

    const user = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: request.body.password,
        phone: request.body.phone
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

        return NextResponse.status(201).json(data)
    }
    else{
        return NextResponse.status(409)
    }
}
