import React, { useState, useEffect } from 'react';
import api from '../api/api';

// Typdefinition för ett avtal/abonnemang
interface Agreement {
  id: string;
  name: string;
  category: string;
  supplier: string;
  owner: string;
  startMonth: string;
  endMonth: string;
  monthsCount?: number;
  costPerMonth: number;
  frequency: 'Månadsvis' | 'Kvartalsvis' | 'Halvårsvis' | 'Årligen';
  notes?: string;
  status: 'aktiv' | 'avslutad' | 'undertecknad' | 'väntar på motpart';
}

const initialAgreements: Agreement[] = [];

export default function Agreements() {
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string; categoryId: number }[]>([]);
  const [form, setForm] = useState<Partial<Agreement>>({
    name: '',
    category: '',
    supplier: '',
    owner: '',
    startMonth: '',
    endMonth: '',
    costPerMonth: 0,
    frequency: 'Månadsvis',
    notes: '',
    status: 'aktiv',
  });
  // Filtrera leverantörer baserat på vald kategori
  const filteredSuppliers = form.category
    ? suppliers.filter(sup => {
        const cat = categories.find(c => c.name === form.category);
        return cat && sup.categoryId === cat.id;
      })
    : [];
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
  api.get('/agreements').then(res => setAgreements(res.data));
  api.get('/categories').then(res => setCategories(res.data));
  api.get('/suppliers').then(res => setSuppliers(res.data));
  }, []);

  // Hantera formulärändringar
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Lägg till eller uppdatera avtal
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      await api.put(`/agreements/${editingId}`, form);
    } else {
      await api.post('/agreements', form);
    }
    const res = await api.get('/agreements');
    setAgreements(res.data);
    setEditingId(null);
    setForm({
      name: '',
      category: '',
      supplier: '',
      owner: '',
      startMonth: '',
      endMonth: '',
      costPerMonth: 0,
      frequency: 'Månadsvis',
      notes: '',
      status: 'aktiv',
    });
  }

  // Redigera avtal
  function handleEdit(id: string) {
    const agreement = agreements.find(a => a.id === id);
    if (agreement) {
      setForm(agreement);
      setEditingId(id);
    }
  }

  // Radera avtal
  async function handleDelete(id: string) {
    await api.delete(`/agreements/${id}`);
    const res = await api.get('/agreements');
    setAgreements(res.data);
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">Avtal & abonnemang</h2>
      <form className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Avtal" className="input-field" required />
          <button type="button" className="btn-secondary px-2 py-1" title="Lägg till nytt avtal" onClick={() => alert('Lägg till nytt avtal-modal (implementera modal!)')}>+
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select name="category" value={form.category || ''} onChange={handleChange} className="input-field" required>
            <option value="">Välj kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button type="button" className="btn-secondary px-2 py-1" title="Lägg till ny kategori" onClick={() => alert('Lägg till ny kategori-modal (implementera modal!)')}>+
          </button>
        </div>
        <select
          name="supplier"
          value={form.supplier || ''}
          onChange={handleChange}
          className="input-field"
          required
          disabled={!form.category}
        >
          <option value="">{form.category ? 'Välj leverantör' : 'Välj kategori först'}</option>
          {filteredSuppliers.map(sup => (
            <option key={sup.id} value={sup.name}>{sup.name}</option>
          ))}
        </select>
        <input name="owner" value={form.owner || ''} onChange={handleChange} placeholder="Står på (ägare)" className="input-field" />
        <input name="startMonth" type="month" value={form.startMonth || ''} onChange={handleChange} className="input-field" required />
        <input name="endMonth" type="month" value={form.endMonth || ''} onChange={handleChange} className="input-field" />
        <input name="monthsCount" type="number" value={form.monthsCount || ''} onChange={handleChange} placeholder="Antal månader" className="input-field" />
        <input name="costPerMonth" type="number" value={form.costPerMonth || ''} onChange={handleChange} placeholder="Kostnad / månad (SEK)" className="input-field" required />
        <select name="frequency" value={form.frequency || 'Månadsvis'} onChange={handleChange} className="input-field">
          <option value="Månadsvis">Månadsvis</option>
          <option value="Kvartalsvis">Kvartalsvis</option>
          <option value="Halvårsvis">Halvårsvis</option>
          <option value="Årligen">Årligen</option>
        </select>
        <select name="status" value={form.status || 'aktiv'} onChange={handleChange} className="input-field">
          <option value="aktiv">Aktiv</option>
          <option value="avslutad">Avslutad</option>
          <option value="undertecknad">Undertecknad</option>
          <option value="väntar på motpart">Väntar på motpart</option>
        </select>
        <div className="col-span-1 md:col-span-2">
          <textarea name="notes" value={form.notes || ''} onChange={handleChange} placeholder="Anteckningar" className="input-field w-full" />
        </div>
        <div className="col-span-1 md:col-span-2 flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg shadow flex items-center gap-2 transition-colors duration-200 w-full justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {editingId ? 'Uppdatera post' : 'Lägg till'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm({ name: '', category: '', supplier: '', owner: '', startMonth: '', endMonth: '', costPerMonth: 0, frequency: 'Månadsvis', notes: '', status: 'aktiv' }); }}>
              Avbryt redigering
            </button>
          )}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300 rounded-lg shadow bg-white dark:bg-gray-900">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Start-M</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Slut-M</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frekvens</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ägare</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Leverantör</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kostnad/mån</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notering</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bilder</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {agreements.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-3 py-6 text-center text-gray-400">Inga avtal eller abonnemang har lagts till ännu.</td>
              </tr>
            ) : agreements.map(a => (
              <tr key={a.id} className="group hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
                <td className="px-3 py-2">{a.startMonth}</td>
                <td className="px-3 py-2">{a.endMonth}</td>
                <td className="px-3 py-2 flex items-center justify-center">
                  <span className="relative group">
                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${a.frequency === 'Månadsvis' ? 'bg-blue-500' : a.frequency === 'Kvartalsvis' ? 'bg-purple-500' : a.frequency === 'Halvårsvis' ? 'bg-teal-500' : 'bg-orange-500'}`}>{a.frequency === 'Månadsvis' ? 'M' : a.frequency === 'Kvartalsvis' ? 'K' : a.frequency === 'Halvårsvis' ? 'H' : 'Å'}</span>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.2rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                      {a.frequency}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-500">{a.id}</td>
                <td className="px-3 py-2">{a.owner}</td>
                <td className="px-3 py-2">{a.category}</td>
                <td className="px-3 py-2">{a.supplier}</td>
                <td className="px-3 py-2">{a.costPerMonth} kr</td>
                <td className="px-3 py-2 flex items-center justify-center">
                  <span className="relative group">
                    <button className="hover:text-primary-600" title="Visa notering">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    {a.notes && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.2rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                        {a.notes}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-3 py-2 flex items-center justify-center">
                  <span className="relative group">
                    <button className="hover:text-primary-600" title="Visa bilder">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4a3 3 0 014 0l4 4M4 8h.01" /></svg>
                    </button>
                    {/* Tooltip för bilder kan visas här om bilder finns */}
                  </span>
                </td>
                <td className="px-3 py-2 flex items-center justify-center">
                  <span className="relative group">
                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${a.status === 'aktiv' ? 'bg-green-500' : a.status === 'avslutad' ? 'bg-black' : a.status === 'undertecknad' ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.2rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2 flex gap-2 justify-center">
                  <button className="btn-secondary group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors duration-200" onClick={() => handleEdit(a.id)} title="Redigera avtal">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.293-6.293a1 1 0 011.414 0l1.586 1.586a1 1 0 010 1.414L11 15l-4 1 1-4z" /></svg>
                  </button>
                  <button className="btn-danger group-hover:bg-red-100 group-hover:text-red-700 transition-colors duration-200" onClick={() => handleDelete(a.id)} title="Radera avtal">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
