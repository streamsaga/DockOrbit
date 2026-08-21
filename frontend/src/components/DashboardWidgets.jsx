export default function DashboardWidgets({ onCategorySelect }) {
  return (
    <div className="dashboard-widgets-wrap">
      {/* --- Recent Activity KPI Cards --- */}
      <div className="recent-activity-section">
        <h2 className="section-title">Recent activity</h2>
        <div className="kpi-cards-row">
          <div className="kpi-card">
            <span className="kpi-number">741</span>
            <span className="kpi-qty">Qty</span>
            <span className="kpi-label">VERIFIED CHANNELS</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-number">123</span>
            <span className="kpi-qty">Qty</span>
            <span className="kpi-label">CURATED PLAYLISTS</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-number">12</span>
            <span className="kpi-qty">Qty</span>
            <span className="kpi-label">TOP CATEGORIES</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-number">1</span>
            <span className="kpi-qty">Qty</span>
            <span className="kpi-label">TRUST ANALYZED</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-number">4</span>
            <span className="kpi-qty">Qty</span>
            <span className="kpi-label">SAVED CREATORS</span>
          </div>

          <button className="kpi-scroll-arrow" aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- Middle Row: Sales Chart & Top Categories --- */}
      <div className="dashboard-middle-row">
        {/* Sales Chart Card */}
        <div className="dashboard-card sales-chart-card">
          <div className="card-header-row">
            <span className="card-title">Sales</span>
          </div>
          <div className="chart-container">
            <div className="chart-bars">
              <div className="chart-bar-group">
                <div className="bar bar-1" style={{ height: '60%' }}></div>
                <span className="bar-label">Confirmed</span>
              </div>
              <div className="chart-bar-group">
                <div className="bar bar-2" style={{ height: '80%' }}></div>
                <span className="bar-label">Packed</span>
              </div>
              <div className="chart-bar-group">
                <div className="bar bar-3" style={{ height: '35%' }}></div>
                <span className="bar-label">Refunded</span>
              </div>
              <div className="chart-bar-group">
                <div className="bar bar-4" style={{ height: '95%' }}></div>
                <span className="bar-label">Shipped</span>
              </div>
            </div>
            <div className="chart-base-line"></div>
          </div>
        </div>

        {/* Top Item Categories Card */}
        <div className="dashboard-card categories-card">
          <div className="card-header-row">
            <span className="card-title">Top item categories</span>
            <span className="view-all-link">VIEW ALL</span>
          </div>
          <div className="category-icons-grid">
            <button className="category-icon-box" onClick={() => onCategorySelect && onCategorySelect('tech')} title="Tech & Coding">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/>
                <path d="M10 8l-4 4 4 4M14 8l4 4-4 4"/>
              </svg>
            </button>

            <button className="category-icon-box" onClick={() => onCategorySelect && onCategorySelect('education')} title="Education">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </button>

            <button className="category-icon-box" onClick={() => onCategorySelect && onCategorySelect('gaming')} title="Gaming">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </button>

            <button className="category-icon-box" onClick={() => onCategorySelect && onCategorySelect('entertainment')} title="Entertainment">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H9l2 4H8L6 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
            </button>

            <button className="category-icon-box" onClick={() => onCategorySelect && onCategorySelect('business')} title="Business & Finance">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
            </button>

            <button className="category-icon-box" onClick={() => onCategorySelect && onCategorySelect('science')} title="Science & AI">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </button>
          </div>
          <button className="category-scroll-arrow" aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- Bottom Row: Stock numbers & Stores list --- */}
      <div className="dashboard-bottom-row">
        {/* Stock Numbers Card */}
        <div className="dashboard-card stock-numbers-card">
          <div className="card-header-row">
            <span className="card-title">Stock numbers</span>
          </div>
          <div className="stock-list">
            <div className="stock-item">
              <span className="stock-label">Low stock items</span>
              <span className="stock-value">12 <span className="info-icon">⚙</span></span>
            </div>
            <div className="stock-item">
              <span className="stock-label">Item categories</span>
              <span className="stock-value">6</span>
            </div>
            <div className="stock-item">
              <span className="stock-label">Refunded items</span>
              <span className="stock-value">1</span>
            </div>
          </div>
        </div>

        {/* Stores List Card */}
        <div className="dashboard-card stores-list-card">
          <div className="card-header-row">
            <span className="card-title">Stores list</span>
            <span className="view-all-link">VIEW ALL</span>
          </div>
          <div className="stores-table">
            <div className="stores-row">
              <span className="store-name">Manchester, UK</span>
              <span className="store-stat">23 employees</span>
              <span className="store-stat">308 items</span>
              <span className="store-stat">2 orders</span>
            </div>
            <div className="stores-row">
              <span className="store-name">Yorkshire, UK</span>
              <span className="store-stat">11 employees</span>
              <span className="store-stat">291 items</span>
              <span className="store-stat">15 orders</span>
            </div>
            <div className="stores-row">
              <span className="store-name">Hull, UK</span>
              <span className="store-stat">5 employees</span>
              <span className="store-stat">41 items</span>
              <span className="store-stat">11 orders</span>
            </div>
            <div className="stores-row">
              <span className="store-name">Leicester, UK</span>
              <span className="store-stat">16 employees</span>
              <span className="store-stat">261 items</span>
              <span className="store-stat">8 orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
