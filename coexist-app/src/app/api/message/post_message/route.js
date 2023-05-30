import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
 
export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const msgs = db.collection("messages")

    const body = await request.json()

    // create message body for the matching DB schema
    const message = {
        sender: body.sender,
        recipient: body.recipient,
        message: body.message,
        timestamp: body.timestamp,
        send_time: body.send_time
    }

    // insert a new message into the database
    let result;
    try{
        result = await msgs.insertOne(message)
    } catch(e){
        result = false
    }

    if(result !== false){
        return new NextResponse(
            JSON.stringify(message), {
                status: 201,
                headers: {
                    "content-type": "application/json"
                }
            }
        )
    }
    else{
        return new NextResponse(undefined, {status: 409})
    }
}
