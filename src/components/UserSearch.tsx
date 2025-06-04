'use client';
import { useEffect, useState } from 'react';

export interface Responsable {
  email: string;
  fullName: string;
}

interface Props {
  value: Responsable[];
  onChange(value: Responsable[]): void;
}

interface SearchResult {
  email: string;
  primaryEmail?: string;
  fullName: string;
}

export default function UserSearch({ value, onChange }: Props) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (term) {
      setLoading(true);
      const timer = setTimeout(() => {
        fetch('https://bot.casitaapps.com/search-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchTerm: term }),
          signal: controller.signal,
        })
          .then(res => res.json())
          .then(data => {
            setResults(data.users || []);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }, 300);
      return () => {
        clearTimeout(timer);
        controller.abort();
      };
    }
    setResults([]);
    setLoading(false);
    return () => controller.abort();
  }, [term]);

  const addUser = (u: SearchResult) => {
    const email = u.primaryEmail || u.email;
    if (!value.some(v => v.email === email)) {
      onChange([...value, { email, fullName: u.fullName }]);
    }
    setTerm('');
    setResults([]);
  };

  const removeUser = (u: Responsable) => {
    onChange(value.filter(v => v.email !== u.email));
  };

  return (
    <div className="border rounded p-2 text-sm">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(u => (
          <span
            key={u.email}
            className="px-2 py-1 bg-gray-200 rounded-full flex items-center gap-1"
          >
            {u.fullName}
            <button
              type="button"
              className="text-red-600 ml-1"
              onClick={() => removeUser(u)}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={term}
        onChange={e => setTerm(e.target.value)}
        placeholder="Buscar usuarios..."
        className="border p-1 w-full"
      />
      {loading && <div className="mt-1 text-gray-500">Buscando...</div>}
      {results.length > 0 && (
        <ul className="border mt-1 max-h-40 overflow-auto">
          {results.map(u => (
            <li
              key={u.email}
              className="p-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => addUser(u)}
            >
              {u.fullName} - {u.primaryEmail || u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
