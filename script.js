const API_KEY = 'e33037afabeca93913590502e9ab556b';

document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    
    // 1. DETECTOR DE CATEGORÍAS ROBUSTO
    const path = window.location.pathname.toLowerCase();
    const filename = path.substring(path.lastIndexOf('/') + 1);
    
    let category = 'general';
    let isGaming = false; 
    
    if (filename.includes('world')) {
        category = 'world';
    } else if (filename.includes('technology')) {
        category = 'technology';
    } else if (filename.includes('sports')) {
        category = 'sports';
    } else if (filename.includes('entertainment')) {
        category = 'entertainment';
    } else if (filename.includes('curiosities')) {
        category = 'science'; 
    } else if (filename.includes('gaming')) {
        isGaming = true; 
    } else {
        category = 'general'; 
    }

    // 2. FUNCIÓN PRINCIPAL DE CONSULTA (Con soporte de inglés para Gaming)
    async function fetchNews() {
        if (!newsContainer) return;
        
        // Mensaje de carga elegante en sueco
        newsContainer.innerHTML = '<p style="text-align:center; color: #475569; grid-column: 1/-1; font-style: italic;">Laddar nyheter...</p>';

        let targetUrl = '';
        
        if (isGaming) {
            // Al quitar "&lang=sv", GNews buscará los mejores artículos globales (mayormente en inglés)
            // Usamos términos universales exactos de la industria de los videojuegos
            const searchQuery = encodeURIComponent('(gaming OR "video games" OR "xbox" OR "playstation" OR "nintendo switch" OR "cyberpunk" OR "gta 6" OR "e-sports")');
            targetUrl = `/api/news/search?q=${searchQuery}&token=${API_KEY}`;
        } else {
            // El resto de las categorías se mantienen estrictamente en sueco y de la región de Suecia
            targetUrl = `/api/news/top-headlines?category=${category}&lang=sv&country=se&token=${API_KEY}`;
        }

        try {
            const response = await fetch(targetUrl);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            
            const data = await response.json();
            displayNews(data.articles);
        } catch (error) {
            console.error("Error al cargar noticias:", error);
            newsContainer.innerHTML = '<p style="color: #b91c1c; text-align: center; grid-column: 1/-1; font-weight: 600;">⚠️ Ett fel uppstod vid laddning av nyheter. Kontrollera din anslutning eller försök igen senare.</p>';
        }
    }

    // 3. RENDERIZADOR DE TARJETAS EN EL CONTENEDOR
    function displayNews(articles) {
        if (!newsContainer) return;
        newsContainer.innerHTML = '';

        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<p style="text-align: center; color: #475569; grid-column: 1/-1;">Inga nyheter tillgängliga för tillfället i denna kategori.</p>';
            return;
        }

        articles.forEach(article => {
            const card = document.createElement('article');
            card.className = 'news-card'; 

            const imageUrl = article.image || 'https://via.placeholder.com/400x225?text=Aurora+Nyheter';

            card.innerHTML = `
                <img src="${imageUrl}" alt="${article.title}" onerror="this.src='https://via.placeholder.com/400x225?text=Aurora+Nyheter'">
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p>${article.description || ''}</p>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">Läs mer →</a>
                </div>
            `;
            newsContainer.appendChild(card);
        });
    }

    fetchNews();
});
