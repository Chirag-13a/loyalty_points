const { Tier, RedemptionItem, Offer, MenuItem } = require('./models');
async function seedCatalog() {
  const tiers = [
    { name: 'Bronze', threshold: 0, multiplier: 1, tone: 'bronze' },
    { name: 'Silver', threshold: 500, multiplier: 1.25, tone: 'silver' },
    { name: 'Gold', threshold: 1500, multiplier: 1.5, tone: 'gold' }
  ];
  for (const tier of tiers) await Tier.updateOne({ name: tier.name }, tier, { upsert: true });
  for (const item of [
    { name: 'Free espresso', cost: 80, category: 'Drinks', description: 'A double shot, on us.', imageUrl: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Pastry pick', cost: 120, category: 'Bakery', description: 'Choose any pastry from the counter.', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80' },
    { name: 'Signature latte', cost: 180, category: 'Drinks', description: 'Our seasonal latte, made your way.', imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=80' },
    { name: 'Brunch for two', cost: 450, category: 'Food', description: 'Two mains and two coffees.', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=80' }
  ]) await RedemptionItem.updateOne({ name: item.name }, item, { upsert: true });
  if (await Offer.countDocuments() === 0) await Offer.insertMany([
    { title: 'Double points weekend', description: 'Every Saturday and Sunday, your purchases earn twice the usual points.', validTill: new Date('2026-12-31'), imageUrl: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=80' },
    { title: 'Birthday pastry', description: 'A little something sweet on your birthday month.', validTill: new Date('2026-12-31'), imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80' }
  ]);
  const menu = [
    { name: 'Flat white', category: 'Coffee', price: 180, description: 'Velvety espresso with silky steamed milk.', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
    { name: 'Cold brew', category: 'Coffee', price: 220, description: 'Slow-steeped, smooth, and quietly bold.', imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Masala chai', category: 'Tea', price: 160, description: 'Black tea, warm spice, and a little comfort.', imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80' },
    { name: 'Almond croissant', category: 'Pastries', price: 240, description: 'Buttery layers with toasted almond cream.', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' },
    { name: 'Avocado toast', category: 'Snacks', price: 320, description: 'Sourdough, avocado, herbs, and lemon.', imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80' }
  ];
  for (const item of menu) await MenuItem.updateOne({ name: item.name }, item, { upsert: true });
}
module.exports = { seedCatalog };