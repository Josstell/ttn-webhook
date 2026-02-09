import prisma from "@/lib/db";
import { pusher } from "@/lib/pusher-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const payload = body.uplink_message?.decoded_payload;
  if (!payload) {
    return NextResponse.json({ ok: false });
  }

  console.log("DATA: ", body);

  const record = await prisma.soilUplink.create({
    data: {
      deviceId: body.end_device_ids.device_id,
      applicationId: body.end_device_ids.application_ids.application_id,

      battery: payload.BatV,
      conductivity: payload.conduct_SOIL1,
      soilTemperature: Number(payload.temp_SOIL1),
      airTemperature: Number(payload.temp_DS18B20),
      soilMoisture: Number(payload.water_SOIL1),

      receivedAt: new Date(body.received_at),

      raw: body,
    },
  });

  await pusher.trigger("soil-uplinks", "new", {
    deviceId: body.end_device_ids.device_id,

    battery: payload.BatV,
    conductivity: payload.conduct_SOIL1,
    soilTemperature: Number(payload.temp_SOIL1),
    airTemperature: Number(payload.temp_DS18B20),
    soilMoisture: Number(payload.water_SOIL1),

    receivedAt: new Date(body.received_at),
    time: new Date(body.received_at),
  });

  return NextResponse.json({ ok: true });
}
