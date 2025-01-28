// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

class ContentManager {
    constructor() {
        this.content = this.loadContent();
        this.renderContent();
        window.addEventListener('storage', () => {
            this.content = this.loadContent();
            this.renderContent();
        });
    }

    loadContent() {
        const savedContent = localStorage.getItem('siteContent');
        if (savedContent) {
            return JSON.parse(savedContent);
        }
        return {
            pyqs: [],
            ncert: [],
            blogPosts: []
        };
    }

    renderContent() {
        this.renderPYQs();
        this.renderNCERT();
        this.renderBlog();
    }

    renderPYQs() {
        const container = document.getElementById('pyqsContainer');
        if (!container) return;

        // Sort PYQs by date (newest first)
        const sortedPyqs = [...this.content.pyqs].reverse();

        container.innerHTML = sortedPyqs.map(pyq => `
            <div class="col-md-4 mb-4 fade-in">
                <div class="card pdf-card h-100">
                    <div class="pdf-preview" data-pdf="${pyq.pdfUrl}"></div>
                    <div class="card-body">
                        <h5 class="card-title">${pyq.title}</h5>
                        <p class="card-text">${pyq.description}</p>
                        <div class="d-flex justify-content-center flex-wrap gap-2">
                            <a href="${pyq.pdfUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-eye"></i> View PDF
                            </a>
                            <a href="${pyq.downloadUrl || pyq.pdfUrl}" class="btn btn-secondary" download>
                                <i class="fas fa-download"></i> Download
                            </a>
                            ${pyq.solutionUrl ? `
                                <a href="${pyq.solutionUrl}" class="btn btn-success w-100 mt-2" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-lightbulb"></i> View Solution
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.initializePDFPreviews();
    }

    renderNCERT() {
        const container = document.getElementById('ncertContainer');
        if (!container) return;

        // Sort NCERT PDFs by date (newest first)
        const sortedNcert = [...this.content.ncert].reverse();

        container.innerHTML = sortedNcert.map(book => `
            <div class="col-md-4 mb-4 fade-in">
                <div class="card pdf-card h-100">
                    <div class="pdf-preview" data-pdf="${book.pdfUrl}"></div>
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.description}</p>
                        <div class="d-flex justify-content-center flex-wrap gap-2">
                            <a href="${book.pdfUrl}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-eye"></i> View PDF
                            </a>
                            <a href="${book.downloadUrl || book.pdfUrl}" class="btn btn-secondary" download>
                                <i class="fas fa-download"></i> Download
                            </a>
                            ${book.solutionUrl ? `
                                <a href="${book.solutionUrl}" class="btn btn-success w-100 mt-2" target="_blank" rel="noopener noreferrer">
                                    <i class="fas fa-lightbulb"></i> View Solution
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.initializePDFPreviews();
    }

    renderBlog() {
        const container = document.getElementById('blogContainer');
        if (!container) return;

        // Sort blog posts by date (newest first)
        const sortedPosts = [...this.content.blogPosts].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        container.innerHTML = sortedPosts.map(post => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    ${post.imageUrl ? `
                        <img src="${post.imageUrl}" class="card-img-top" alt="${post.title}" style="height: 200px; object-fit: cover;">
                    ` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.content.substring(0, 150)}...</p>
                        <div class="text-muted small mb-2">Published: ${new Date(post.date).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async initializePDFPreviews() {
        const previews = document.querySelectorAll('.pdf-preview');
        previews.forEach(async (preview) => {
            const pdfUrl = preview.dataset.pdf;
            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const scale = 0.5;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                await page.render(renderContext);
                preview.appendChild(canvas);
            } catch (error) {
                preview.innerHTML = '<div class="pdf-fallback"><i class="fas fa-file-pdf"></i></div>';
            }
        });
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.content = this.loadContent();
        this.initializeSearch();
    }

    loadContent() {
        const savedContent = localStorage.getItem('siteContent');
        return savedContent ? JSON.parse(savedContent) : {
            pyqs: [],
            ncert: [],
            blogPosts: []
        };
    }

    initializeSearch() {
        const searchForm = document.querySelector('.search-form');
        const searchResults = document.getElementById('searchResults');
        
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = document.getElementById('searchInput').value.toLowerCase();
                const results = this.performSearch(query);
                this.displayResults(results);
            });
        }

        // Add live search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length >= 2) {
                    const results = this.performSearch(query);
                    this.displayResults(results);
                } else {
                    document.getElementById('searchResults').innerHTML = '';
                }
            });
        }
    }

    performSearch(query) {
        const results = {
            pyqs: [],
            ncert: [],
            blogPosts: []
        };

        // Search in PYQs
        results.pyqs = this.content.pyqs.filter(pyq => 
            pyq.title.toLowerCase().includes(query) ||
            pyq.description.toLowerCase().includes(query)
        );

        // Search in NCERT
        results.ncert = this.content.ncert.filter(book => 
            book.title.toLowerCase().includes(query) ||
            book.description.toLowerCase().includes(query)
        );

        // Search in Blog Posts
        results.blogPosts = this.content.blogPosts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query)
        );

        return results;
    }

    displayResults(results) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        const totalResults = results.pyqs.length + results.ncert.length + results.blogPosts.length;

        if (totalResults === 0) {
            searchResults.innerHTML = `
                <div class="no-results text-center py-4">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h3>No results found</h3>
                    <p>Try different keywords or browse our categories</p>
                </div>
            `;
            return;
        }

        let html = '<div class="row g-4">';

        // Display PYQ results
        results.pyqs.forEach(pyq => {
            html += `
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="badge bg-primary mb-2">PYQ</div>
                            <h5 class="card-title">${pyq.title}</h5>
                            <p class="card-text">${pyq.description}</p>
                            <a href="${pyq.pdfUrl}" class="btn btn-outline-primary" target="_blank">View PDF</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Display NCERT results
        results.ncert.forEach(book => {
            html += `
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="badge bg-success mb-2">NCERT</div>
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">${book.description}</p>
                            <a href="${book.pdfUrl}" class="btn btn-outline-success" target="_blank">View PDF</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Display Blog results
        results.blogPosts.forEach(post => {
            html += `
                <div class="col-md-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="badge bg-info mb-2">Blog</div>
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.content.substring(0, 150)}...</p>
                            <p class="text-muted small">Published: ${new Date(post.date).toLocaleDateString()}</p>
                            <button class="btn btn-outline-info" onclick="showFullPost('${encodeURIComponent(JSON.stringify(post))}')">
                                Read More
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        searchResults.innerHTML = html;
    }
}

// Initialize the content manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contentManager = new ContentManager();
    window.searchManager = new SearchManager();
});
