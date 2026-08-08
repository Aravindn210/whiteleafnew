/* ==========================================================================
   WHITELEAF INTERIORS - ADMIN DASHBOARD & CMS LOGIC
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. SEED DEFAULT DATA IF NOT PRESENT IN LOCALSTORAGE ---
  const INITIAL_PROJECTS = [
    {
      id: 'proj-101',
      title: 'Aura Pavilion - GITEX Global',
      category: 'exhibitions',
      client: 'Aura AI Technologies',
      year: '2026',
      location: 'Dubai World Trade Centre',
      image: 'assets/project photo/project_1.jpg',
      description: 'Futuristic 400sqm double-deck exhibition stand featuring dynamic LED kinetic ceiling, VR experience zones, and executive VIP meeting rooms.',
      featured: true,
      createdAt: '2026-06-15'
    },
    {
      id: 'proj-102',
      title: 'Neom Horizon Interior Suite',
      category: 'interiors',
      client: 'Neom Development Corp',
      year: '2026',
      location: 'Riyadh, KSA',
      image: 'assets/project photo/project_2.jpg',
      description: 'Luxury corporate executive headquarter fit-out crafted with sustainable biophilic elements, brushed bronze trims, and custom Italian marble.',
      featured: true,
      createdAt: '2026-05-20'
    },
    {
      id: 'proj-103',
      title: 'Vogue Arabia Luxury Gala',
      category: 'events',
      client: 'Vogue Arabia & Condé Nast',
      year: '2025',
      location: 'Armani Hotel Dubai',
      image: 'assets/project photo/project_3.jpg',
      description: 'High-fashion immersive stage set design, runway architectural lighting, and bespoke photo-activation tunnels for 600 VIP guests.',
      featured: false,
      createdAt: '2025-11-10'
    },
    {
      id: 'proj-104',
      title: 'Cyberpunk Gaming Oasis',
      category: 'activations',
      client: 'Razer EMEA',
      year: '2026',
      location: 'Dubai Mall Promenade',
      image: 'assets/project photo/project_4.jpg',
      description: 'Experiential pop-up booth with custom RGB LED light rings, holographic displays, and live esports tournament stage.',
      featured: true,
      createdAt: '2026-03-04'
    },
    {
      id: 'proj-105',
      title: 'Lucid Motors Exhibition Stand',
      category: 'exhibitions',
      client: 'Lucid Motors Middle East',
      year: '2026',
      location: 'ADNEC, Abu Dhabi',
      image: 'assets/project photo/project_5.jpg',
      description: 'Ultra-minimalist automotive display stand with custom revolving turntable, mirror ceiling, and touch-screen interactive configurators.',
      featured: false,
      createdAt: '2026-01-18'
    }
  ];

  const INITIAL_LEADS = [
    {
      id: 'lead-501',
      name: 'Sheikh Hamdan Al Qasimi',
      email: 'h.qasimi@alqasimi-holdings.ae',
      phone: '+971 50 123 4567',
      company: 'Al Qasimi Holdings',
      service: 'Bespoke Exhibition Pavilion',
      budget: '$150,000 - $300,000',
      status: 'new',
      date: '2026-08-07T14:30:00Z',
      message: 'We are requesting a proposal for a 600sqm custom exhibition booth for GITEX 2026. Stand needs double deck, VIP lounge, and interactive AR screen wall.'
    },
    {
      id: 'lead-502',
      name: 'Marcus Vance',
      email: 'm.vance@techlumina.io',
      phone: '+44 7911 123456',
      company: 'Lumina Tech UK',
      service: 'Luxury Office Interior Fit-out',
      budget: '$75,000 - $150,000',
      status: 'in-contact',
      date: '2026-08-06T09:15:00Z',
      message: 'Opening our new regional office in DIFC, Dubai (3,500 sqft). Looking for premium minimalist interior design with acoustic glass partitions.'
    },
    {
      id: 'lead-503',
      name: 'Elena Rostova',
      email: 'elena@luxevibe-events.com',
      phone: '+971 55 987 6543',
      company: 'LuxeVibe Events Global',
      service: 'Corporate Event Production',
      budget: '$50,000 - $100,000',
      status: 'in-progress',
      date: '2026-08-04T18:45:00Z',
      message: 'We need stage design, lighting, sound, and VIP entrance installation for an exclusive brand launch at Atlantis The Royal in October.'
    },
    {
      id: 'lead-504',
      name: 'Tariq Al-Mansoor',
      email: 'tariq.mansoor@saudiforum.sa',
      phone: '+966 50 888 9900',
      company: 'Saudi Investment Forum',
      service: 'Brand Activation & Exhibition',
      budget: '$200,000+',
      status: 'closed',
      date: '2026-07-28T11:20:00Z',
      message: 'Turnkey pavilion fabrication and installation required for Vision 2030 Summit in Riyadh. Project delivered successfully.'
    }
  ];

  function initStorage() {
    if (!localStorage.getItem('whiteleaf_projects')) {
      localStorage.setItem('whiteleaf_projects', JSON.stringify(INITIAL_PROJECTS));
    }
    if (!localStorage.getItem('whiteleaf_leads')) {
      localStorage.setItem('whiteleaf_leads', JSON.stringify(INITIAL_LEADS));
    }
  }

  initStorage();

  // Helper storage functions
  function getProjects() {
    return JSON.parse(localStorage.getItem('whiteleaf_projects')) || [];
  }
  function saveProjects(projects) {
    localStorage.setItem('whiteleaf_projects', JSON.stringify(projects));
  }
  function getLeads() {
    return JSON.parse(localStorage.getItem('whiteleaf_leads')) || [];
  }
  function saveLeads(leads) {
    localStorage.setItem('whiteleaf_leads', JSON.stringify(leads));
  }

  // --- 2. AUTHENTICATION PROTECTION ---
  const isLoginPage = window.location.pathname.includes('login.html');
  const isDashboardPage = window.location.pathname.includes('dashboard.html');

  function checkAuth() {
    const authUser = JSON.parse(localStorage.getItem('whiteleaf_auth_user'));
    if (isDashboardPage && !authUser) {
      window.location.href = 'login.html';
    } else if (isLoginPage && authUser) {
      window.location.href = 'dashboard.html';
    }
  }

  checkAuth();

  // --- 3. LOGIN PAGE CONTROLLER ---
  if (isLoginPage) {
    const loginForm = document.getElementById('login-form');
    const fillSuperAdminBtn = document.getElementById('btn-fill-superadmin');
    const fillPmBtn = document.getElementById('btn-fill-pm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassBtn = document.getElementById('toggle-password');

    if (fillSuperAdminBtn) {
      fillSuperAdminBtn.addEventListener('click', function () {
        emailInput.value = 'superadmin@whiteleaf.com';
        passwordInput.value = 'superadmin2026';
        showToast('Super Admin credentials pre-filled!', 'success');
      });
    }

    if (fillPmBtn) {
      fillPmBtn.addEventListener('click', function () {
        emailInput.value = 'pm@whiteleaf.com';
        passwordInput.value = 'pm2026';
        showToast('Project Manager credentials pre-filled!', 'success');
      });
    }

    if (togglePassBtn) {
      togglePassBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').className = type === 'password' ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        if (!email || !password) {
          showToast('Please enter both email and password.', 'error');
          return;
        }

        let role = 'superadmin';
        let name = 'Super Administrator';

        if (email.includes('pm') || email.includes('project') || password === 'pm2026') {
          role = 'project_manager';
          name = 'Project Manager';
        }

        const user = {
          name: name,
          email: email,
          role: role,
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('whiteleaf_auth_user', JSON.stringify(user));
        showToast(`Signed in as ${name}! Redirecting...`, 'success');
        
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 700);
      });
    }
  }

  // --- 4. DASHBOARD CONTROLLER ---
  if (isDashboardPage) {
    document.addEventListener('DOMContentLoaded', function () {
      applyRolePermissions();
      initClock();
      initSidebar();
      initTabs();
      initOverview();
      initProjectsView();
      initLeadsView();
      initAnalyticsView();
      initModals();

      // Logout handler
      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          if (confirm('Are you sure you want to log out of Whiteleaf Admin?')) {
            localStorage.removeItem('whiteleaf_auth_user');
            window.location.href = 'login.html';
          }
        });
      }
    });
  }

  function applyRolePermissions() {
    const authUser = JSON.parse(localStorage.getItem('whiteleaf_auth_user')) || { role: 'superadmin', name: 'Super Administrator' };
    const roleBadge = document.getElementById('user-role-badge');
    const userNameEl = document.getElementById('user-display-name');
    const userRoleTitleEl = document.getElementById('user-display-role');
    const userAvatarEl = document.getElementById('user-avatar');
    const navLeadsItem = document.getElementById('nav-item-leads');
    const recentLeadsSection = document.getElementById('recent-leads-section');

    if (userNameEl) userNameEl.textContent = authUser.name;

    if (authUser.role === 'project_manager') {
      if (userRoleTitleEl) userRoleTitleEl.textContent = 'Project Manager';
      if (userAvatarEl) userAvatarEl.textContent = 'PM';

      if (roleBadge) {
        roleBadge.textContent = 'PROJECT MANAGER';
        roleBadge.style.background = 'rgba(229,184,105,0.18)';
        roleBadge.style.color = 'var(--accent-gold)';
        roleBadge.style.border = '1px solid rgba(229,184,105,0.3)';
      }

      // Hide Contact Leads tab from PM
      if (navLeadsItem) navLeadsItem.style.display = 'none';
      if (recentLeadsSection) recentLeadsSection.style.display = 'none';
      document.body.classList.add('role-pm');
    } else {
      if (userRoleTitleEl) userRoleTitleEl.textContent = 'Super Administrator';
      if (userAvatarEl) userAvatarEl.textContent = 'SA';

      if (roleBadge) {
        roleBadge.textContent = 'SUPER ADMIN';
        roleBadge.style.background = 'rgba(157,203,71,0.15)';
        roleBadge.style.color = 'var(--accent-green)';
        roleBadge.style.border = '1px solid rgba(157,203,71,0.3)';
      }

      if (navLeadsItem) navLeadsItem.style.display = 'flex';
      if (recentLeadsSection) recentLeadsSection.style.display = 'block';
      document.body.classList.remove('role-pm');
    }
  }

  // Live Clock Header
  function initClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' GST';
    }
    update();
    setInterval(update, 1000);
  }

  // Sidebar Toggle Mobile
  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const trigger = document.getElementById('mobile-menu-trigger');
    if (trigger && sidebar) {
      trigger.addEventListener('click', function () {
        sidebar.classList.toggle('mobile-open');
      });
    }
  }

  // Tab Navigation
  function initTabs() {
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
      item.addEventListener('click', function () {
        const targetTab = this.getAttribute('data-tab');

        navItems.forEach(n => n.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const targetPane = document.getElementById(`tab-${targetTab}`);
        if (targetPane) targetPane.classList.add('active');

        if (pageTitle) {
          const titleMap = {
            overview: 'Dashboard Overview',
            projects: 'Project Management & CMS',
            leads: 'Website Contact Enquiries',
            analytics: 'Performance & Analytics'
          };
          pageTitle.textContent = titleMap[targetTab] || 'Whiteleaf Admin';
        }

        // Close sidebar on mobile after tab click
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('mobile-open');

        // Refresh views
        if (targetTab === 'overview') updateMetrics();
        if (targetTab === 'projects') renderProjectsList();
        if (targetTab === 'leads') renderLeadsList();
      });
    });
  }

  // --- 5. OVERVIEW & METRICS ---
  function updateMetrics() {
    const projects = getProjects();
    const leads = getLeads();

    const totalProjectsEl = document.getElementById('stat-total-projects');
    const exhibitionsEl = document.getElementById('stat-count-exhibitions');
    const interiorsEl = document.getElementById('stat-count-interiors');
    const eventsEl = document.getElementById('stat-count-events');
    const activationsEl = document.getElementById('stat-count-activations');
    const leadsBadge = document.getElementById('nav-leads-badge');

    const exhibitionCount = projects.filter(p => p.category === 'exhibitions').length;
    const interiorCount = projects.filter(p => p.category === 'interiors').length;
    const eventCount = projects.filter(p => p.category === 'events').length;
    const activationCount = projects.filter(p => p.category === 'activations').length;

    const newLeadsCount = leads.filter(l => l.status === 'new').length;

    if (totalProjectsEl) totalProjectsEl.textContent = projects.length;
    if (exhibitionsEl) exhibitionsEl.textContent = exhibitionCount;
    if (interiorsEl) interiorsEl.textContent = interiorCount;
    if (eventsEl) eventsEl.textContent = eventCount;
    if (activationsEl) activationsEl.textContent = activationCount;

    if (leadsBadge) leadsBadge.textContent = newLeadsCount;

    renderRecentLeads();
    renderRecentProjects();
  }

  function initOverview() {
    updateMetrics();
  }

  function renderRecentLeads() {
    const tableBody = document.getElementById('recent-leads-tbody');
    if (!tableBody) return;

    const leads = getLeads().slice(0, 5); // top 5
    if (leads.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:24px;">No contact inquiries recorded yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = leads.map(lead => `
      <tr>
        <td>
          <div style="font-weight:700; color:#fff;">${escapeHtml(lead.name)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(lead.company || lead.email)}</div>
        </td>
        <td><span style="color:var(--accent-green); font-weight:600;">${escapeHtml(lead.service)}</span></td>
        <td>${escapeHtml(lead.budget || 'N/A')}</td>
        <td><span class="status-badge ${lead.status}">${formatStatus(lead.status)}</span></td>
        <td>
          <button class="btn-sec" onclick="window.viewLeadDetails('${lead.id}')" style="padding:4px 10px; font-size:0.75rem;">View</button>
        </td>
      </tr>
    `).join('');
  }

  function renderRecentProjects() {
    const grid = document.getElementById('recent-projects-grid');
    if (!grid) return;

    const projects = getProjects().slice(0, 3);
    grid.innerHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-img-wrapper">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="project-img" onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';">
          <span class="project-category-tag">${escapeHtml(p.category)}</span>
        </div>
        <div class="project-body">
          <div class="project-title">${escapeHtml(p.title)}</div>
          <div class="project-meta"><i class="fa-regular fa-building"></i> ${escapeHtml(p.client)} • ${p.year}</div>
          <p class="project-desc">${escapeHtml(p.description)}</p>
        </div>
      </div>
    `).join('');
  }

  // --- 6. PROJECTS MANAGEMENT ---
  function initProjectsView() {
    renderProjectsList();

    const searchInput = document.getElementById('project-search');
    const categorySelect = document.getElementById('project-category-filter');

    if (searchInput) searchInput.addEventListener('input', renderProjectsList);
    if (categorySelect) categorySelect.addEventListener('change', renderProjectsList);
  }

  function renderProjectsList() {
    const grid = document.getElementById('projects-list-grid');
    if (!grid) return;

    const search = (document.getElementById('project-search')?.value || '').toLowerCase();
    const category = document.getElementById('project-category-filter')?.value || 'all';

    let projects = getProjects();

    if (category !== 'all') {
      projects = projects.filter(p => p.category === category);
    }

    if (search) {
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.client.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    if (projects.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:48px; color:var(--text-muted); background:var(--card-bg); border-radius:var(--radius-md);">
        <i class="fa-solid fa-folder-open" style="font-size:2rem; margin-bottom:12px; color:var(--text-dim);"></i>
        <p>No projects match your filter query.</p>
      </div>`;
      return;
    }

    grid.innerHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-img-wrapper">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="project-img" onerror="this.src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';">
          <span class="project-category-tag">${escapeHtml(p.category)}</span>
          ${p.featured ? '<span style="position:absolute; top:12px; right:12px; background:var(--accent-gold); color:#000; font-size:0.65rem; font-weight:800; padding:3px 8px; border-radius:var(--radius-pill);"><i class="fa-solid fa-star"></i> FEATURED</span>' : ''}
        </div>
        <div class="project-body">
          <div class="project-title">${escapeHtml(p.title)}</div>
          <div class="project-meta"><i class="fa-regular fa-building"></i> ${escapeHtml(p.client)} • ${p.year}</div>
          <p class="project-desc">${escapeHtml(p.description)}</p>
          <div class="project-card-footer">
            <button class="btn-sec" onclick="window.toggleFeaturedProject('${p.id}')" style="padding:4px 10px; font-size:0.75rem;">
              ${p.featured ? '<i class="fa-solid fa-star" style="color:var(--accent-gold);"></i> Unstar' : '<i class="fa-regular fa-star"></i> Feature'}
            </button>
            <div style="display:flex; gap:6px;">
              <button class="icon-btn" onclick="window.editProjectModal('${p.id}')" title="Edit Project"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="icon-btn danger" onclick="window.deleteProject('${p.id}')" title="Delete Project"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Project Actions Global Window Hooks
  window.toggleFeaturedProject = function(id) {
    const projects = getProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      projects[idx].featured = !projects[idx].featured;
      saveProjects(projects);
      renderProjectsList();
      showToast(projects[idx].featured ? 'Marked as Featured Project!' : 'Removed from Featured Projects');
    }
  };

  window.deleteProject = function(id) {
    const authUser = JSON.parse(localStorage.getItem('whiteleaf_auth_user')) || {};
    if (authUser.role === 'project_manager') {
      showToast('Action restricted: Only Super Admin can delete projects.', 'error');
      return;
    }
    if (confirm('Are you sure you want to remove this project?')) {
      let projects = getProjects();
      projects = projects.filter(p => p.id !== id);
      saveProjects(projects);
      renderProjectsList();
      updateMetrics();
      showToast('Project deleted successfully.', 'success');
    }
  };

  window.editProjectModal = function(id) {
    const projects = getProjects();
    const p = projects.find(item => item.id === id);
    if (!p) return;

    document.getElementById('project-id').value = p.id;
    document.getElementById('project-title-input').value = p.title;
    document.getElementById('project-category-input').value = p.category;
    document.getElementById('project-client-input').value = p.client;
    document.getElementById('project-year-input').value = p.year;
    document.getElementById('project-location-input').value = p.location || '';
    document.getElementById('project-image-input').value = p.image;
    document.getElementById('project-desc-input').value = p.description;
    document.getElementById('project-featured-input').checked = !!p.featured;

    document.getElementById('modal-project-title').textContent = 'Edit Project Specifications';
    openModal('modal-project');
  };

  // --- 7. LEADS / CONTACT INQUIRIES MANAGEMENT ---
  function initLeadsView() {
    renderLeadsList();

    const searchInput = document.getElementById('lead-search');
    const statusSelect = document.getElementById('lead-status-filter');

    if (searchInput) searchInput.addEventListener('input', renderLeadsList);
    if (statusSelect) statusSelect.addEventListener('change', renderLeadsList);

    const exportBtn = document.getElementById('btn-export-leads');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportLeadsCSV);
    }
  }

  function renderLeadsList() {
    const tableBody = document.getElementById('leads-tbody');
    if (!tableBody) return;

    const search = (document.getElementById('lead-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('lead-status-filter')?.value || 'all';

    let leads = getLeads();

    if (statusFilter !== 'all') {
      leads = leads.filter(l => l.status === statusFilter);
    }

    if (search) {
      leads = leads.filter(l => 
        l.name.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        (l.company && l.company.toLowerCase().includes(search)) ||
        l.service.toLowerCase().includes(search)
      );
    }

    if (leads.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:36px;">No contact leads found matching search filters.</td></tr>`;
      return;
    }

    tableBody.innerHTML = leads.map(lead => `
      <tr>
        <td>
          <div style="font-weight:700; color:#fff;">${escapeHtml(lead.name)}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(lead.company || 'Private Client')}</div>
        </td>
        <td>
          <div><a href="mailto:${escapeHtml(lead.email)}" style="color:var(--accent-green);">${escapeHtml(lead.email)}</a></div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${escapeHtml(lead.phone || 'N/A')}</div>
        </td>
        <td><span style="font-weight:600; color:#fff;">${escapeHtml(lead.service)}</span></td>
        <td>
          <select onchange="window.updateLeadStatus('${lead.id}', this.value)" class="form-select" style="padding:4px 8px; font-size:0.75rem; border-radius:var(--radius-pill); width:auto;">
            <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
            <option value="in-contact" ${lead.status === 'in-contact' ? 'selected' : ''}>In Contact</option>
            <option value="in-progress" ${lead.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="closed" ${lead.status === 'closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td>${formatDate(lead.date)}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button class="icon-btn" onclick="window.viewLeadDetails('${lead.id}')" title="View Full Enquiry"><i class="fa-solid fa-eye"></i></button>
            <button class="icon-btn danger" onclick="window.deleteLead('${lead.id}')" title="Delete Enquiry"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  window.updateLeadStatus = function(id, newStatus) {
    const leads = getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx !== -1) {
      leads[idx].status = newStatus;
      saveLeads(leads);
      updateMetrics();
      showToast(`Lead status updated to ${formatStatus(newStatus)}`, 'success');
    }
  };

  window.deleteLead = function(id) {
    if (confirm('Are you sure you want to remove this lead record?')) {
      let leads = getLeads();
      leads = leads.filter(l => l.id !== id);
      saveLeads(leads);
      renderLeadsList();
      updateMetrics();
      showToast('Contact lead deleted.', 'success');
    }
  };

  window.viewLeadDetails = function(id) {
    const leads = getLeads();
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    const modalBody = document.getElementById('lead-modal-content');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; background:rgba(255,255,255,0.03); padding:16px; border-radius:var(--radius-md); border:1px solid var(--card-border);">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Contact Name</span>
            <div style="font-weight:700; color:#fff; font-size:1.05rem; margin-top:2px;">${escapeHtml(lead.name)}</div>
          </div>
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Company / Org</span>
            <div style="font-weight:700; color:#fff; font-size:1.05rem; margin-top:2px;">${escapeHtml(lead.company || 'N/A')}</div>
          </div>
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Email</span>
            <div><a href="mailto:${escapeHtml(lead.email)}" style="color:var(--accent-green); font-weight:600;">${escapeHtml(lead.email)}</a></div>
          </div>
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Phone Number</span>
            <div style="color:#fff; font-weight:600;">${escapeHtml(lead.phone || 'N/A')}</div>
          </div>
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Requested Service</span>
            <div style="color:var(--accent-gold); font-weight:700;">${escapeHtml(lead.service)}</div>
          </div>
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Estimated Budget</span>
            <div style="color:#fff; font-weight:600;">${escapeHtml(lead.budget || 'Unspecified')}</div>
          </div>
        </div>

        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:6px;">Project Enquiry Message</span>
          <div style="background:rgba(0,0,0,0.3); padding:16px; border-radius:var(--radius-md); border:1px solid var(--card-border); color:#e2e8f0; font-size:0.92rem; white-space:pre-wrap; line-height:1.6;">
            ${escapeHtml(lead.message || 'No message text provided.')}
          </div>
        </div>
      </div>
    `;

    const replyBtn = document.getElementById('lead-reply-btn');
    if (replyBtn) {
      replyBtn.href = `mailto:${lead.email}?subject=Whiteleaf%20Interiors%20Inquiry%20Response&body=Hello%20${encodeURIComponent(lead.name)},%0A%0AThank%20you%20for%20contacting%20Whiteleaf%20Interiors...`;
    }

    openModal('modal-lead-details');
  };

  function exportLeadsCSV() {
    const leads = getLeads();
    if (leads.length === 0) {
      showToast('No leads available to export.', 'error');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Status', 'Date', 'Message'];
    const rows = leads.map(l => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      l.status,
      l.date,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Whiteleaf_Leads_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Leads exported to CSV successfully!', 'success');
  }

  // --- 8. ANALYTICS VIEW ---
  function initAnalyticsView() {
    // Renders visual distribution bars in tab-analytics
    const projects = getProjects();
    const leads = getLeads();

    const categoryCounts = {
      exhibitions: projects.filter(p => p.category === 'exhibitions').length,
      interiors: projects.filter(p => p.category === 'interiors').length,
      events: projects.filter(p => p.category === 'events').length,
      activations: projects.filter(p => p.category === 'activations').length
    };

    const container = document.getElementById('analytics-bars');
    if (!container) return;

    const total = projects.length || 1;
    container.innerHTML = Object.keys(categoryCounts).map(cat => {
      const count = categoryCounts[cat];
      const pct = Math.round((count / total) * 100);
      return `
        <div style="margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
            <span style="text-transform:capitalize; font-weight:700; color:#fff;">${cat}</span>
            <span style="color:var(--text-muted);">${count} Projects (${pct}%)</span>
          </div>
          <div style="height:10px; background:rgba(255,255,255,0.06); border-radius:var(--radius-pill); overflow:hidden;">
            <div style="width:${pct}%; height:100%; background:var(--accent-green); border-radius:var(--radius-pill); transition:width 0.6s ease;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 9. MODALS LOGIC ---
  function initModals() {
    // Add Project Modal Trigger
    const btnAddProject = document.getElementById('btn-add-project-trigger');
    if (btnAddProject) {
      btnAddProject.addEventListener('click', function () {
        document.getElementById('project-form').reset();
        document.getElementById('project-id').value = '';
        document.getElementById('modal-project-title').textContent = 'Add New Experience Project';
        openModal('modal-project');
      });
    }

    // Save Project Form
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
      projectForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('project-id').value || 'proj-' + Date.now();
        const title = document.getElementById('project-title-input').value.trim();
        const category = document.getElementById('project-category-input').value;
        const client = document.getElementById('project-client-input').value.trim();
        const year = document.getElementById('project-year-input').value.trim();
        const location = document.getElementById('project-location-input').value.trim();
        const image = document.getElementById('project-image-input').value.trim() || 'assets/project photo/project_1.jpg';
        const description = document.getElementById('project-desc-input').value.trim();
        const featured = document.getElementById('project-featured-input').checked;

        const projects = getProjects();
        const existingIdx = projects.findIndex(p => p.id === id);

        const projectObj = {
          id,
          title,
          category,
          client,
          year,
          location,
          image,
          description,
          featured,
          createdAt: existingIdx !== -1 ? projects[existingIdx].createdAt : new Date().toISOString().slice(0, 10)
        };

        if (existingIdx !== -1) {
          projects[existingIdx] = projectObj;
          showToast('Project specifications updated!', 'success');
        } else {
          projects.unshift(projectObj);
          showToast('New project created and published!', 'success');
        }

        saveProjects(projects);
        closeModal('modal-project');
        renderProjectsList();
        updateMetrics();
      });
    }

    // Modal Close Buttons
    document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
      btn.addEventListener('click', function () {
        const backdrop = this.closest('.modal-backdrop');
        if (backdrop) backdrop.classList.remove('active');
      });
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  // --- UTILS ---
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconClass = type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check';
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${escapeHtml(message)}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function formatStatus(status) {
    const map = {
      new: 'New',
      'in-contact': 'In Contact',
      contacted: 'Contacted',
      'in-progress': 'In Progress',
      closed: 'Closed'
    };
    return map[status] || status;
  }

  function formatDate(isoStr) {
    if (!isoStr) return 'N/A';
    const date = new Date(isoStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
