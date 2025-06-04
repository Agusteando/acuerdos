'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import UserSearch, { Responsable } from './UserSearch';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export interface Entry {
  id: number;
  uid: string;
  minuta_title: string;
  title: string;
  progreso: number;
  status: string;
  deadline?: string;
  responsablesArray?: Responsable[];
  done?: boolean;
}

interface Props {
  entry: Entry;
  onClose(): void;
  onSave(updated: Entry): void;
}

export default function EditEntryModal({ entry, onClose, onSave }: Props) {
  const [title, setTitle] = useState(entry.title.replace(/<[^>]*>/g, ''));
  const [status, setStatus] = useState(entry.status);
  const [progreso, setProgreso] = useState(entry.progreso);
  const [deadline, setDeadline] = useState(entry.deadline || '');
  const [responsables, setResponsables] = useState<Responsable[]>(entry.responsablesArray || []);

  const submit = () => {
    const data = {
      title,
      status,
      progreso,
      deadline: deadline || null,
      responsables: JSON.stringify(responsables),
      done: status === 'completado' || progreso >= 100,
    };
    fetch(`https://bot.casitaapps.com/acuerdos/${entry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(() => {
        onSave({
          ...entry,
          title: data.title,
          status: data.status,
          progreso: data.progreso,
          deadline: deadline || undefined,
          responsablesArray: responsables,
          done: data.done,
        });
      })
      .catch(err => {
        console.error('Error updating entry', err);
        onClose();
      });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-lg space-y-3">
        <h2 className="text-lg font-semibold">Editar Acuerdo</h2>
        <ReactQuill theme="snow" value={title} onChange={setTitle} />
        <div className="flex items-center gap-2">
          <label className="text-sm">Estatus:</label>
          <select
            className="border p-1 text-sm"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option className="status-pendiente" value="pendiente">Pendiente</option>
            <option className="status-en-progreso" value="en progreso">En progreso</option>
            <option className="status-cancelado" value="cancelado">Cancelado</option>
            <option className="status-completado" value="completado">Completado</option>
          </select>
        </div>
        <input
          type="number"
          min={0}
          max={100}
          className="border p-1 w-full text-sm"
          value={progreso}
          onChange={e => setProgreso(Number(e.target.value))}
        />
        <input
          type="date"
          className="border p-1 w-full text-sm"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
        />
        <UserSearch value={responsables} onChange={setResponsables} />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="border px-3 py-1 rounded">
            Cancelar
          </button>
          <button type="button" onClick={submit} className="bg-blue-600 text-white px-3 py-1 rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
