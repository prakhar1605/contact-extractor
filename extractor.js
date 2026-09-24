function cleanLinkedInUrl(value) {
  let url = value.replace(/[.,;:!?]+$/g, '');
  while (/[)\]}]$/.test(url)) url = url.slice(0, -1);
  try {
    const parsed = new URL(/^https?:\/\//i.test(url) ? url : 'https://' + url);
    if (!/(^|\.)linkedin\.com$/i.test(parsed.hostname)) return '';
    parsed.hash = '';
    return parsed.href;
  } catch {
    return '';
  }
}

function plainLine(line) {
  return line.replace(/\\@/g, '@').replace(/\*\*/g, '').replace(/^\s*[-•]\s*/, '').trim();
}

function profileName(line) {
  const match = plainLine(line).match(/^(.+?)['’]s\s+profile\s*$/i);
  return match ? match[1].trim() : '';
}

function nameFromLinkedIn(url) {
  if (!url) return '';
  const match = new URL(url).pathname.match(/^\/(?:in|pub)\/([^/]+)/i);
  if (!match) return '';
  return decodeURIComponent(match[1])
    .replace(/-\d{5,}$/, '')
    .split(/[-_]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function splitIntoProfiles(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const hasProfileHeaders = lines.some(line => profileName(line));
  if (hasProfileHeaders) {
    const blocks = [];
    let current = [];
    for (const line of lines) {
      if (profileName(line) && current.some(item => item.trim())) {
        blocks.push(current.join('\n'));
        current = [];
      }
      current.push(line);
    }
    if (current.some(item => item.trim())) blocks.push(current.join('\n'));
    return blocks;
  }
  const blocks = text.split(/\n\s*\n+/).filter(block => block.trim());
  return blocks.flatMap(block => {
    const blockLines = block.split(/\n+/).filter(line => line.trim());
    const contactLine = line => /@|linkedin\.com/i.test(line);
    return blockLines.length > 1 && blockLines.every(contactLine) ? blockLines : [block];
  });
}

function extractContacts(text) {
  const emailPattern = /(?<![\w.+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![\w.-])/gi;
  const linkedInPattern = /(?<![\w@.-])(?:https?:\/\/)?(?:[\w-]+\.)?linkedin\.com(?:\/[^\s<>"'`\[\]()]+)?/gi;
  const rows = [];
  const seen = new Set();

  for (const block of splitIntoProfiles(text.replace(/\\@/g, '@'))) {
    const lines = block.split(/\n+/).map(plainLine).filter(Boolean);
    const scanText = block.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$2');
    const emails = [...scanText.matchAll(emailPattern)].map(match => match[0]);
    const links = [...scanText.matchAll(linkedInPattern)]
      .map(match => cleanLinkedInUrl(match[0]))
      .filter(Boolean);
    if (!emails.length && !links.length) continue;

    let name = lines.map(profileName).find(Boolean) || '';
    let company = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!name) {
        const match = line.match(/^name\s*[:：-]\s*(.*)$/i);
        if (match) name = match[1] || lines[i + 1] || '';
      }
      if (!company) {
        const match = line.match(/^(?:(?:current|present)\s+)?company(?:\s+name)?\s*[:：-]?\s*(.*)$/i);
        if (match) company = match[1] || lines[i + 1] || '';
      }
    }
    if (!company) {
      const headline = lines.find(line => /\s+at\s+[^@]+$/i.test(line) && !/linkedin\.com|connected since/i.test(line));
      if (headline) company = headline.match(/\s+at\s+(.+)$/i)[1].split(/\s+[·|]\s+/)[0].trim();
    }
    if (!name) name = nameFromLinkedIn(links[0]);
    company = company.replace(/^\*+|\*+$/g, '').trim();

    for (let i = 0; i < Math.max(emails.length, links.length); i++) {
      const email = emails[i] || '';
      const linkedin = links[i] || (emails.length > 1 ? links[0] || '' : '');
      const key = (email || linkedin).toLowerCase().replace(/\/$/, '');
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({name, company, email, linkedin});
    }
  }
  return rows;
}

function getUniqueAdditions(existingRows, incomingRows) {
  const emailKey = value => String(value || '').trim().toLowerCase();
  const linkKey = value => {
    if (!value) return '';
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value);
      return url.hostname.toLowerCase().replace(/^www\./, '') + url.pathname.toLowerCase().replace(/\/$/, '');
    } catch {
      return String(value).trim().toLowerCase().replace(/\/$/, '');
    }
  };
  const emails = new Set(existingRows.map(row => emailKey(row.email)).filter(Boolean));
  const links = new Set(existingRows.map(row => linkKey(row.linkedin)).filter(Boolean));
  return incomingRows.filter(row => {
    const email = emailKey(row.email);
    const link = linkKey(row.linkedin);
    if ((email && emails.has(email)) || (link && links.has(link))) return false;
    if (email) emails.add(email);
    if (link) links.add(link);
    return true;
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {extractContacts, cleanLinkedInUrl, getUniqueAdditions};
}
