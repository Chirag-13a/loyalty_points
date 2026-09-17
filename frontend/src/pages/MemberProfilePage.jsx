import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

export function MemberProfilePage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({ pages: 1 });

  const loadMember = useCallback(async () => {
    const { data } = await api.get(`/members/${id}`);
    setMember(data.member);
    setSummary(data.summary);
  }, [id]);

  const loadTransactions = useCallback(async (nextPage = page) => {
    const { data } = await api.get(`/members/${id}/transactions`, {
      params: { page: nextPage, limit: 8, sortBy, sortOrder },
    });
    setTransactions(data.data);
    setPagination(data.pagination);
  }, [id, page, sortBy, sortOrder]);

  useEffect(() => {
    loadMember();
  }, [loadMember]);

  useEffect(() => {
    loadTransactions(page);
  }, [loadTransactions, page]);

  if (!member || !summary) {
    return <p>Loading member profile...</p>;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{member.name}</h1>
        <p>{member.phone}</p>
        <p className="mt-4 text-sm">Points Balance</p>
        <p className="text-4xl font-bold text-[#C97B4A]">{summary.pointsBalance} pts</p>
        <p className="mt-2 text-sm">Tier: <span className="font-semibold" style={{ color: summary.tier.badgeColor }}>{summary.tier.name}</span></p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#f2e4d4]">
          <div className="h-full bg-[#C97B4A]" style={{ width: `${summary.progressToNextTier}%` }}></div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <select className="rounded-xl border border-[#d9c6af] px-3 py-2" value={sortBy} onChange={(event) => { setPage(1); setSortBy(event.target.value); }}>
            <option value="createdAt">Newest</option>
            <option value="points">Points</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
          </select>
          <select className="rounded-xl border border-[#d9c6af] px-3 py-2" value={sortOrder} onChange={(event) => { setPage(1); setSortOrder(event.target.value); }}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e5d5c0]">
                <th className="py-2">Type</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Points</th>
                <th className="py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-[#f1e4d5]">
                  <td className="py-2 capitalize">{transaction.type}</td>
                  <td className="py-2">₹{transaction.amount}</td>
                  <td className="py-2">{transaction.points}</td>
                  <td className="py-2">{new Date(transaction.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button type="button" onClick={() => { const next = Math.max(1, page - 1); setPage(next); loadTransactions(next); }} disabled={page <= 1} className="rounded-lg border border-[#d9c6af] px-3 py-1 disabled:opacity-40">Prev</button>
          <span className="text-sm">Page {page} / {pagination.pages || 1}</span>
          <button type="button" onClick={() => { const next = Math.min(pagination.pages || 1, page + 1); setPage(next); loadTransactions(next); }} disabled={page >= (pagination.pages || 1)} className="rounded-lg border border-[#d9c6af] px-3 py-1 disabled:opacity-40">Next</button>
        </div>
      </section>
    </div>
  );
}
