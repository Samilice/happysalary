import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profile = data as Profile | null;

  if (!profile?.onboarding_completed) redirect(`/${locale}/onboarding`);

  return (
    <div className="min-h-screen bg-background-alt">
      <DashboardNav userName={profile.full_name || profile.email} userRole={profile.role} />
      <main className="pt-4 pb-12">
        {children}
      </main>
    </div>
  );
}
