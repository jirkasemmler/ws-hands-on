"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import ParticipantsSection from "./ParticipantsSection";
import StepsSection from "./StepsSection";
import ProgressSection from "./ProgressSection";

type Participant = { id: number; name: string; team: string | null };
type Step = { id: number; name: string; color: string; position: number };
type Progress = { id: number; participant_id: number; step_id: number; done: boolean };

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [tab, setTab] = useState<"participants" | "steps" | "progress">("progress");
  const supabase = createClient();

  const loadAll = useCallback(async () => {
    const [pRes, sRes, prRes] = await Promise.all([
      supabase.from("participants").select("*").order("name"),
      supabase.from("steps").select("*").order("position"),
      supabase.from("progress").select("*"),
    ]);
    if (pRes.data) setParticipants(pRes.data);
    if (sRes.data) setSteps(sRes.data);
    if (prRes.data) setProgress(prRes.data);
  }, [supabase]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const tabs = [
    { key: "progress" as const, label: "Progres" },
    { key: "participants" as const, label: "Účastníci" },
    { key: "steps" as const, label: "Kroky" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Administrace</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === t.key
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "participants" && (
        <ParticipantsSection
          participants={participants}
          onUpdate={loadAll}
        />
      )}
      {tab === "steps" && (
        <StepsSection steps={steps} onUpdate={loadAll} />
      )}
      {tab === "progress" && (
        <ProgressSection
          participants={participants}
          steps={steps}
          progress={progress}
          onUpdate={loadAll}
        />
      )}
    </div>
  );
}
