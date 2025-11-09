import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import api from '../api/api';

// Typdefinition för ett avtal/abonnemang
interface Agreement {
  id: string;
  displayId?: string;
  name: string;
  category?: { id: number; name: string } | string;
  supplier?: { id: number; name: string } | string;
  owner?: string;
  startMonth?: string;
  endMonth?: string;
  monthsCount?: number;
  costPerMonth?: number;
  frequency?: 'Månadsvis' | 'Kvartalsvis' | 'Halvårsvis' | 'Årligen';
  notes?: string;
  images?: string[];
  status?: 'aktiv' | 'avslutad' | 'undertecknad' | 'väntar på motpart';
  categoryId?: number;
  supplierId?: number;
  userId?: number;
}

const initialAgreements: Agreement[] = [];

export default function Agreements() {
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string; categoryId: number }[]>([]);
  // form uses simple primitive values for selects/inputs
  const [form, setForm] = useState<{
    name?: string;
    category?: string;
    supplier?: string;
    owner?: string;
    startMonth?: string;
    endMonth?: string;
    monthsCount?: number | string;
    costPerMonth?: number | string;
    frequency?: string;
    notes?: string;
    status?: string;
  }>({
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

  // Modal state for category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  // Modal state for supplier
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  // Local modals for notes/images
  const [noteModalAgreement, setNoteModalAgreement] = useState<Agreement | null>(null);
  const [imageModalAgreement, setImageModalAgreement] = useState<Agreement | null>(null);

  // Hantera formulärändringar
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Lägg till eller uppdatera avtal
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Hitta id för kategori och leverantör
    const categoryObj = categories.find(c => c.name === form.category);
    const supplierObj = suppliers.find(s => s.name === form.supplier && (!categoryObj || s.categoryId === categoryObj.id));
    const agreementData: any = {
      ...form,
      categoryId: categoryObj ? categoryObj.id : undefined,
      supplierId: supplierObj ? supplierObj.id : undefined,
    };
    // Ta bort namn-fälten ur payloaden
    delete agreementData.category;
    delete agreementData.supplier;
    if (editingId) {
      await api.put(`/agreements/${editingId}`, agreementData);
    } else {
      await api.post('/agreements', agreementData);
    }
    setTimeout(async () => {
      const res = await api.get('/agreements');
      setAgreements(res.data);
    }, 400);
    // Notify other parts of the app (expenses) to reload their data
    try { window.dispatchEvent(new Event('expenses:reload')); } catch (e) {}
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
      setForm({
        name: agreement.name || '',
        category: typeof agreement.category === 'string' ? agreement.category : agreement.category?.name || '',
        supplier: typeof agreement.supplier === 'string' ? agreement.supplier : agreement.supplier?.name || '',
        owner: agreement.owner || '',
        startMonth: agreement.startMonth || '',
        endMonth: agreement.endMonth || '',
        monthsCount: agreement.monthsCount || '',
        costPerMonth: agreement.costPerMonth || '',
        frequency: agreement.frequency || 'Månadsvis',
        notes: agreement.notes || '',
        status: agreement.status || 'aktiv',
      });
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
          <button type="button" className="btn-secondary px-2 py-1" title="Lägg till ny kategori" onClick={() => setShowCategoryModal(true)}>+
          </button>
          {showCategoryModal && (
            <Modal onClose={() => setShowCategoryModal(false)}>
              <div className="p-2">
                <h2 className="text-lg font-bold mb-2">Lägg till ny kategori</h2>
                <input
                  type="text"
                  className="input-field w-full mb-2"
                  placeholder="Kategorinamn"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <button className="btn-secondary" onClick={() => setShowCategoryModal(false)}>Avbryt</button>
                  <button className="btn-primary" onClick={async () => {
                    if (!newCategoryName.trim()) return;
                    await api.post('/categories', { name: newCategoryName });
                    setShowCategoryModal(false);
                    setNewCategoryName("");
                    const cats = await api.get('/categories');
                    setCategories(cats.data);
                    setForm(prev => ({ ...prev, category: newCategoryName }));
                  }}>Spara</button>
                </div>
              </div>
            </Modal>
          )}
        </div>
        <div className="flex items-center gap-2">
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
          <button type="button" className="btn-secondary px-2 py-1" title="Lägg till ny leverantör" onClick={() => setShowSupplierModal(true)}>+</button>
          {showSupplierModal && (
            <Modal onClose={() => setShowSupplierModal(false)}>
              <div className="p-2">
                <h2 className="text-lg font-bold mb-2">Lägg till ny leverantör</h2>
                <input
                  type="text"
                  className="input-field w-full mb-2"
                  placeholder="Leverantörsnamn"
                  value={newSupplierName}
                  onChange={e => setNewSupplierName(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <button className="btn-secondary" onClick={() => setShowSupplierModal(false)}>Avbryt</button>
                  <button className="btn-primary" onClick={async () => {
                    if (!newSupplierName.trim() || !form.category) return;
                    // Hämta kategori-id
                    const cat = categories.find(c => c.name === form.category);
                    if (!cat) return;
                    await api.post('/suppliers', { name: newSupplierName, categoryId: cat.id });
                    setShowSupplierModal(false);
                    setNewSupplierName("");
                    const sups = await api.get('/suppliers');
                    setSuppliers(sups.data);
                    setForm(prev => ({ ...prev, supplier: newSupplierName }));
                  }}>Spara</button>
                </div>
              </div>
            </Modal>
          )}
        </div>
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
                <td className="px-3 py-2 font-mono text-xs text-gray-500">{a.displayId || a.id}</td>
                <td className="px-3 py-2">{a.owner}</td>
                <td className="px-3 py-2">{typeof a.category === 'string' ? a.category : a.category?.name || '-'}</td>
                <td className="px-3 py-2">{typeof a.supplier === 'string' ? a.supplier : a.supplier?.name || '-'}</td>
                <td className="px-3 py-2">{a.costPerMonth} kr</td>
                <td className="px-3 py-2 flex items-center justify-center">
                  <span className="relative group">
                    <button
                      type="button"
                      onClick={() => setNoteModalAgreement(a)}
                      title={a.notes && a.notes.length > 0 ? 'Visa/ändra anteckning' : 'Lägg till anteckning'}
                      className={`inline-flex items-center gap-1 pl-0 pr-2 py-1 rounded-md ${
                        a.notes && a.notes.length > 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8M8 8h8M5 6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6z"/></svg>
                      <span className="text-xs">{a.notes && a.notes.length > 0 ? '1' : '0'}</span>
                    </button>
                  </span>
                </td>
                <td className="px-3 py-2 flex items-center justify-center">
                  <span className="relative group">
                    <button
                      type="button"
                      onClick={() => setImageModalAgreement(a)}
                      className={`inline-flex items-center gap-1 pl-0 pr-2 py-1 rounded-md ${
                        a.images && a.images.length > 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                      title="Visa bilder"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {a.images && a.images.length > 0 ? a.images.length : '0'}
                    </button>
                  </span>
                </td>
                <td className="px-3 py-2 flex items-center justify-center">
                  <span className="relative group">
                    <span className={`inline-block w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${a.status === 'aktiv' ? 'bg-green-500' : a.status === 'avslutad' ? 'bg-black' : a.status === 'undertecknad' ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-[-2.2rem] px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-2 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                      {a.status ? (typeof a.status === 'string' ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : '-') : '-'}
                    </span>
                  </span>
                </td>
                <td className="px-3 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(a.id)}
                    title="Redigera"
                    className="p-2 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-2 4h2m-5 4h6m2 6H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a2 2 0 011.414.586l4.414 4.414A2 2 0 0119 9.414V19a2 2 0 01-2 2z"/></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    title="Ta bort"
                    className="p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Note Modal for agreements */}
      {noteModalAgreement && (
        <Modal onClose={() => setNoteModalAgreement(null)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Anteckning – {noteModalAgreement.displayId || noteModalAgreement.id}</h3>
            <p className="mt-2 whitespace-pre-wrap">{noteModalAgreement.notes || ''}</p>
            <div className="mt-4 flex justify-end">
              <button className="btn-secondary" onClick={() => setNoteModalAgreement(null)}>Stäng</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Images Modal for agreements (read-only) */}
      {imageModalAgreement && (
        <Modal onClose={() => setImageModalAgreement(null)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Bilder – {imageModalAgreement.displayId || imageModalAgreement.id}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(imageModalAgreement.images || []).map((img, idx) => (
                <div key={idx} className="border rounded p-2 text-sm">{img}</div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="btn-secondary" onClick={() => setImageModalAgreement(null)}>Stäng</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
