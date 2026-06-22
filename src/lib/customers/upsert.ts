import { createAdminClient } from "@/lib/supabase/admin";

export async function upsertCustomer(
  phone: string,
  name: string,
  address: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("customers")
    .select("id, order_count")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("customers")
      .update({
        name,
        last_address: address,
        order_count: existing.order_count + 1,
      })
      .eq("id", existing.id);
    return;
  }

  await supabase.from("customers").insert({
    phone,
    name,
    last_address: address,
    order_count: 1,
  });
}
