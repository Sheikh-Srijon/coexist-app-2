import clientPromise from "@/utils/mongodb";
import ObjectId from "@/utils/objectId"; // Add this import statement
import { NextResponse } from "next/server";

export async function POST(request) {
  const dbClient = await clientPromise;
  const db = dbClient.db("coexist_data");
  const message_collection = db.collection("messages");
  const chats = db.collection("chats");
  const users = db.collection("users");
  const body = await request.json();

  // get messages
  try {
    //Todo: retrieve all messages
    const messages = await message_collection
      .find({ chat_id: { $exists: true } })
      .toArray();
    // //Todo: send all messages to their respective chats
    // messages.forEach(async (message) => {
    //   //assign to respective chat

    // });
    for (let message of messages) {
      const chat = await chats.findOne({ _id: new ObjectId(message.chat_id) });

      if (chat) {
        // Add message to the corresponding chat document
        chat.messages.push(message);
        await chats.updateOne(
          { _id: new ObjectId(message.chat_id) },
          { $set: { messages: chat.messages } }
        );

        // updatedMessages.push(message);
      }
      console.log('foundchat')
    }
    return new NextResponse(JSON.stringify(messages), {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
    // Todo: configure the appropriate cron job
  } catch (e) {
    console.log(e);
  }
}
