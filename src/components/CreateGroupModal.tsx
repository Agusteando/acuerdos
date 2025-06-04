'use client';
import { useState } from 'react';

interface Props {
  onCreate(title: string): void;
  onClose(): void;
}

export default function CreateGroupModal({ onCreate, onClose }: Props) {
  const [title, setTitle] = useState('');

  const submit = () => {
    if (!title.trim()) return;
    onCreate(title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-sm space-y-3">
        <h2 className="text-lg font-semibold">Nueva Minuta</h2>
        <input
          type="text"
          className="border p-1 w-full"
          placeholder="Título de la minuta"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="border px-3 py-1 rounded">
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
