import clientPromise from "@/utils/mongodb";
import ObjectId from "@/utils/objectId";
import { NextResponse } from "next/server";

export async function GET(request) {
  const dbClient = await clientPromise;
  const db = dbClient.db("coexist_data");
  const chats = db.collection("chats");

  // retrieve all queued messages using chats document
  try {
    chat_docs = await chats
      .find({ queued_messages: { $exists: true, $not: {$size: 0} } }, {queued_messages: 1})
      .toArray();
  } catch (e) {
    console.log(`ERROR GETTING QUEUED MESSAGES\n${e}`)
    return new NextResponse("Internal server error", { status: 500 });
  }
  // send all messages to their respective chats
  try {
    // Create an array to store the batch operations
    const bulkOperations = [];

    for (let doc of chat_docs) {
      const chatId = new ObjectId(doc._id);

      // get the queued messages
      let queued = doc.queued_messages

      // clear the queue and push those messages to the sent messages
      bulkOperations.push({
          updateOne: {
            filter: { _id: chatId },
            update: { $push: { messages: queued}, 
                      $pull: { queued_messages: queued }, 
                      $set: {last_updated: Date.now() } },
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
    console.log(`ERROR PUSHING MESSAGES\n${e}`)
    return new NextResponse("Internal server error", { status: 500 });
  }
}
