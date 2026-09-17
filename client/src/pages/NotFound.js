import React from 'react';
import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="empty-state page-width not-found"><span className="eyebrow">404 · OFF MENU</span><h2>That page is not on today’s board.</h2><p>Head back to the counter and keep the good things moving.</p><Link className="button primary" to="/">Back to home</Link></div>; }