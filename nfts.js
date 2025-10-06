const nftCardsContainer = document.getElementById('nft-cards-container');

document.addEventListener("DOMContentLoaded", () => {
    fetchNFTData();
});

const apiKey = "pbwbU_FufZVNdRDBixcHQ"; // Alchemy API Key
const collectionAddress = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"; // BAYC

let allNFTs = [];
let displayedCount = 0;
const PAGE_SIZE = 10;

// Fetch NFTs from collection
async function fetchNFTData() {
    try {
        const url = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}/getNFTsForCollection?contractAddress=${collectionAddress}&withMetadata=true`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.nfts || data.nfts.length === 0) {
            nftCardsContainer.innerHTML = "<p>No NFTs found.</p>";
            document.getElementById('load-more-btn').style.display = 'none';
            return;
        }
        allNFTs = data.nfts;
        displayedCount = 0;
        displayNFTs(); // Initial load
    } catch (error) {
        console.error('Error fetching NFT data:', error);
        nftCardsContainer.innerHTML = "<p>Error loading NFTs. Please try again later.</p>";
        document.getElementById('load-more-btn').style.display = 'none';
    }
}

// LocalStorage helpers
function getWishlist() {
    let arr = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!Array.isArray(arr)) arr = [];
    return arr;
    
}
function setWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Display NFT cards
function displayNFTs() {
    const wishlist = getWishlist();
    window.currentNFTs = allNFTs; // for wishlist access
    // Only show up to displayedCount + PAGE_SIZE NFTs
    const nftsToShow = allNFTs.slice(0, displayedCount + PAGE_SIZE);
    nftCardsContainer.innerHTML = '';
    nftsToShow.forEach(nft => {
        const card = document.createElement('div');
        card.className = 'nft-card';
        const tokenId = parseInt(nft.id.tokenId, 16);
        const image = formatIPFS(nft.metadata?.image) || nft.media?.[0]?.gateway || "";
        const name = nft.metadata?.name || nft.contractMetadata?.name || 'Unnamed NFT';
        const symbol = nft.contractMetadata?.symbol || '';
        const attributesHTML = nft.metadata?.attributes?.map(attr => `
            <span class="nft-attribute">${attr.trait_type}: ${attr.value}</span>
        `).join('') || '';
        const isWishlisted = wishlist.includes(tokenId);

        card.innerHTML = `
            <div class="nft-rank">NFT #${tokenId}</div>
            <div class="nft-image-container">
                <img src="${image}" alt="${name}" class="nft-image">
            </div>
            <h3 class="nft-name"><span class="nft-symbol">(${symbol})</span></h3>
            <div class="nft-attributes">${attributesHTML}</div>
            <div class="nft-actions">
                <a href="https://opensea.io/assets/ethereum/${collectionAddress}/${tokenId}" target="_blank" class="view-button">
                    View on OpenSea
                </a>
                <button class="wishlist-button" onclick="addToWishList(this, ${tokenId})">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${isWishlisted ? 'green' : 'white'}"></i>
                </button>
            </div>
        `;
        nftCardsContainer.appendChild(card);
    });

    displayedCount = nftsToShow.length;
    // Hide Load More button if all NFTs are loaded
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (displayedCount >= allNFTs.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Load more NFTs on button click
document.getElementById('load-more-btn').addEventListener('click', () => {
    displayNFTs();
});

// Add/remove from wishlist
function addToWishList(button, tokenId) {
    let wishlist = getWishlist();
    const icon = button.querySelector('i');

    if (wishlist.includes(tokenId)) {
        // Remove from wishlist
        wishlist = wishlist.filter(id => id !== tokenId);
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        icon.style.color = "white";
    } else {
        // Add to wishlist
        wishlist.push(tokenId);
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = "green";
    }

    setWishlist(wishlist);
    console.log(wishlist); // <-- This will log the current wishlist array
}

// Format IPFS links
function formatIPFS(url) {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
        return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
}

document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
        // Optional: close menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('show'));
        });
    }
});
