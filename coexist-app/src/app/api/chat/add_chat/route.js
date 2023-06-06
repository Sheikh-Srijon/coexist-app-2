import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
import ObjectId from '@/utils/objectId'
 
export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const users = db.collection("users")

    const body = await request.json()

    // check that other user exists
    let otherUser
    try{
        otherUser = await users.findOne({email: body.newEmail})
    } catch(e){
        otherUser = false
    }

    if(otherUser !== false && otherUser !== null){
        let newChat
        const chats = db.collection("chats")

        try{
            newChat = await chats.insertOne({
                members: [body.newEmail, body.user.email],
                messages: [],
                queued_messages: []
            })
        } catch(e){
            newChat = false
        }

        if(newChat !== false){
            const res = {
                chat_id: new ObjectId(newChat._id),
                first: otherUser.firstName,
                last: otherUser.lastName,
                email: body.newEmail
            }

            return new NextResponse(
                JSON.stringify([res]), {
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
