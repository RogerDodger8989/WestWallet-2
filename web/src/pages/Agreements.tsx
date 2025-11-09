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
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/agreements').then(res => setAgreements(res.data));
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
        <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Namn" className="input-field" required />
        <input name="category" value={form.category || ''} onChange={handleChange} placeholder="Kategori" className="input-field" required />
        <input name="supplier" value={form.supplier || ''} onChange={handleChange} placeholder="Leverantör" className="input-field" required />
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
        <textarea name="notes" value={form.notes || ''} onChange={handleChange} placeholder="Anteckningar" className="input-field" />
        <select name="status" value={form.status || 'aktiv'} onChange={handleChange} className="input-field">
          <option value="aktiv">Aktiv</option>
          <option value="avslutad">Avslutad</option>
          <option value="undertecknad">Undertecknad</option>
          <option value="väntar på motpart">Väntar på motpart</option>
        </select>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="btn-primary">
            {editingId ? 'Uppdatera post' : 'Lägg till'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm({ name: '', category: '', supplier: '', owner: '', startMonth: '', endMonth: '', costPerMonth: 0, frequency: 'Månadsvis', notes: '', status: 'aktiv' }); }}>
              Avbryt redigering
            </button>
          )}
        </div>
      </form>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Namn</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frekvens</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Leverantör</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ägare</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kostnad/mån</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Notering</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Åtgärder</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {agreements.map(a => (
            <tr key={a.id}>
              <td className="px-3 py-2">{a.startMonth}</td>
              <td className="px-3 py-2">{a.endMonth}</td>
              <td className="px-3 py-2 font-mono">{a.id}</td>
              <td className="px-3 py-2">{a.name}</td>
              <td className="px-3 py-2">{a.frequency}</td>
              <td className="px-3 py-2">{a.category}</td>
              <td className="px-3 py-2">{a.supplier}</td>
              <td className="px-3 py-2">{a.owner}</td>
              <td className="px-3 py-2">{a.costPerMonth} kr</td>
              <td className="px-3 py-2">{a.status}</td>
              <td className="px-3 py-2">{a.notes}</td>
              <td className="px-3 py-2 flex gap-2">
                <button className="btn-secondary" onClick={() => handleEdit(a.id)}>Redigera</button>
                <button className="btn-danger" onClick={() => handleDelete(a.id)}>Radera</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
