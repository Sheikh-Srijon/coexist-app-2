import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const dbClient = await clientPromise;
  const db = dbClient.db("coexist_data");
  const msgs = db.collection("messages");

  const body = await request.json();

  let result;
  try {
    //Todo: Error handling-  sender, recipient must be emails, message - string, valid chat_id

    // Validate the message body
    const { sender, recipient, message, timestamp, send_time, chat_id } = body;

    if (!sender || !recipient || !message || !timestamp || !send_time || !chat_id) {
        return new NextResponse(JSON.stringify("invalid request sent"), { status: 400 });
    }

    const message_obj = {
      sender: sender,
      recipient: recipient,
      message: message,
      timestamp: timestamp,
      send_time: send_time,
      chat_id: chat_id,
    };

    // Validate sender and recipient as emails
    const emailRegex =    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailRegex.test(sender) || !emailRegex.test(recipient)) {
        return new NextResponse(JSON.stringify("invalid email sent"), { status: 400 });
    }

    // TODO: result is never used but should be for error checking
    result = await msgs.insertOne(message_obj);
    return new NextResponse(JSON.stringify(message_obj), {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (e) {
    result = false;
    return new NextResponse(undefined, { status: 409 });
  }
}
