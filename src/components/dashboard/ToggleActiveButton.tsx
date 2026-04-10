"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  employeeId: string;
  isActive: boolean;
  activateLabel: string;
  deactivateLabel: string;
};

export function ToggleActiveButton({ employeeId, isActive, activateLabel, deactivateLabel }: Props) {
  const router = useRouter();

  async function handleToggle() {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("employees")
      .update({ is_active: !isActive })
      .eq("id", employeeId);

    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      className={`text-xs font-medium hover:underline ${
        isActive ? "text-red-500" : "text-success"
      }`}
    >
      {isActive ? deactivateLabel : activateLabel}
    </button>
  );
}
