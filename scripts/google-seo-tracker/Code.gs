const CONFIG = {
  // Use the exact property string from Google Search Console.
  // For DNS/domain properties this usually looks like: sc-domain:akime.com.au
  SEARCH_CONSOLE_SITE_URL: 'sc-domain:akime.com.au',
  SITE_HOME_URL: 'https://akime.com.au/',
  SITEMAP_URL: 'https://akime.com.au/sitemap.xml',
  DOMAIN: 'akime.com.au',
  SHEET_ID: '',
  LOOKBACK_DAYS: 28,
  MAX_URLS_TO_INSPECT: 100,
};

const SHEETS = {
  baseline: 'Baseline',
  searchConsoleDaily: 'Search Console Daily',
  urlInspection: 'URL Inspection',
};

const HEADERS = {
  baseline: [
    'Recorded At',
    'Property',
    'GSC Date Range',
    'Sitemap URLs Found',
    'URLs Inspected',
    'Indexed URLs',
    'GSC Clicks',
    'GSC Impressions',
    'GSC CTR',
    'GSC Avg Position',
    'Domain Created',
    'Domain Age Days',
    'Mobile Performance',
    'Desktop Performance',
    'Mobile LCP',
    'Mobile INP',
    'Mobile CLS',
    'Desktop LCP',
    'Desktop INP',
    'Desktop CLS',
    'Notes',
  ],
  searchConsoleDaily: [
    'Date',
    'Clicks',
    'Impressions',
    'CTR',
    'Avg Position',
  ],
  urlInspection: [
    'Recorded At',
    'URL',
    'Verdict',
    'Coverage State',
    'Robots State',
    'Indexing State',
    'Last Crawl',
    'Page Fetch State',
    'Google Canonical',
    'User Canonical',
    'Error',
  ],
};

function setupSeoTracker() {
  Object.keys(SHEETS).forEach(function (key) {
    getSheet_(SHEETS[key], HEADERS[key]);
  });
}

function recordBaseline() {
  setupSeoTracker();

  const now = new Date();
  const range = getGscDateRange_();
  const searchTotals = fetchSearchConsoleTotals_(range.startDate, range.endDate);
  const sitemapUrls = fetchSitemapUrls_(CONFIG.SITEMAP_URL, CONFIG.MAX_URLS_TO_INSPECT);
  const inspections = inspectUrls_(sitemapUrls);
  const indexedCount = inspections.filter(function (item) {
    return isIndexedInspection_(item);
  }).length;
  const domainInfo = fetchDomainAge_();
  const mobilePsi = fetchPageSpeed_(CONFIG.SITE_HOME_URL, 'mobile');
  const desktopPsi = fetchPageSpeed_(CONFIG.SITE_HOME_URL, 'desktop');

  appendRows_(SHEETS.urlInspection, inspections.map(function (item) {
    return [
      now,
      item.url,
      item.verdict,
      item.coverageState,
      item.robotsTxtState,
      item.indexingState,
      item.lastCrawlTime,
      item.pageFetchState,
      item.googleCanonical,
      item.userCanonical,
      item.error,
    ];
  }));

  appendRows_(SHEETS.baseline, [[
    now,
    CONFIG.SEARCH_CONSOLE_SITE_URL,
    range.startDate + ' to ' + range.endDate,
    sitemapUrls.length,
    inspections.length,
    indexedCount,
    searchTotals.clicks,
    searchTotals.impressions,
    searchTotals.ctr,
    searchTotals.position,
    domainInfo.createdDate,
    domainInfo.ageDays,
    mobilePsi.performance,
    desktopPsi.performance,
    mobilePsi.lcp,
    mobilePsi.inp,
    mobilePsi.cls,
    desktopPsi.lcp,
    desktopPsi.inp,
    desktopPsi.cls,
    buildBaselineNotes_(sitemapUrls, inspections, mobilePsi, desktopPsi, domainInfo),
  ]]);

  recordSearchConsoleDaily_(range.startDate, range.endDate);
}

function recordSearchConsoleDaily(startDate, endDate) {
  setupSeoTracker();
  const range = getGscDateRange_();
  recordSearchConsoleDaily_(
    startDate || range.startDate,
    endDate || range.endDate
  );
}

function createWeeklyMondayTrigger() {
  ScriptApp.newTrigger('recordBaseline')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
}

function recordSearchConsoleDaily_(startDate, endDate) {
  const response = searchConsoleQuery_({
    startDate: startDate,
    endDate: endDate,
    dimensions: ['date'],
    searchType: 'web',
    rowLimit: 25000,
  });

  const rows = (response.rows || []).map(function (row) {
    return [
      row.keys[0],
      row.clicks || 0,
      row.impressions || 0,
      row.ctr || 0,
      row.position || 0,
    ];
  });

  appendRows_(SHEETS.searchConsoleDaily, rows);
}

function fetchSearchConsoleTotals_(startDate, endDate) {
  const response = searchConsoleQuery_({
    startDate: startDate,
    endDate: endDate,
    searchType: 'web',
    rowLimit: 1,
  });

  const row = response.rows && response.rows.length ? response.rows[0] : {};
  return {
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  };
}

function searchConsoleQuery_(payload) {
  const url = 'https://www.googleapis.com/webmasters/v3/sites/' +
    encodeURIComponent(CONFIG.SEARCH_CONSOLE_SITE_URL) +
    '/searchAnalytics/query';

  return googleJsonFetch_(url, {
    method: 'post',
    payload: JSON.stringify(payload),
    contentType: 'application/json',
  });
}

function inspectUrls_(urls) {
  return urls.map(function (url) {
    try {
      const response = googleJsonFetch_('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
        method: 'post',
        payload: JSON.stringify({
          inspectionUrl: url,
          siteUrl: CONFIG.SEARCH_CONSOLE_SITE_URL,
        }),
        contentType: 'application/json',
      });

      const status = response.inspectionResult &&
        response.inspectionResult.indexStatusResult ?
        response.inspectionResult.indexStatusResult :
        {};

      Utilities.sleep(250);

      return {
        url: url,
        verdict: status.verdict || '',
        coverageState: status.coverageState || '',
        robotsTxtState: status.robotsTxtState || '',
        indexingState: status.indexingState || '',
        lastCrawlTime: status.lastCrawlTime || '',
        pageFetchState: status.pageFetchState || '',
        googleCanonical: status.googleCanonical || '',
        userCanonical: status.userCanonical || '',
        error: '',
      };
    } catch (error) {
      return {
        url: url,
        verdict: '',
        coverageState: '',
        robotsTxtState: '',
        indexingState: '',
        lastCrawlTime: '',
        pageFetchState: '',
        googleCanonical: '',
        userCanonical: '',
        error: error.message,
      };
    }
  });
}

function isIndexedInspection_(item) {
  const verdict = String(item.verdict || '').toUpperCase();
  const coverage = String(item.coverageState || '').toLowerCase();
  return verdict === 'PASS' || coverage.indexOf('indexed') !== -1;
}

function fetchSitemapUrls_(sitemapUrl, maxUrls) {
  const response = UrlFetchApp.fetch(sitemapUrl, { muteHttpExceptions: true });
  if (response.getResponseCode() >= 300) {
    throw new Error('Could not fetch sitemap: ' + response.getResponseCode());
  }

  const xml = XmlService.parse(response.getContentText());
  const root = xml.getRootElement();
  const namespace = root.getNamespace();
  const rootName = root.getName();

  if (rootName === 'sitemapindex') {
    const sitemapLocs = root.getChildren('sitemap', namespace)
      .map(function (entry) {
        return textOf_(entry, 'loc', namespace);
      })
      .filter(Boolean);

    return sitemapLocs.reduce(function (allUrls, childSitemap) {
      if (allUrls.length >= maxUrls) {
        return allUrls;
      }
      return allUrls.concat(fetchSitemapUrls_(childSitemap, maxUrls - allUrls.length));
    }, []).slice(0, maxUrls);
  }

  return root.getChildren('url', namespace)
    .map(function (entry) {
      return textOf_(entry, 'loc', namespace);
    })
    .filter(Boolean)
    .slice(0, maxUrls);
}

function fetchPageSpeed_(pageUrl, strategy) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('PAGESPEED_API_KEY') || '';
  let url = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed' +
    '?url=' + encodeURIComponent(pageUrl) +
    '&strategy=' + encodeURIComponent(strategy) +
    '&category=performance' +
    '&category=seo';

  if (apiKey) {
    url += '&key=' + encodeURIComponent(apiKey);
  }

  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    if (response.getResponseCode() >= 300) {
      throw new Error('PageSpeed failed: ' + response.getResponseCode());
    }

    const data = JSON.parse(response.getContentText());
    const field = data.loadingExperience || data.originLoadingExperience || {};
    const fieldMetrics = field.metrics || {};
    const categories = data.lighthouseResult && data.lighthouseResult.categories ?
      data.lighthouseResult.categories :
      {};

    return {
      performance: scoreToPercent_(categories.performance && categories.performance.score),
      seo: scoreToPercent_(categories.seo && categories.seo.score),
      lcp: metricMs_(fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS),
      inp: metricMs_(fieldMetrics.INTERACTION_TO_NEXT_PAINT),
      cls: metricCls_(fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE),
      error: '',
    };
  } catch (error) {
    return {
      performance: '',
      seo: '',
      lcp: '',
      inp: '',
      cls: '',
      error: error.message,
    };
  }
}

function fetchDomainAge_() {
  const endpoints = [
    'https://rdap.org/domain/' + encodeURIComponent(CONFIG.DOMAIN),
    'https://rdap.auda.org.au/domain/' + encodeURIComponent(CONFIG.DOMAIN),
  ];

  for (let i = 0; i < endpoints.length; i += 1) {
    try {
      const response = UrlFetchApp.fetch(endpoints[i], { muteHttpExceptions: true });
      if (response.getResponseCode() >= 300) {
        continue;
      }

      const data = JSON.parse(response.getContentText());
      const event = (data.events || []).find(function (item) {
        return /registration|created/i.test(item.eventAction || '');
      });

      if (!event || !event.eventDate) {
        continue;
      }

      const created = new Date(event.eventDate);
      return {
        createdDate: formatDate_(created),
        ageDays: Math.floor((new Date().getTime() - created.getTime()) / 86400000),
        error: '',
      };
    } catch (error) {
      // Try the next RDAP endpoint.
    }
  }

  return {
    createdDate: '',
    ageDays: '',
    error: 'Domain age unavailable from RDAP',
  };
}

function googleJsonFetch_(url, options) {
  const finalOptions = options || {};
  finalOptions.headers = finalOptions.headers || {};
  finalOptions.headers.Authorization = 'Bearer ' + ScriptApp.getOAuthToken();
  finalOptions.muteHttpExceptions = true;

  const response = UrlFetchApp.fetch(url, finalOptions);
  const code = response.getResponseCode();
  const body = response.getContentText();

  if (code >= 300) {
    throw new Error('Google API error ' + code + ': ' + body);
  }

  return body ? JSON.parse(body) : {};
}

function getGscDateRange_() {
  const end = new Date();
  end.setDate(end.getDate() - 3);

  const start = new Date(end);
  start.setDate(start.getDate() - CONFIG.LOOKBACK_DAYS + 1);

  return {
    startDate: formatDate_(start),
    endDate: formatDate_(end),
  };
}

function getSheet_(name, headers) {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = existingHeaders.some(function (value) {
    return value !== '';
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function appendRows_(sheetName, rows) {
  if (!rows || !rows.length) {
    return;
  }

  const key = Object.keys(SHEETS).find(function (item) {
    return SHEETS[item] === sheetName;
  });
  const sheet = getSheet_(sheetName, HEADERS[key]);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function getSpreadsheet_() {
  if (CONFIG.SHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SHEET_ID);
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Set CONFIG.SHEET_ID or run this script from a bound Google Sheet.');
  }

  return spreadsheet;
}

function textOf_(element, childName, namespace) {
  const child = element.getChild(childName, namespace);
  return child ? child.getText() : '';
}

function scoreToPercent_(score) {
  if (score === null || score === undefined || score === '') {
    return '';
  }
  return Math.round(Number(score) * 100);
}

function metricMs_(metric) {
  if (!metric || metric.percentile === undefined) {
    return '';
  }
  return Math.round(metric.percentile) + ' ms';
}

function metricCls_(metric) {
  if (!metric || metric.percentile === undefined) {
    return '';
  }
  return (Number(metric.percentile) / 100).toFixed(2);
}

function formatDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function buildBaselineNotes_(sitemapUrls, inspections, mobilePsi, desktopPsi, domainInfo) {
  const notes = [];

  if (sitemapUrls.length >= CONFIG.MAX_URLS_TO_INSPECT) {
    notes.push('URL Inspection capped at ' + CONFIG.MAX_URLS_TO_INSPECT + ' sitemap URLs.');
  }

  const inspectionErrors = inspections.filter(function (item) {
    return item.error;
  }).length;
  if (inspectionErrors) {
    notes.push(inspectionErrors + ' URL Inspection requests failed.');
  }

  if (mobilePsi.error) {
    notes.push('Mobile PageSpeed: ' + mobilePsi.error);
  }

  if (desktopPsi.error) {
    notes.push('Desktop PageSpeed: ' + desktopPsi.error);
  }

  if (domainInfo.error) {
    notes.push(domainInfo.error);
  }

  return notes.join(' ');
}
