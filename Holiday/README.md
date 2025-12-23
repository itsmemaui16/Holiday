# Holiday: Historical Data Viewer

A small client-side app to browse countries and view their public holidays.

Features
- Browse and search countries (live "starts-with" filtering as you type)
- Exact match or single-result search opens the country's detail view
- View a short generated background for each country (subregion, capital, population)
- View holidays fetched from Calendarific (requires API key already included in `script.js`)

How to run
1. Open `index.html` in a browser (no build/installation required).
2. Type in the search box to filter countries as you type.
3. Press Enter or click **Search** to auto-open details for exact matches or a single result.

How Output Works
- **Main View (Country Table):** Shows all countries with columns: Code, Name (flag + common name), Languages, Currencies, Region, and an Actions column with a **View Holiday List** button.
- **Live search:** Typing in the search box filters countries whose names start with the typed letters. If no matches appear, the table shows "No countries found".
- **Search button / Enter:** Triggers a search that will open the detail view if the query exactly matches a country name or code, or if the filtered results reduce to a single country.
- **Detail View:** Shows the country's flag, name, code, info (capital, region, languages, currencies), and a short generated background (subregion/capital/population). The page background gradient updates by region to provide a visual cue.
- **Region column:** Instead of the raw region text, the table shows a clickable **View Regions** button. Click **View Regions** to expand an inline row that lists the country's region and subregion.
 - **Region column:** Instead of the raw region text, the table shows a clickable **View Regions** button. Click **View Regions** to expand an inline row that lists the country's region and subregion. When available, the app attempts to fetch and show ISO 3166-2 subdivisions (administrative regions) for the country from Wikipedia (e.g. provinces, states); the list will appear under the clicked row.
- **Holidays Table:** Lists holidays for the selected country with Date, Weekday, Name, and Notes (type). The holiday filter box narrows the list by matching text.
- **Errors & edge cases:** If countries or holidays cannot be fetched an alert appears and where appropriate a "No holidays found for this country" or "No countries found" message is shown.

Notes
- The app uses the REST Countries API to fetch country data and Calendarific for holidays.
- I added `subregion` and `population` to the country data and display a short background in the detail view.

If you want richer, human-written backgrounds for each country, I can add a dataset or fetch a third-party description source and display that instead.

---

## API Details

- REST Countries endpoint: `https://restcountries.com/v3.1/all?fields=name,cca2,flags,capital,region,subregion,languages,currencies,population` (the app fetches this and displays country list and metadata).
- Calendarific holidays endpoint: `https://calendarific.com/api/v2/holidays?api_key=YOUR_KEY&country=XX&year=YYYY` (the app requests holidays for the selected country code and current year).

Note: Replace the API key in `script.js` with your own Calendarific key before publishing. For production use, move keys to a backend or environment variables.

## How to Run

1. Open `index.html` in a browser (no build/installation required).
2. Optionally, update `API_KEY` in `script.js` with your Calendarific key.

## Screenshots (add before submission)

- Add at least 2 screenshots under a `screenshots/` folder: `main-view.png` and `detail-view.png` so graders can see the UI without running the app.

## Members

- Member 1: John Marc M. Obogne 
- Member 2: Floriza Neri L. Miranda
- Member 3: John Lloyd Tirao
- Member 4: John Mark Abad 

Please update the above with team member names and their responsibilities.

## Demo Video Checklist

- Show search and live filtering in the main view.
- Demonstrate opening a country's detail view and fetching holidays (show network tab briefly if possible).
- Show the GitHub repo and branches used (briefly open PRs or show commit history).
- Keep audio clear and flow organized (start with feature summary, then demo, then repo/branches).

---

