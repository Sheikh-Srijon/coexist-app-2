

import clientPromise from '@/utils/mongodb'
import { NextResponse } from 'next/server'
import ObjectId from '@/utils/objectId'; // Add this import statement

export async function POST(request) {
  const dbClient = await clientPromise
  const db = dbClient.db("coexist_data")
  const chats = db.collection("chats")

  const body = await request.json()

  try {
    // Delete the chat based on the email
    const deletionResult = await chats.deleteOne({ _id:  new ObjectId(body.chat_id)})
    console.log("deletion result test", deletionResult);

    if (deletionResult.deletedCount > 0) {
      return new NextResponse(
        JSON.stringify({ message: "success" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    } else {
      return new NextResponse(undefined, { status: 404 }) // Chat not found
    }
  } catch (e) {
    console.log(e)
    return new NextResponse(undefined, { status: 500 }) // Internal server error
  }
}
