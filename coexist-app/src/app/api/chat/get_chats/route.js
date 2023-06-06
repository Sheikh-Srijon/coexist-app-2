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
        // queries the database and returns an array of documents
        result = await chats.find({members: body.email}).sort({last_updated: -1})
    } catch(e){
        console.log(e)
        result = false
    }

    // do some parsing of the result to get proper fields
    if(result !== false){
        const users = db.collection("users")
        const chats = [];

        // retrieves data as a list
        for await (const doc of result) {
            const participants = []

            for(const em of doc.members){
                if(em !== body.email){
                    let user

                    try{
                        user = await users.findOne({email: em})
                    } catch(e){
                        return new NextResponse(undefined, {status: 500})
                    }

                    // adding chat_id here is fine for now since there is only one participant but might want to create another object in chats later
                    participants.push({chat_id: new ObjectId(doc._id), email: em, first: user.firstName, last: user.lastName})
                }
            }

            chats.push(participants);
        }

        // return the list of chats
        return new NextResponse(
            JSON.stringify(chats), {
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
