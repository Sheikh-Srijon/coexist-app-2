import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const chats = db.collection("chats")

    const body = await request.json()

    // get messages
    let result;
    try{
        // queries the database and returns an array of documents
        result = await chats.find({members: body.email})
    } catch(e){
        console.log(e)
        result = false
    }

    // do some parsing of the result to get proper fields
    if(result !== false){
        const chats = [];

        // retrieves data as a list
        for await (const doc of result) {
            const emails = []

            for(const email of doc.members){
                if(email !== body.email){
                    emails.push(email)
                }
            }

            chats.push(emails);
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
