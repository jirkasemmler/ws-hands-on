"use client";

import { createClient } from "@/lib/supabase";

type Participant = { id: number; name: string; team: string | null };
type Step = { id: number; name: string; color: string; position: number };
type Progress = { id: number; participant_id: number; step_id: number; done: boolean };

export default function ProgressSection({
  participants,
  steps,
  progress,
  onUpdate,
}: {
  participants: Participant[];
  steps: Step[];
  progress: Progress[];
  onUpdate: () => void;
}) {
  const supabase = createClient();

  function getProgress(participantId: number, stepId: number) {
    return progress.find(
      (p) => p.participant_id === participantId && p.step_id === stepId
    );
  }

  async function toggleProgress(participantId: number, stepId: number) {
    const existing = getProgress(participantId, stepId);
    if (existing) {
      await supabase
        .from("progress")
        .update({ done: !existing.done })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("progress")
        .insert({ participant_id: participantId, step_id: stepId, done: true });
    }
    onUpdate();
  }

  if (participants.length === 0 || steps.length === 0) {
    return (
      <p className="text-gray-400 text-sm">
        Nejdřív přidej účastníky a kroky.
      </p>
    );
  }

  return (
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
              {steps.map((step) => {
                const done = getProgress(participant.id, step.id)?.done ?? false;
                return (
                  <td key={step.id} className="p-2 border-b text-center">
                    <button
                      onClick={() => toggleProgress(participant.id, step.id)}
                      className={`w-8 h-8 rounded-full text-lg leading-8 transition-colors ${
                        done
                          ? "text-white"
                          : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                      }`}
                      style={done ? { backgroundColor: step.color } : undefined}
                    >
                      {done ? "✓" : "✗"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
