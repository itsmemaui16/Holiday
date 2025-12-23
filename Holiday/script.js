const API_KEY = '0m2JhJJ6KjapV6IuwHToOzLlC63XLoLm';
const countryAPI = 'https://restcountries.com/v3.1/all?fields=name,cca2,flags,capital,region,subregion,languages,currencies,population';
const holidayAPI = 'https://calendarific.com/api/v2/holidays';

let allCountries = [];
let currentCountry = null;

const mainView = document.getElementById('mainView');
const detailView = document.getElementById('detailView');
const countryBody = document.getElementById('countryBody');
const holidayBody = document.getElementById('holidayBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const backBtn = document.getElementById('backBtn');
const countryFlag = document.getElementById('countryFlag');
const countryName = document.getElementById('countryName');
const countryCode = document.getElementById('countryCode');
const countryInfo = document.getElementById('countryInfo');
const countryBackground = document.getElementById('countryBackground');
const holidaySearch = document.getElementById('holidaySearch');
const animatedBackground = document.getElementById('animatedBackground');

async function fetchCountries() {
  try {
    const res = await fetch(countryAPI);
    allCountries = await res.json();
    renderCountryTable(allCountries);
  } catch (err) {
    alert('Failed to fetch countries');
    console.error(err);
  }
}

function renderCountryTable(data) {
  countryBody.innerHTML = '';
  data.forEach(c => {
    const langs = c.languages ? Object.values(c.languages).join(', ') : '-';
    const currs = c.currencies ? Object.values(c.currencies).map(cu => cu.name).join(', ') : '-';
    const regions = [c.region, c.subregion].filter(Boolean);
    countryBody.innerHTML += `
      <tr>
        <td>${c.cca2}</td>
        <td><img src="${c.flags.svg}" width="30" alt="flag"> ${c.name.common}</td>
        <td>${langs}</td>
        <td>${currs}</td>
        <td><button class="viewRegionsBtn" data-code="${c.cca2}">View Regions</button></td>
        <td><button class="viewHolidaysBtn" data-code="${c.cca2}">View Holiday List</button></td>
      </tr>
    `;
  });
}

function performSearch(query) {
  const q = query.trim();
  if (!q) {
    renderCountryTable(allCountries);
    return;
  }

  const queryLower = q.toLowerCase();
  const filtered = allCountries.filter(c => {
    return c.name.common.toLowerCase().includes(queryLower) ||
           (c.capital && c.capital[0].toLowerCase().includes(queryLower)) ||
           c.region.toLowerCase().includes(queryLower) ||
           c.cca2.toLowerCase() === queryLower;
  });

  if (filtered.length === 0) {
    countryBody.innerHTML = '<tr><td colspan="6">No countries found</td></tr>';
    return;
  }

  renderCountryTable(filtered);

  const exact = allCountries.find(c => c.name.common.toLowerCase() === queryLower || c.cca2.toLowerCase() === queryLower);
  if (exact) {
    loadCountryDetails(exact.cca2);
    return;
  }

  if (filtered.length === 1) {
    loadCountryDetails(filtered[0].cca2);
  }
} 

function liveFilter(query) {
  const q = query.trim();
  if (!q) {
    renderCountryTable(allCountries);
    return;
  }

  const queryLower = q.toLowerCase();
  const filtered = allCountries.filter(c => c.name.common.toLowerCase().startsWith(queryLower));

  if (filtered.length === 0) {
    countryBody.innerHTML = '<tr><td colspan="6">No countries found</td></tr>';
    return;
  }

  renderCountryTable(filtered);
}

async function loadCountryDetails(code) {
  const country = allCountries.find(c => c.cca2 === code);
  if (!country) return;

  currentCountry = country;
  mainView.classList.add('hidden');
  detailView.classList.remove('hidden');

  countryFlag.src = country.flags.svg;
  countryName.textContent = country.name.common;
  countryCode.textContent = `Code: ${country.cca2}`;
  countryInfo.textContent = `Capital: ${country.capital ? country.capital[0] : '-'}, Region: ${country.region}, Languages: ${country.languages ? Object.values(country.languages).join(', ') : '-'}, Currencies: ${country.currencies ? Object.values(country.currencies).map(cu => cu.name).join(', ') : '-'}`;

  countryBackground.textContent = `${country.name.common} is located in ${country.subregion || country.region}. Capital: ${country.capital ? country.capital[0] : 'N/A'}. Population: ${country.population ? country.population.toLocaleString() : 'N/A'}.`;

  switch(country.region) {
    case 'Europe': animatedBackground.style.background = 'linear-gradient(270deg, #6d28d9, #1e3a8a)'; break;
    case 'Asia': animatedBackground.style.background = 'linear-gradient(270deg, #f59e0b, #ef4444)'; break;
    case 'Africa': animatedBackground.style.background = 'linear-gradient(270deg, #10b981, #047857)'; break;
    case 'Americas': animatedBackground.style.background = 'linear-gradient(270deg, #3b82f6, #2563eb)'; break;
    case 'Oceania': animatedBackground.style.background = 'linear-gradient(270deg, #f472b6, #db2777)'; break;
    default: animatedBackground.style.background = 'linear-gradient(270deg, #0f172a, #1e3a8a)'; break;
  }

  await fetchHolidays(country);
} 

async function fetchHolidays(country) {
  const year = new Date().getFullYear();
  const code = country.cca2;
  try {
    const res = await fetch(`${holidayAPI}?api_key=${API_KEY}&country=${code}&year=${year}`);
    const data = await res.json();
    if (!data.response || !data.response.holidays || data.response.holidays.length === 0) {
      holidayBody.innerHTML = '<tr><td colspan="4">No holidays found for this country</td></tr>';
      return;
    }
    renderHolidayTable(data.response.holidays);
  } catch(err) {
    alert('Failed to fetch holidays');
    console.error(err);
  }
}

function renderHolidayTable(data) {
  holidayBody.innerHTML = '';
  data.forEach(h => {
    holidayBody.innerHTML += `
      <tr>
        <td>${h.date.iso}</td>
        <td>${new Date(h.date.iso).toLocaleDateString('en-US', { weekday: 'long' })}</td>
        <td>${h.name}</td>
        <td>${h.type ? h.type.join(', ') : ''}</td>
      </tr>
    `;
  });
}

function filterHolidays(query) {
  const rows = holidayBody.querySelectorAll('tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
  });
}


searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') performSearch(searchInput.value);
});
searchInput.addEventListener('input', e => liveFilter(e.target.value));
searchBtn.addEventListener('click', e => {
  e.preventDefault();
  performSearch(searchInput.value);
});

countryBody.addEventListener('click', e => {
  if(e.target.classList.contains('viewHolidaysBtn')) {
    loadCountryDetails(e.target.dataset.code);
    return;
  }

  if (e.target.classList.contains('viewRegionsBtn')) {
    const code = e.target.dataset.code;
    const btn = e.target;
    const country = allCountries.find(c => c.cca2 === code);
    if (!country) return;

    const tr = btn.closest('tr');
    // If a regions row already exists for this country, remove it (toggle)
    const next = tr.nextElementSibling;
    if (next && next.classList && next.classList.contains('regionsRow') && next.dataset.for === code) {
      next.remove();
      return;
    }

    // Remove any other open regions rows
    const open = countryBody.querySelectorAll('.regionsRow');
    open.forEach(r => r.remove());

    const regionText = country.region || 'N/A';
    const subregionText = country.subregion || 'N/A';
    const row = document.createElement('tr');
    row.className = 'regionsRow';
    row.dataset.for = code;
    row.innerHTML = `<td colspan="6" class="regionsCell">Loading regions…</td>`;
    tr.after(row);

    // Fetch ISO 3166-2 subdivisions from Wikipedia and render them
    fetchRegionsISO(country, row).catch(() => {
      const regionText = country.region || 'N/A';
      const subregionText = country.subregion || null;
      const regionsHtml = `<strong>Region:</strong> ${regionText}${subregionText ? ` &nbsp; <strong>Subregion:</strong> ${subregionText}` : ''}`;
      row.innerHTML = `<td colspan="6" class="regionsCell">${regionsHtml}</td>`;
    });
  }
});

async function fetchRegionsISO(country, regionsRow) {
  const code = country.cca2;
  const page = `ISO_3166-2:${code}`;
  const url = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(page)}&prop=text&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch ISO page');
  const data = await res.json();
  if (!data.parse || !data.parse.text) throw new Error('No parse text');

  const html = data.parse.text['*'];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Look for the first table of subdivisions (often the first wikitable)
  const table = doc.querySelector('table.wikitable') || doc.querySelector('table');
  if (!table) throw new Error('No table found');

  const rows = Array.from(table.querySelectorAll('tr'));
  const items = [];
  rows.slice(1).forEach(r => {
    const cells = r.querySelectorAll('td');
    if (cells.length >= 2) {
      const codeText = cells[0].textContent.trim();
      const nameText = cells[1].textContent.trim();
      if (codeText && nameText) items.push({ code: codeText, name: nameText });
    }
  });

  if (items.length === 0) throw new Error('No subdivisions found');

  const listHtml = `<ul class="regionsList">${items.map(it => `<li><strong>${it.code}</strong> — ${it.name}</li>`).join('')}</ul>`;
  regionsRow.innerHTML = `<td colspan="6" class="regionsCell">${listHtml}</td>`;
}

backBtn.addEventListener('click', () => {
  detailView.classList.add('hidden');
  mainView.classList.remove('hidden');
  animatedBackground.style.background = 'linear-gradient(270deg, #0f172a, #1e3a8a, #6d28d9, #be185d)';
});

holidaySearch.addEventListener('input', () => filterHolidays(holidaySearch.value));

fetchCountries();
