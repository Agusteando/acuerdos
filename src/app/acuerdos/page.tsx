'use client';
import { useEffect, useState } from 'react';
import EditEntryModal, { Entry as EntryType } from '@/components/EditEntryModal';

interface Responsable {
  email: string;
  fullName: string;
}

interface Entry {
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

interface RawEntry extends Entry {
  responsables?: string;
}

interface Group {
  uid: string;
  minuta_title: string;
  entries: Entry[];
  visible: boolean;
}

export default function AcuerdosPage() {
  const [groups, setGroups] = useState<Record<string, Group>>({});
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<EntryType | null>(null);

  useEffect(() => {
    fetch('https://bot.casitaapps.com/acuerdos/not-done')
      .then(res => res.json())
      .then((data: RawEntry[]) => {
        const grouped: Record<string, Group> = {};
        data.forEach(e => {
          let responsables: Responsable[] = [];
          try {
            if (typeof e.responsables === 'string') {
              responsables = JSON.parse(e.responsables);
            }
          } catch {
            responsables = [];
          }
          if (!grouped[e.uid]) {
            grouped[e.uid] = { uid: e.uid, minuta_title: e.minuta_title, entries: [], visible: false };
          }
          grouped[e.uid].entries.push({
            ...e,
            responsablesArray: responsables,
            done: e.progreso >= 100,
          });
        });
        setGroups(grouped);
      })
      .catch(err => console.error('Error loading entries', err));
  }, []);

const toggleDone = (entry: Entry) => {
  const newDone = !entry.done;
  const newStatus = newDone ? 'completado' : 'pendiente';
  const newProgreso = newDone ? 100 : 0;
  fetch(`https://bot.casitaapps.com/acuerdos/${entry.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: newDone, status: newStatus, progreso: newProgreso }),
  })
    .then(() => {
      setGroups(prev => {
        const updated = { ...prev };
        const g = updated[entry.uid];
        if (!g) return prev;
        g.entries = g.entries.map(e =>
          e.id === entry.id ? { ...e, done: newDone, status: newStatus, progreso: newProgreso } : e,
        );
        return updated;
      });
    })
    .catch(err => console.error('Error updating entry', err));
};

const updateStatus = (entry: Entry, status: string) => {
  let progreso = entry.progreso;
  let done = entry.done;
  if (status === 'completado') {
    progreso = 100;
    done = true;
  } else if (status === 'pendiente' || status === 'cancelado') {
    progreso = 0;
    done = false;
  } else if (status === 'en progreso') {
    done = false;
    if (!progreso || progreso < 10) progreso = 10;
  }
  fetch(`https://bot.casitaapps.com/acuerdos/${entry.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, progreso, done }),
  })
    .then(() => {
      setGroups(prev => {
        const updated = { ...prev };
        const g = updated[entry.uid];
        if (!g) return prev;
        g.entries = g.entries.map(e =>
          e.id === entry.id ? { ...e, status, progreso, done } : e,
        );
        return updated;
      });
  })
    .catch(err => console.error('Error updating status', err));
};

const deleteEntry = (entry: Entry) => {
  if (!confirm('Eliminar este acuerdo?')) return;
  fetch(`https://bot.casitaapps.com/acuerdos/${entry.id}`, { method: 'DELETE' })
    .then(() => {
      setGroups(prev => {
        const updated = { ...prev };
        const g = updated[entry.uid];
        if (!g) return prev;
        g.entries = g.entries.filter(e => e.id !== entry.id);
        return updated;
      });
    })
    .catch(err => console.error('Error deleting', err));
};

const saveEntry = (updated: EntryType) => {
  setGroups(prev => {
    const g = prev[updated.uid];
    if (!g) return prev;
    return {
      ...prev,
      [g.uid]: { ...g, entries: g.entries.map(e => (e.id === updated.id ? updated : e)) },
    };
  });
  setEditing(null);
};

  return (
    <>
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Acuerdos</h1>
      <input
        type="text"
        placeholder="Buscar..."
        className="border p-2 w-full max-w-sm mb-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {Object.values(groups).map(group => {
        const completed = group.entries.filter(e => e.done).length;
        const progress = Math.round((completed / group.entries.length) * 100);
        return (
          <div key={group.uid} className="border rounded-md mb-4">
            <button
              className="w-full text-left p-2 bg-gray-100"
              onClick={() => setGroups(prev => ({ ...prev, [group.uid]: { ...group, visible: !group.visible } }))}
            >
              {group.minuta_title}
            </button>
            {group.visible && (
              <div className="p-2 space-y-2">
                <div className="h-2 bg-gray-200 rounded">
                  <div style={{ width: `${progress}%` }} className="h-full bg-green-500 rounded" />
                </div>
                <ul className="space-y-2">
                  {group.entries
                    .filter(entry => {
                      const plain = entry.title.replace(/<[^>]*>/g, '').toLowerCase();
                      return plain.includes(search.toLowerCase());
                    })
                    .map(entry => (
                      <li key={entry.id} className="flex flex-col gap-1 border p-2 rounded">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={entry.done}
                            onChange={() => toggleDone(entry)}
                          />
                          <span dangerouslySetInnerHTML={{ __html: entry.title }} />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm">Estatus:</label>
                          <select
                            value={entry.status}
                            onChange={e => updateStatus(entry, e.target.value)}
                            className="border p-1 text-sm"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en progreso">En progreso</option>
                            <option value="cancelado">Cancelado</option>
                            <option value="completado">Completado</option>
                          </select>
                          <button
                            type="button"
                            className="border px-1 text-xs rounded"
                            onClick={() => setEditing(entry)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="border px-1 text-xs rounded text-red-600"
                            onClick={() => deleteEntry(entry)}
                          >
                            Eliminar
                          </button>
                        </div>
                        {entry.responsablesArray && entry.responsablesArray.length > 0 && (
                          <div className="text-sm text-gray-600">
                            Responsable(s):{' '}
                            {entry.responsablesArray.map(r => r.fullName).join(', ')}
                          </div>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
    {editing && (
      <EditEntryModal
        entry={editing}
        onClose={() => setEditing(null)}
        onSave={saveEntry}
      />
    )}
    </>
  );
}
