import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
import ObjectId from '@/utils/objectId'

export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const chats = db.collection("chats")

    const body = await request.json()

    // get messages
    let result;
    try{
        // queries the database and returns the matching chat document's sent messages and queued messages
        result = await chats.findOne({_id: new ObjectId(body.chat_id)}, {projection: {messages: 1, queued_messages: 1}})
    } catch(e){
        console.log(e)
        result = false
    }

    if(result !== false){
        let messages = {
            messages: [],
            queued_messages: []
        }

        if (result !== null){
            messages.messages = messages.messages.concat(result.messages || [])
            messages.queued_messages = messages.queued_messages.concat(result.queued_messages || [])
            
            // Note that this can be achieved with a more complex query to reduce read time/amount but I am not sure how to do that
            messages.queued_messages = messages.queued_messages.filter(qmes => qmes.sender === body.sender)
        }

        // return the lists of sent messages and queued messages
        return new NextResponse(
            JSON.stringify(messages), {
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
