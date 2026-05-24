const CONFIG = {
  host: process.env.INDEXNOW_HOST || 'akime.com.au',
  key: process.env.INDEXNOW_KEY || '960644cc75ba4227bd3489d09613c336',
  keyLocation:
    process.env.INDEXNOW_KEY_LOCATION ||
    'https://akime.com.au/960644cc75ba4227bd3489d09613c336.txt',
  sitemapUrl: process.env.INDEXNOW_SITEMAP_URL || 'https://akime.com.au/sitemap.xml',
  endpoint: process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/IndexNow',
};

const MAX_BATCH_SIZE = 10000;

async function main() {
  const urls = await fetchSitemapUrls(CONFIG.sitemapUrl);
  const filteredUrls = urls.filter((url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '') === CONFIG.host.replace(/^www\./, '');
    } catch {
      return false;
    }
  });

  if (!filteredUrls.length) {
    throw new Error(`No URLs found for host ${CONFIG.host} in ${CONFIG.sitemapUrl}`);
  }

  console.log(`Found ${urls.length} sitemap URLs; submitting ${filteredUrls.length} URLs for ${CONFIG.host}.`);

  for (let index = 0; index < filteredUrls.length; index += MAX_BATCH_SIZE) {
    const batch = filteredUrls.slice(index, index + MAX_BATCH_SIZE);
    await submitBatch(batch);
  }
}

async function fetchSitemapUrls(sitemapUrl, seen = new Set()) {
  if (seen.has(sitemapUrl)) {
    return [];
  }
  seen.add(sitemapUrl);

  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch sitemap ${sitemapUrl}: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => decodeXml(match[1]));

  if (/<sitemapindex[\s>]/i.test(xml)) {
    const nested = await Promise.all(locs.map((loc) => fetchSitemapUrls(loc, seen)));
    return nested.flat();
  }

  return locs;
}

async function submitBatch(urlList) {
  const response = await fetch(CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      host: CONFIG.host,
      key: CONFIG.key,
      keyLocation: CONFIG.keyLocation,
      urlList,
    }),
  });

  const body = await response.text();
  console.log(`IndexNow response: ${response.status} ${response.statusText}`);

  if (body) {
    console.log(body);
  }

  if (!response.ok) {
    throw new Error(`IndexNow submission failed with ${response.status} ${response.statusText}`);
  }
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
