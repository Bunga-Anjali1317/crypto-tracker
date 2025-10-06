const loadMoreBtn = document.getElementById('load-more-btn');
const globalDataCards = document.getElementById('global-data-cards');
const currencyCardsContainer = document.getElementById('currency-cards-container');

// Pagination values
let page = 1;          // start at page 1
let perPage = 9;       // first load shows 9
const loadMoreCount = 9; // add 9 per click

document.addEventListener("DOMContentLoaded", () => {
    loadGlobalData();
    fetchCryptoData(false);  // first load, don't append

    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('show'));
        });
    }
});

async function fetchCryptoData(append = false) {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}`
        );
        const data = await response.json();
        console.log("Fetched data:", data);
         // After fetching, store all cryptos:
        allCryptos = data; // cryptos is your fetched array
        displayCryptoData(data, append);
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
}


function displayCryptoData(cryptos, append) {
    if (!append) currencyCardsContainer.innerHTML = ''; // only clear on first load
    cryptos.forEach(crypto => {
        
        const card = document.createElement('div');
        card.className = 'top-currency-card';
        card.innerHTML = `
            <div class="market-rank-pill">#${crypto.market_cap_rank}</div>
            <div class="currency-header">
                <img src="${crypto.image}" alt="${crypto.name} logo" class="currency-logo">
                <div>
                    <h2 class="currency-name">${crypto.name}</h2>
                    <p class="currency-symbol">${crypto.symbol.toUpperCase()}</p>
                </div>
            </div>
            <p class="currency-price">$${formatNumber(crypto.current_price)}</p>
            <div class="currency-details">
                <p class="currency-market-cap">Market Cap: $${formatNumber(crypto.market_cap)}</p>
                <p class="currency-change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                    24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%
                </p>
            </div>
        `;
        currencyCardsContainer.appendChild(card);
    });
}

async function loadGlobalData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();
        console.log(data);
        displayGlobalData(data.data);
    } catch (error) {
        alert('Error fetching global data:', error);
    }
}
function displayGlobalData(globalData) {
    globalDataCards.innerHTML = `
        <div class="global-data-card">
            <div class="global-card-description">
                <p class="global-card-title">Market Cap</p>
                <h2 class="global-card-value1">$${formatNumber(globalData.total_market_cap.usd)}</h2>
            </div>
            <i class="fa-solid fa-chart-line global-card-icon1"></i>
        </div>
        <div class="global-data-card">
            <div class="global-card-description">
                <p class="global-card-title">24h Volume</p>
                <h2 class="global-card-value2">$${formatNumber(globalData.total_volume.usd)}</h2>
            </div>
            <i class="fa-solid fa-arrow-trend-up global-card-icon2"></i>
        </div>
        <div class="global-data-card">
            <div class="global-card-description">
                <p class="global-card-title">BTC Dominance</p>
                <h2 class="global-card-value3">${globalData.market_cap_percentage.btc.toFixed(2)}%</h2>
            </div>
            <i class="fa-solid fa-arrow-trend-down global-card-icon3"></i>
        </div>
        <div class="global-data-card">
            <div class="global-card-description">
                <p class="global-card-title">Active Coins</p>
                <h2 class="global-card-value4">${formatNumber(globalData.active_cryptocurrencies)}</h2>
            </div>
            <i class="fa-solid fa-coins global-card-icon4"></i>
        </div>
    `;
}  

function formatNumber(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + "T"; // trillions
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + "B"; // billions
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + "M"; // millions
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + "K"; // thousands
    } else {
        return num.toString();
    }
}

loadMoreBtn.addEventListener('click', () => {
    if (perPage > 54) {
        loadMoreBtn.style.display = 'none';
    }
    else{
        page++;             // go to next page
        perPage = loadMoreCount; // only fetch 6 items per page after first load
        fetchCryptoData(true);   // append results
    }
    
});

//Search functionality
document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    let filtered = allCryptos;
    if (query) {
        filtered = allCryptos.filter(crypto =>
            crypto.name.toLowerCase().includes(query) ||
            crypto.symbol.toLowerCase().includes(query)
        );
    }
    displayCryptoData(filtered, false);
});


