import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";
import ObjectId from '@/utils/objectId';

export async function POST(request) {
  const dbClient = await clientPromise;
  const db = dbClient.db("coexist_data");
  const chats = db.collection("chats");

  const body = await request.json();

  let result;
  try {
    // TODO: Error handling-  sender, recipient must be emails, message - string, valid chat_id

    // Validate the message body
    const { sender, recipient, message, timestamp, send_time, chat_id } = body;

    if (!sender || !recipient || !message || !timestamp || !send_time || !chat_id) {
        return new NextResponse(JSON.stringify("invalid request sent"), { status: 400 });
    }

    const message_obj = {
      _id: new ObjectId(),
      sender: sender,
      recipient: recipient,
      message: message,
      timestamp: timestamp,
      send_time: send_time,
    };

    // Validate sender and recipient as emails
    const emailRegex =    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRegex.test(sender) || !emailRegex.test(recipient)) {
        return new NextResponse(JSON.stringify("invalid email sent"), { status: 400 });
    }

    // TODO: result should be used for error checking
    result = await chats.updateOne({_id: new ObjectId(chat_id)}, {$push: {queued_messages: message_obj}})

    return new NextResponse(undefined, { status: 201 });
  } catch (e) {
    return new NextResponse(undefined, { status: 409 });
  }
}
