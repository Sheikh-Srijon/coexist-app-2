import clientPromise from "@/utils/mongodb";
import ObjectId from "@/utils/objectId";
import { NextResponse } from "next/server";

export async function GET(request) {
  const dbClient = await clientPromise;
  const db = dbClient.db("coexist_data");
  const message_collection = db.collection("messages");
  const chats = db.collection("chats");

  // get messages
  let messages;
  // retrieve all messages
  try {
    messages = await message_collection
      .find({ chat_id: { $exists: true } })
      .toArray();
  } catch (e) {
    console.log(e);
    return new NextResponse(undefined, { status: 500 }); // Internal server error
  }
  // send all messages to their respective chats
  try {
    // Create an array to store the batch operations
    const bulkOperations = [];

    for (let message of messages) {
      const chatId = new ObjectId(message.chat_id);

      // update operation to chats list: update/push to messages and delete/pull from queue!
      bulkOperations.push({
        updateOne: {
          filter: { _id: chatId },
          update: { $push: { messages: message }, $pull: { queued_messages: message } },
        },
      });
    }

    // Perform the batch update operation
    await chats.bulkWrite(bulkOperations);
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
    console.log("error in adding message to chat", e);
    return new NextResponse(undefined, { status: 500 }); // Internal server error
  }
}
