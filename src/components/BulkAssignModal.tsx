'use client';
import { useState } from 'react';
import UserSearch, { Responsable } from './UserSearch';

interface Props {
  onAssign(users: Responsable[]): void;
  onClose(): void;
}

export default function BulkAssignModal({ onAssign, onClose }: Props) {
  const [users, setUsers] = useState<Responsable[]>([]);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-lg space-y-3">
        <h2 className="text-lg font-semibold">Asignar Responsables</h2>
        <UserSearch value={users} onChange={setUsers} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="border px-3 py-1 rounded">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onAssign(users)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
