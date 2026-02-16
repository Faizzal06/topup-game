document.addEventListener('DOMContentLoaded', () => {
    const gameSections = document.getElementById('gameSections');
    const waNumberSpan = document.getElementById('waNumberDisplay');

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal memuat data');
            }
            return response.json();
        })
        .then(data => {
            const waNumber = data.whatsapp || '6281234567890';
            waNumberSpan.textContent = formatWaDisplay(waNumber);

            data.games.forEach(game => {
                const section = document.createElement('section');
                section.className = 'game-section';

                // Judul game dengan ikon
                const titleDiv = document.createElement('div');
                titleDiv.className = 'game-title';
                titleDiv.innerHTML = `
                    <span class="game-icon">${game.icon || '🎮'}</span>
                    <h2>${game.name}</h2>
                `;
                section.appendChild(titleDiv);

                // Banner gambar (jika tersedia)
                if (game.banner) {
                    const bannerImg = document.createElement('img');
                    bannerImg.className = 'game-banner';
                    bannerImg.src = game.banner;
                    bannerImg.alt = `Banner ${game.name}`;
                    bannerImg.onerror = function () {
                        this.src = 'https://placehold.co/600x400';
                    };
                    section.appendChild(bannerImg);
                }

                // Grid produk
                const grid = document.createElement('div');
                grid.className = 'diamond-grid';

                game.products.forEach(prod => {
                    const card = createProductCard(game.name, prod.diamond, prod.price, waNumber);
                    grid.appendChild(card);
                });

                section.appendChild(grid);
                gameSections.appendChild(section);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            gameSections.innerHTML = `<p style="color: #f87171; text-align: center;">Gagal memuat data. Pastikan file data.json tersedia.</p>`;
        });

    function formatWaDisplay(number) {
        if (number.startsWith('62')) {
            return '+62 ' + number.slice(2, 5) + ' ' + number.slice(5, 9) + ' ' + number.slice(9);
        }
        return number;
    }

    function createProductCard(game, diamond, price, waNumber) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.dataset.diamond = diamond;
        card.dataset.price = price;

        card.innerHTML = `
            <div class="diamond-icon">💎</div>
            <div class="jumlah-diamond">${diamond}<small> Diamond</small></div>
            <div class="harga"><span>Rp</span>${price.toLocaleString('id-ID')}</div>
            <div class="beli-label">
                <i>🛒</i> Beli via WA
            </div>
        `;

        card.addEventListener('click', () => {
            const message = createWaMessage(game, diamond, price);
            const waURL = `https://wa.me/${waNumber}?text=${message}`;
            window.open(waURL, '_blank');
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });

        return card;
    }

    function createWaMessage(game, diamond, price) {
        return `Halo%2C%20saya%20mau%20topup%20diamond%20game ${game}.%0A%0A💎%20${diamond}%20Diamond%0A💰%20Rp${price.toLocaleString('id-ID')}%0A%0AMohon%20info%20pembayaran%20dan%20proses.%20Terima%20kasih.`;
    }
});

