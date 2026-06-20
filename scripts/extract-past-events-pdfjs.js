#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractWithPdfjs(pdfPath) {
  const loadingTask = pdfjsLib.getDocument(pdfPath);
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join('\n') + '\n\n';
  }

  return fullText;
}

function parseEventsFromText(text) {
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

  const monthNames = '(?:Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|Sept|September|Oct|October|Nov|November|Dec|December)';
  const dateRegexes = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/, // 12/05/2023
    new RegExp(`\\b(${monthNames}\\s+\d{1,2},?\\s+\d{4})\\b`, 'i'), // July 5, 2023
    /\b(\d{4}-\d{2}-\d{2})\b/, // 2023-07-05
    /\b(\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\d{4})\b/i,
  ];

  const events = [];
  for (const block of blocks) {
    let foundDate = null;
    for (const rx of dateRegexes) {
      const m = block.match(rx);
      if (m) {
        foundDate = m[1] || m[0];
        break;
      }
    }

    if (foundDate) {
      const lines = block.split(/\n+/).map(l => l.trim()).filter(Boolean);
      const title = lines[0] || block.substring(0, 60);
      let location = '';
      let description = lines.slice(1).join(' ');
      for (const line of lines) {
        if (/location[:\-]/i.test(line) || /venue[:\-]/i.test(line)) {
          location = line.replace(/location[:\-]/i, '').replace(/venue[:\-]/i, '').trim();
          break;
        }
      }
      events.push({ title, date: foundDate, location, description });
    }
  }

  if (events.length === 0) {
    const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/\b(Event|Drive|Camp|Camp:)\b/i.test(line)) {
        const title = line;
        const next = lines.slice(i+1, i+4).join(' ');
        const m = next.match(new RegExp(`(\\d{1,2}[\\/\\-]\\d{1,2}[\\/\\-]\\d{2,4}|\\d{4}-\\d{2}-\\d{2}|${monthNames} \\d{1,2},? \\d{4})`, 'i'));
        const date = m ? m[0] : '';
        events.push({ title, date, location: '', description: next });
      }
    }
  }

  return events;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node extract-past-events-pdfjs.js <path-to-pdf>');
    process.exit(1);
  }

  const pdfPath = args[0];
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF not found at', pdfPath);
    process.exit(1);
  }

  try {
    const text = await extractWithPdfjs(pdfPath);
    const events = parseEventsFromText(text);
    const outDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    const outPath = path.join(outDir, 'past-events.json');
    fs.writeFileSync(outPath, JSON.stringify(events, null, 2), 'utf8');
    console.log(`Wrote ${events.length} events to ${outPath}`);
  } catch (err) {
    console.error('Failed to extract PDF with pdfjs:', err);
    process.exit(1);
  }
}

main();
