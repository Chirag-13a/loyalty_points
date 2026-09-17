import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export function MembersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [newMember, setNewMember] = useState({ name: '', phone: '' });

  const load = useCallback(async (nextPage = page) => {
    const { data } = await api.get('/members', {
      params: { search, page: nextPage, limit: 8, sortBy, sortOrder },
    });
    setMembers(data.data);
    setPagination(data.pagination);
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    load(page);
  }, [load, page]);

  const createMember = async (event) => {
    event.preventDefault();
    await api.post('/members', newMember);
    setNewMember({ name: '', phone: '' });
    load(1);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Member Directory</h1>
        <form className="mt-4 grid gap-2 md:grid-cols-3" onSubmit={createMember}>
          <input className="rounded-xl border border-[#d9c6af] px-3 py-2" placeholder="Member name" value={newMember.name} onChange={(event) => setNewMember((prev) => ({ ...prev, name: event.target.value }))} required />
          <input className="rounded-xl border border-[#d9c6af] px-3 py-2" placeholder="Phone number" value={newMember.phone} onChange={(event) => setNewMember((prev) => ({ ...prev, phone: event.target.value }))} required />
          <button type="submit" className="rounded-xl bg-[#C97B4A] px-4 py-2 font-semibold text-white">Add Member</button>
        </form>

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          <input className="rounded-xl border border-[#d9c6af] px-3 py-2" placeholder="Search by phone or name" value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} />
          <select className="rounded-xl border border-[#d9c6af] px-3 py-2" value={sortBy} onChange={(event) => { setPage(1); setSortBy(event.target.value); }}>
            <option value="createdAt">Newest</option>
            <option value="name">Name</option>
            <option value="phone">Phone</option>
          </select>
          <select className="rounded-xl border border-[#d9c6af] px-3 py-2" value={sortOrder} onChange={(event) => { setPage(1); setSortOrder(event.target.value); }}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          {members.map((member) => (
            <Link key={member._id} to={`/members/${member._id}`} className="rounded-xl border border-[#eadbc8] p-4 hover:bg-[#fdf8f1]">
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm">{member.phone}</p>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm">{pagination.total} members</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { const next = Math.max(1, page - 1); setPage(next); load(next); }} disabled={page <= 1} className="rounded-lg border border-[#d9c6af] px-3 py-1 disabled:opacity-40">Prev</button>
            <span className="text-sm">Page {page} / {pagination.pages || 1}</span>
            <button type="button" onClick={() => { const next = Math.min(pagination.pages || 1, page + 1); setPage(next); load(next); }} disabled={page >= (pagination.pages || 1)} className="rounded-lg border border-[#d9c6af] px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
