'use client';
import { useState } from 'react';
import UserSearch, { Responsable } from './UserSearch';

interface Props {
  onAdd(entry: {
    title: string;
    responsables: Responsable[];
  }): void;
  onClose(): void;
}

export default function AddEntryModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [responsables, setResponsables] = useState<Responsable[]>([]);

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), responsables });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-lg space-y-3">
        <h2 className="text-lg font-semibold">Nuevo Acuerdo</h2>
        <textarea
          className="border p-1 w-full h-24"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <UserSearch value={responsables} onChange={setResponsables} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="border px-3 py-1 rounded">
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
