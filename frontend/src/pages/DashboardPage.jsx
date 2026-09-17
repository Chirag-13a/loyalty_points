import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export function DashboardPage() {
  const [phone, setPhone] = useState('');
  const [member, setMember] = useState(null);
  const [summary, setSummary] = useState(null);
  const [amount, setAmount] = useState('');
  const [rewards, setRewards] = useState([]);
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/rewards/items').then((response) => {
      setRewards(response.data);
      setItemId(response.data[0]?._id || '');
    });
  }, []);

  const findMember = async () => {
    setError('');
    const { data } = await api.get('/members', { params: { search: phone, limit: 1, sortBy: 'createdAt', sortOrder: 'desc' } });
    const found = data.data[0];
    if (!found) {
      setError('No member found for this phone number');
      setMember(null);
      setSummary(null);
      return;
    }

    const details = await api.get(`/members/${found._id}`);
    setMember(details.data.member);
    setSummary(details.data.summary);
  };

  const refreshMember = async (memberId) => {
    const details = await api.get(`/members/${memberId}`);
    setMember(details.data.member);
    setSummary(details.data.summary);
  };

  const recordPurchase = async () => {
    if (!member) return;
    await api.post(`/members/${member._id}/purchase`, { amount: Number(amount) });
    setAmount('');
    await refreshMember(member._id);
  };

  const redeem = async () => {
    if (!member || !itemId) return;
    await api.post(`/members/${member._id}/redeem`, { itemId, quantity: Number(quantity) });
    await refreshMember(member._id);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Counter Dashboard</h1>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            className="flex-1 rounded-xl border border-[#d9c6af] px-3 py-2"
            placeholder="Search member by phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <button type="button" onClick={findMember} className="rounded-xl bg-[#C97B4A] px-4 py-2 font-semibold text-white">
            Search
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      {member && summary && (
        <section className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{member.name}</h2>
                <p className="text-sm">{member.phone}</p>
              </div>
              <Link className="text-sm font-semibold underline" to={`/members/${member._id}`}>View full profile</Link>
            </div>
            <p className="mt-5 text-sm">Current Balance</p>
            <p className="text-4xl font-bold text-[#C97B4A]">{summary.pointsBalance} pts</p>
            <p className="mt-2 text-sm">Tier: <span className="font-semibold" style={{ color: summary.tier.badgeColor }}>{summary.tier.name}</span></p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#f2e4d4]">
              <div className="h-full bg-[#C97B4A]" style={{ width: `${summary.progressToNextTier}%` }}></div>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold">Record Purchase</h3>
            <input
              className="mt-2 w-full rounded-xl border border-[#d9c6af] px-3 py-2"
              type="number"
              min="1"
              placeholder="Amount in ₹"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <button type="button" onClick={recordPurchase} className="mt-2 w-full rounded-xl bg-[#3E2723] px-4 py-2 font-semibold text-white">Add Points</button>

            <h3 className="mt-5 font-semibold">Redeem Points</h3>
            <select className="mt-2 w-full rounded-xl border border-[#d9c6af] px-3 py-2" value={itemId} onChange={(event) => setItemId(event.target.value)}>
              {rewards.map((item) => (
                <option key={item._id} value={item._id}>{item.name} ({item.pointsCost} pts)</option>
              ))}
            </select>
            <input
              className="mt-2 w-full rounded-xl border border-[#d9c6af] px-3 py-2"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
            <button type="button" onClick={redeem} className="mt-2 w-full rounded-xl bg-[#C97B4A] px-4 py-2 font-semibold text-white">Redeem</button>
          </article>
        </section>
      )}
    </div>
  );
}
