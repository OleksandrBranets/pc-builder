import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = headers();

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": headersList.get("svix-id")!,
      "svix-timestamp": headersList.get("svix-timestamp")!,
      "svix-signature": headersList.get("svix-signature")!,
    });
  } catch (e) {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (evt.type === "user.created") {
    const { id, email_addresses, full_name } = evt.data;

    await supabase.from("profiles").insert({
      user_id: id,
      email: email_addresses?.[0]?.email_address ?? null,
      full_name: full_name ?? "",
    });
  }

  return new Response("OK", { status: 200 });
}
