import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
 
export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const users = db.collection("users")

    const body = await request.json()
    const user = {
        email: body.email,
        password: body.password
    }

    let result;
    
    try{
        result = await users.findOne(user, {projection: {firstName: 1, lastName: 1, email: 1, password:1, phone: 1}})
    } catch(e){
        console.log(`ERROR CHECKING USER\n${e}`)
        result = false
    }

    if(result !== false && result !== null){
        return new NextResponse(
            JSON.stringify(result), {
                status: 200,
                headers: {
                    "content-type": "application/json"
                }
            }
        )
    }
    else{
        return new NextResponse("Incorrect credentials", {status: 404})
    }
}
