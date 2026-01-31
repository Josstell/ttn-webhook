import prisma from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // Seguridad (opcional pero recomendado)
  const secret = req.headers.get("x-ttn-secret");
  if (secret !== process.env.TTN_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  /**
   * Storage Integration envía:
   * { result: { end_device_ids, uplink_message, received_at } }
   */
  const result = body.result;
  if (!result?.uplink_message) {
    return Response.json({ ok: true });
  }

  const { end_device_ids, uplink_message } = result;

  console.log(uplink_message.decoded_payload);
  await prisma.uplink.create({
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

  return Response.json({ ok: true });
}
