const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const file = path.join(__dirname, 'data/store.json');

function read() { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function write(data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); return data; }
function id(prefix) { return `${prefix}-${crypto.randomUUID()}`; }
function now() { return new Date().toISOString(); }
function isMongoReady(mongoose) { return mongoose.connection.readyState === 1; }
function tierFor(data, points) { return [...data.tiers].sort((a, b) => b.threshold - a.threshold).find(tier => points >= tier.threshold) || data.tiers[0]; }
module.exports = { read, write, id, now, isMongoReady, tierFor };
