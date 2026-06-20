#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const keywords = [
  'blood donation',
  'donation camp',
  'vaccination',
  'food',
  'distributed',
  'drive',
  'camp',
  'health',
  'clinic',
  'diagnostics',
  'x-ray',
  'pathology',
  'food grain',
  'vaccination camp',
  'blood donation camp',
];

function paragraphMatches(paragraph) {
  const p = paragraph.toLowerCase();
  return keywords.some(k => p.includes(k));
}

function titleFromParagraph(paragraph) {
  const lines = paragraph.split(/\n+/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'Past activity';
  let candidate = lines[0];
  // remove bullets and leading symbols
  candidate = candidate.replace(/^[-•\u2022\s]+/, '').trim();
  // collapse multiple spaces and newlines
  candidate = candidate.replace(/\s+/g, ' ');
  // shorten if too long
  if (candidate.length > 80) candidate = candidate.substring(0, 77) + '...';
  // Title-case if fully uppercase (improve readability)
  if (candidate === candidate.toUpperCase()) {
    candidate = candidate.toLowerCase().replace(/(^|\s)\S/g, s => s.toUpperCase());
  }
  return candidate;
}

function chooseImage(paragraph) {
  const p = paragraph.toLowerCase();
  if (p.includes('blood')) return 'https://images.unsplash.com/photo-1582719478250-58a4b37f5b5f?auto=format&fit=crop&w=1200&q=80';
  if (p.includes('vaccin')) return 'https://images.unsplash.com/photo-1586773860415-9a6b6a1d2b2f?auto=format&fit=crop&w=1200&q=80';
  if (p.includes('food') || p.includes('grain')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80';
  if (p.includes('clinic') || p.includes('health') || p.includes('diagnostics') || p.includes('x-ray')) return 'https://images.unsplash.com/photo-1586773860410-b6b2b8d6b1c1?auto=format&fit=crop&w=1200&q=80';
  return 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80';
}

function extractDocDate(text) {
  const monthNames = '(?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|Sept|September|Oct|October|Nov|November|Dec|December)';
  const rx = new RegExp(`(${monthNames}(?:\s*-\s*${monthNames})?\s+\d{4})`, 'i');
  const m = text.match(rx);
  if (m) return m[1];
  const yearMatch = text.match(/\b(\d{4})\b/);
  return yearMatch ? yearMatch[1] : '';
}

function parseText(text) {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const events = [];
  const seen = new Set();
  const docDate = extractDocDate(text);

  for (const p of paragraphs) {
    if (paragraphMatches(p)) {
      const title = titleFromParagraph(p);
      const key = title + '|' + p.slice(0, 120);
      if (seen.has(key)) continue;
      seen.add(key);
      // Try to extract a date inside the paragraph
      const dateMatch = p.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i);
      const date = dateMatch ? dateMatch[0] : docDate || '';
      const imageUrl = chooseImage(p);
      events.push({ title, date, location: '', description: p, imageUrl });
    }
  }

  return events;
}

function main() {
  const txtPath = path.join(__dirname, '..', 'data', 'past-events.txt');
  if (!fs.existsSync(txtPath)) {
    console.error('Text file not found:', txtPath);
    process.exit(1);
  }
  const text = fs.readFileSync(txtPath, 'utf8');
  const events = parseText(text);
  const outPath = path.join(__dirname, '..', 'data', 'past-events.json');
  fs.writeFileSync(outPath, JSON.stringify(events, null, 2), 'utf8');
  console.log(`Wrote ${events.length} events to ${outPath}`);
}

main();
