"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Participant = { id: number; name: string; team: string | null };
type Step = { id: number; name: string; color: string; position: number };
type Progress = { participant_id: number; step_id: number; done: boolean };

export default function DashboardPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const supabase = createClient();

  const loadData = useCallback(async () => {
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
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  function isDone(participantId: number, stepId: number) {
    return progress.some(
      (p) => p.participant_id === participantId && p.step_id === stepId && p.done
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {participants.length === 0 ? (
        <p className="text-gray-500">
          Zatím žádní účastníci. Přidej je v{" "}
          <a href="/admin" className="text-blue-600 underline">
            administraci
          </a>
          .
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b font-medium">Účastník</th>
                {steps.map((step) => (
                  <th
                    key={step.id}
                    className="p-2 border-b font-medium text-center text-sm"
                    style={{ color: step.color }}
                  >
                    {step.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="p-2 border-b">
                    <span className="font-medium">{participant.name}</span>
                    {participant.team && (
                      <span className="text-xs text-gray-400 ml-2">
                        {participant.team}
                      </span>
                    )}
                  </td>
                  {steps.map((step) => (
                    <td key={step.id} className="p-2 border-b text-center">
                      {isDone(participant.id, step.id) ? (
                        <span
                          className="inline-block w-8 h-8 rounded-full text-white text-lg leading-8"
                          style={{ backgroundColor: step.color }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span className="inline-block w-8 h-8 rounded-full bg-gray-200 text-gray-400 text-lg leading-8">
                          ✗
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">
        Automaticky se obnovuje každých 5 sekund.
      </p>
    </div>
  );
}
