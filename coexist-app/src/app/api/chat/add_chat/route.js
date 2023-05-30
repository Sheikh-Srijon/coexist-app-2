import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
 
export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const users = db.collection("users")

    const body = await request.json()

    // check that other user exists
    let newChat;
    try{
        newChat = await users.findOne({email: body.newEmail})
    } catch(e){
        newChat = false
    }

    if(newChat !== false && newChat !== null){
        const chats = db.collection("chats")

        try{
            newChat = await chats.insertOne({
                members: [body.newEmail, body.user.email],
                messages: []
            })
        } catch(e){
            newChat = false
        }

        if(newChat !== false){
            return new NextResponse(
                JSON.stringify([body.newEmail]), {
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
    else{
        return new NextResponse(undefined, {status: 409})
    }
}
