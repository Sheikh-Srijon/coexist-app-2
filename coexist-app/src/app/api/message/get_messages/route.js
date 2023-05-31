import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'

export async function POST(request) {
    const dbClient = await clientPromise
    const db = dbClient.db("coexist_data")
    const msgs = db.collection("messages")

    const body = await request.json()

    // get messages
    let result;
    try{
        // queries the database and returns an array of documents, two way fetching enabled now
        result = await msgs.find({$or:[
            {sender: body.sender, recipient: body.recipient,},
            {sender: body.recipient, recipient: body.sender,}
        ]})

    } catch(e){
        console.log(e)
        result = false
    }

    // do some parsing of the result to get proper fields
    if(result !== false){
        const retrieved = [];

        // retrieves data as a list
        for await (const doc of result) {
            retrieved.push(doc);
        }

        console.log(retrieved)

        // return the list of documents
        return new NextResponse(
            JSON.stringify(retrieved), {
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
