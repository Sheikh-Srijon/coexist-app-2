import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
import ObjectId from '@/utils/objectId'

export async function POST(request) {
  const dbClient = await clientPromise
  const db = dbClient.db("coexist_data")
  const chats = db.collection("chats")

  const body = await request.json()

  try {
    // Delete the chat based on the email
    const deletionResult = await chats.deleteOne({ _id:  new ObjectId(body.chat_id)})

    if (deletionResult.deletedCount > 0) {
      return new NextResponse(
        JSON.stringify({ message: "success" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    } else {
      return new NextResponse("Chat not found", { status: 404 }) 
    }
  } catch (e) {
    console.log(`ERROR DELETING CHAT\n${e}`)
    return new NextResponse("Internal server error", { status: 500 }) 
  }
}
