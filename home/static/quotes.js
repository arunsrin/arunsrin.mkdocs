const QUOTE_STORAGE_KEY = 'quotes';
const EXPIRY_STORAGE_KEY = 'quotes_expiry';
const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function fetchQuotes() {
    // This gets the base path of your site (e.g. '/docs/' for 'https://yoursite.com/docs/')
    const base = document.querySelector('base')?.getAttribute('href') || '/';
    fetch(`${base}static/quotes.json`)
        .then(response => response.json())
        .then(data => {
            const quotes = data.quotes;
            localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quotes));
            localStorage.setItem(EXPIRY_STORAGE_KEY, Date.now() + EXPIRY_TIME);
            displayRandomQuote(quotes);
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            document.getElementById('quote').textContent = 'Error loading quotes. Please try again later.';
        });
}

function displayRandomQuote(quotes) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quote').textContent = `"${randomQuote.text}"`;
    document.getElementById('quote-author').textContent = `${randomQuote.author}`;
}

function loadQuotes() {
    const expiry = localStorage.getItem(EXPIRY_STORAGE_KEY);
    const quotes = localStorage.getItem(QUOTE_STORAGE_KEY);

    if (!quotes || !expiry || Date.now() > expiry) {
        fetchQuotes();
    } else {
        displayRandomQuote(JSON.parse(quotes));
    }
}

// Call this function on page load
window.onload = loadQuotes;
