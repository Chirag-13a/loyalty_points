import { useEffect, useState } from 'react';
import { api } from '../api';

export function RewardsPage() {
  const [tiers, setTiers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [tierRes, itemRes] = await Promise.all([api.get('/rewards/tiers'), api.get('/rewards/items')]);
      setTiers(tierRes.data);
      setItems(itemRes.data);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Tiers</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier._id} className="rounded-xl border border-[#eadbc8] p-4">
              <p className="font-semibold" style={{ color: tier.badgeColor }}>{tier.name}</p>
              <p className="text-sm">Multiplier: x{tier.multiplier}</p>
              <p className="text-sm">From {tier.minPoints} points</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Rewards Catalog</h1>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-xl border border-[#eadbc8] p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm">{item.pointsCost} pts</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
