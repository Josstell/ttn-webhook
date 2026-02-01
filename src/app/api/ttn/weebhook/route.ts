import prisma from "@/lib/db";
import { pusher } from "@/lib/pusher-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Seguridad (opcional pero recomendado)
  // const secret = req.headers.get("x-ttn-secret");
  // if (secret !== process.env.TTN_SECRET) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  const body = await req.json();

  /**
   * Storage Integration envía:
   * { result: { end_device_ids, uplink_message, received_at } }
   */

  const result = body;

  // console.log("DATA", body);

  if (!result?.uplink_message) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // console.log("RESULT", result);

  const { end_device_ids, uplink_message } = result;

  // console.log("end_device_ids: ", end_device_ids);
  // console.log("uplink_message: ", uplink_message);

  // console.log(uplink_message.decoded_payload);
  const record = await prisma.uplink.create({
    data: {
      application: end_device_ids.application_ids.application_id,
      deviceId: end_device_ids.device_id,
      devEui: end_device_ids.dev_eui,
      devAddr: end_device_ids.dev_addr,

      fPort: uplink_message.f_port,
      fCnt: uplink_message.f_cnt,

      battery: uplink_message.decoded_payload?.battery ?? null,
      humidity: uplink_message.decoded_payload?.humidity ?? null,
      temperature: uplink_message.decoded_payload?.temperature ?? null,

      rssi: uplink_message.rx_metadata?.[0]?.rssi ?? null,
      snr: uplink_message.rx_metadata?.[0]?.snr ?? null,

      receivedAt: new Date(result.received_at),
      raw: body,
    },
  });

  console.log("Record: ", record);

  await pusher.trigger("uplinks", "new", record);

  return NextResponse.json({ success: true });
}
