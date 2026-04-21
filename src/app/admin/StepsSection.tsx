"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

type Step = { id: number; name: string; color: string; position: number };

export default function StepsSection({
  steps,
  onUpdate,
}: {
  steps: Step[];
  onUpdate: () => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6B7280");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const supabase = createClient();

  async function addStep(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const nextPosition = steps.length > 0 ? Math.max(...steps.map((s) => s.position)) + 1 : 1;
    await supabase
      .from("steps")
      .insert({ name: name.trim(), color, position: nextPosition });
    setName("");
    setColor("#6B7280");
    onUpdate();
  }

  async function deleteStep(id: number) {
    await supabase.from("steps").delete().eq("id", id);
    onUpdate();
  }

  function startEdit(s: Step) {
    setEditingId(s.id);
    setEditName(s.name);
    setEditColor(s.color);
  }

  async function saveEdit(id: number) {
    await supabase
      .from("steps")
      .update({ name: editName.trim(), color: editColor })
      .eq("id", id);
    setEditingId(null);
    onUpdate();
  }

  return (
    <div>
      <form onSubmit={addStep} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Název kroku"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
        >
          Přidat
        </button>
      </form>

      <div className="space-y-2">
        {steps.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
          >
            {editingId === s.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                />
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                />
                <button
                  onClick={() => saveEdit(s.id)}
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
                <span
                  className="w-4 h-4 rounded-full inline-block"
                  style={{ backgroundColor: s.color }}
                />
                <span className="flex-1 font-medium">{s.name}</span>
                <span className="text-xs text-gray-400">#{s.position}</span>
                <button
                  onClick={() => startEdit(s)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Upravit
                </button>
                <button
                  onClick={() => deleteStep(s.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Smazat
                </button>
              </>
            )}
          </div>
        ))}
        {steps.length === 0 && (
          <p className="text-gray-400 text-sm">Zatím žádné kroky.</p>
        )}
      </div>
    </div>
  );
}
