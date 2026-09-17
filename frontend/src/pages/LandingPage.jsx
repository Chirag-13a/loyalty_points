export function LandingPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">Café Loyalty Points</h1>
        <p className="mt-3 text-lg">A rewards management SPA for café counters to track purchases, tier upgrades, and point redemptions in real-time.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Key Features</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Instant points earning at checkout with tier multipliers.</li>
            <li>Auto-upgrade from Bronze to Silver and Gold.</li>
            <li>Reward catalog redemption with insufficient-balance protection.</li>
            <li>Fast member lookup by phone, with pagination and sorting.</li>
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Who It Helps</h2>
          <p className="mt-3">Built for counter staff and store managers handling high member volume who need accurate balances and quick service on tablets.</p>
        </article>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">What’s Next (Planned)</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Multi-branch analytics dashboard.</li>
          <li>Expiry rules and automated reminder campaigns.</li>
          <li>Member self-service portal for digital rewards cards.</li>
        </ol>
      </section>
    </div>
  );
}
