"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

type Participant = { id: number; name: string; team: string | null };

export default function ParticipantsSection({
  participants,
  onUpdate,
}: {
  participants: Participant[];
  onUpdate: () => void;
}) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editTeam, setEditTeam] = useState("");
  const supabase = createClient();

  async function addParticipant(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await supabase
      .from("participants")
      .insert({ name: name.trim(), team: team.trim() || null });
    setName("");
    setTeam("");
    onUpdate();
  }

  async function deleteParticipant(id: number) {
    await supabase.from("participants").delete().eq("id", id);
    onUpdate();
  }

  function startEdit(p: Participant) {
    setEditingId(p.id);
    setEditName(p.name);
    setEditTeam(p.team || "");
  }

  async function saveEdit(id: number) {
    await supabase
      .from("participants")
      .update({ name: editName.trim(), team: editTeam.trim() || null })
      .eq("id", id);
    setEditingId(null);
    onUpdate();
  }

  return (
    <div>
      <form onSubmit={addParticipant} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Jméno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
        />
        <input
          type="text"
          placeholder="Tým (volitelné)"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          Přidat
        </button>
      </form>

      <div className="space-y-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
          >
            {editingId === p.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                />
                <input
                  type="text"
                  value={editTeam}
                  onChange={(e) => setEditTeam(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                  placeholder="Tým"
                />
                <button
                  onClick={() => saveEdit(p.id)}
                  className="text-green-600 text-sm hover:underline"
                >
                  Uložit
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 text-sm hover:underline"
                >
                  Zrušit
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{p.name}</span>
                {p.team && (
                  <span className="text-xs text-gray-400">{p.team}</span>
                )}
                <button
                  onClick={() => startEdit(p)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Upravit
                </button>
                <button
                  onClick={() => deleteParticipant(p.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Smazat
                </button>
              </>
            )}
          </div>
        ))}
        {participants.length === 0 && (
          <p className="text-gray-400 text-sm">Zatím žádní účastníci.</p>
        )}
      </div>
    </div>
  );
}
