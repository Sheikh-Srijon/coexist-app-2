import clientPromise from "@/utils/mongodb";
import ObjectId from "@/utils/objectId"; // Add this import statement
import { NextResponse } from "next/server";

export async function POST(request) {
  const dbClient = await clientPromise;
  const db = dbClient.db("coexist_data");
  const message_collection = db.collection("messages");
  const chats = db.collection("chats");
  const body = await request.json();

  // get messages\
  let messages = null;
  //retrieve all messages
  try {
    messages = await message_collection
      .find({ chat_id: { $exists: true } })
      .toArray();
  } catch (e) {
    console.log(e);
  }
  // send all messages to their respective chats
  try {
    for (let message of messages) {
      const chat = await chats.findOne({ _id: new ObjectId(message.chat_id) });

      if (chat) {
        // Add message to the corresponding chat document
        chat.messages.push(message);
        await chats.updateOne(
          { _id: new ObjectId(message.chat_id) },
          { $set: { messages: chat.messages } }
        );
      }
      console.log("foundchat");
    }
    // chats updated so delete messages
    await message_collection.deleteMany({});
    return new NextResponse(
      JSON.stringify("messages added to respective chats"),
      {
        status: 201,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
}
