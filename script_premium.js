document.addEventListener('DOMContentLoaded', () => {
  // Reveal sections on scroll
  const revealTargets = document.querySelectorAll('.section, .sectioninteret');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => observer.observe(el));

  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  const toggleBackToTop = () => {
    if (window.scrollY > 180) backToTopBtn.classList.add('show');
    else backToTopBtn.classList.remove('show');
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });



  // =============================
  // Projects (cards + filters + modal)
  // =============================
  const projects = [
    {
      id: "icm-paid-media",
      title: "Pilotage Paid Media multi-canaux (+300 clubs)",
      subtitle: "Optimisation & recommandations sur Meta, Google, TikTok, Snapchat",
      category: ["acquisition", "data"],
      tags: ["Paid Media", "KPI", "Optimisation"],
      icon: "fa-bullseye",
      heroType: "gradient",
      context: "Pilotage et optimisation de campagnes d’acquisition pour un réseau multi-sites, avec une lecture orientée performance (CPL, CPA, ROAS, CVR).",
      actions: [
        "Analyse des performances et identification des leviers",
        "Recommandations d’optimisation (audiences, créas, budgets, placements)",
        "Suivi régulier des KPI et priorisation des actions"
      ],
      result: "Approche structurée et data-driven pour accélérer les cycles d’optimisation et améliorer la qualité des leads.",
      links: [
        { label: "Voir la section Expérience", href: "#experience" }
      ]
    },
    {
      id: "reporting-sheets",
      title: "Dashboard Google Sheets (N vs N-1)",
      subtitle: "Formules avancées, TCD, catégorisation campagnes & synthèse décisionnelle",
      category: ["data"],
      tags: ["Google Sheets", "TCD", "Automatisation"],
      icon: "fa-table",
      heroType: "gradient",
      context: "Besoin d’un reporting fiable et actionnable pour suivre l’investissement et la performance, avec comparatifs N / N-1.",
      actions: [
        "Normalisation et catégorisation des campagnes",
        "Mise en place de TCD et tableaux comparatifs",
        "Automatisation via formules (filtrage, règles, extractions)"
      ],
      result: "Gain de temps et meilleure visibilité pour prendre des décisions rapides sur les campagnes et la création.",
      links: []
    },
    {
      id: "localads-creative-system",
      title: "Système de déclinaisons créa LocalAds",
      subtitle: "Briefs + déclinaisons feed/story + itérations orientées CPL",
      category: ["acquisition", "branding"],
      tags: ["Créa", "Brief", "A/B tests"],
      icon: "fa-pen-nib",
      heroType: "gradient",
      context: "Décliner rapidement des visuels pour de nombreux clubs tout en restant cohérent avec la DA et les objectifs de performance.",
      actions: [
        "Rédaction de briefs et cadrage DA",
        "Organisation des déclinaisons (formats, safe-zones, mentions)",
        "Itérations rapides selon les retours KPI"
      ],
      result: "Process plus fluide, assets plus adaptés aux objectifs et meilleure capacité à tester vite.",
      links: []
    },
    {
      id: "deeplink-app",
      title: "Deep link de téléchargement d’application (Web)",
      subtitle: "Détection iOS/Android + redirection vers la bonne store page",
      category: ["web"],
      tags: ["Webflow", "Deeplink", "UX"],
      icon: "fa-link",
      heroType: "gradient",
      context: "Faciliter le téléchargement de l’app avec une expérience simple : un seul lien, une redirection automatique.",
      actions: [
        "Conception du comportement (iOS/Android/Desktop)",
        "Mise en place du lien unique et tests",
        "Optimisation UX (CTA, tracking, fallback)"
      ],
      result: "Un parcours plus court et une meilleure expérience utilisateur pour l’installation.",
      links: []
    },
    {
      id: "realfake",
      title: "RealFake — contenu business & IA (side project)",
      subtitle: "Concept éditorial + identité + stratégie social media",
      category: ["branding", "acquisition"],
      tags: ["Social Media", "Brand", "Contenu"],
      icon: "fa-robot",
      heroType: "gradient",
      context: "Création d’un projet média orienté business, IA et mindset, avec une approche test & learn.",
      actions: [
        "Définition positionnement + format de contenus",
        "Création de templates et ligne éditoriale",
        "Optimisation des posts (hook, structure, CTA)"
      ],
      result: "Une base solide pour produire vite, tester et faire grandir l’audience.",
      links: []
    },
    {
      id: "bibi-scooter",
      title: "BiBi Scooter — abonnement scooter (side project)",
      subtitle: "Branding + funnel + landing orientée conversion",
      category: ["web", "branding"],
      tags: ["Landing", "Funnel", "Branding"],
      icon: "fa-motorcycle",
      heroType: "gradient",
      context: "Projet entrepreneurial : structurer l’offre, l’identité et un tunnel simple orienté acquisition.",
      actions: [
        "Clarification de l’offre et des personas",
        "Structure landing (AIDA) + CTA",
        "Mise en place d’un funnel de contact"
      ],
      result: "Une base exploitable pour lancer des campagnes et tester la demande.",
      links: []
    }
  ];

  const grid = document.getElementById('projectsGrid');
  const empty = document.getElementById('projectsEmpty');
  const chips = Array.from(document.querySelectorAll('.chip[data-filter]'));
  const searchInput = document.getElementById('projectSearch');

  let activeFilter = 'all';
  let query = '';

  const slugCategoryLabel = (slug) => {
    switch (slug) {
      case 'acquisition': return 'Acquisition';
      case 'data': return 'Data / Reporting';
      case 'web': return 'Web';
      case 'branding': return 'Branding';
      default: return slug;
    }
  };

  const matches = (p) => {
    const byFilter = activeFilter === 'all' || p.category.includes(activeFilter);
    const q = query.trim().toLowerCase();
    const byQuery = !q || [
      p.title, p.subtitle, p.tags.join(' '), p.category.join(' ')
    ].join(' ').toLowerCase().includes(q);
    return byFilter && byQuery;
  };

  const render = () => {
    if (!grid) return;
    const visible = projects.filter(matches);

    grid.innerHTML = visible.map((p) => {
      const tags = p.tags.slice(0, 3).map((t, i) => `<span class="tag ${i === 1 ? 'alt' : ''}">${t}</span>`).join('');
      const cats = p.category.map(c => `<span class="tag">${slugCategoryLabel(c)}</span>`).join('');
      return `
        <article class="project-card" data-project="${p.id}" tabindex="0" role="button" aria-label="Ouvrir le projet : ${p.title}">
          <div class="project-hero" aria-hidden="true">
            <div class="project-icon"><i class="fas ${p.icon}"></i></div>
          </div>
          <div class="project-body">
            <div class="project-tags" aria-label="Tags du projet">
              ${cats}
            </div>
            <div class="project-title">${p.title}</div>
            <div class="project-subtitle">${p.subtitle}</div>
            <div class="project-tags">${tags}</div>
            <div class="project-foot">
              <span><i class="fas fa-up-right-from-square"></i> Détails</span>
              <span>${p.category.map(slugCategoryLabel).join(' • ')}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (empty) empty.hidden = visible.length !== 0;
  };

  const setActiveChip = (filter) => {
    activeFilter = filter;
    chips.forEach((c) => {
      const isActive = c.dataset.filter === filter;
      c.classList.toggle('is-active', isActive);
      c.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    render();
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => setActiveChip(chip.dataset.filter));
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      query = e.target.value || '';
      render();
    });
  }

  // Initial render
  render();

  // Modal
  const modal = document.getElementById('projectModal');
  const modalHero = document.getElementById('modalHero');
  const modalTags = document.getElementById('modalTags');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalContext = document.getElementById('modalContext');
  const modalActions = document.getElementById('modalActions');
  const modalResult = document.getElementById('modalResult');
  const modalLinks = document.getElementById('modalLinks');

  let lastFocusEl = null;

  const openModal = (projectId) => {
    if (!modal) return;
    const p = projects.find(x => x.id === projectId);
    if (!p) return;

    lastFocusEl = document.activeElement;

    if (modalHero) {
      modalHero.style.background = "linear-gradient(135deg, rgba(42, 92, 130, 0.92) 0%, rgba(78, 205, 196, 0.88) 100%)";
    }

    if (modalTags) {
      modalTags.innerHTML = p.category.map(c => `<span class="tag">${slugCategoryLabel(c)}</span>`).join('') +
        p.tags.map((t, i) => `<span class="tag ${i % 2 === 1 ? 'alt' : ''}">${t}</span>`).join('');
    }

    if (modalTitle) modalTitle.textContent = p.title;
    if (modalSubtitle) modalSubtitle.textContent = p.subtitle;
    if (modalContext) modalContext.textContent = p.context;
    if (modalResult) modalResult.textContent = p.result;

    if (modalActions) {
      modalActions.innerHTML = p.actions.map(a => `<li>${a}</li>`).join('');
    }

    if (modalLinks) {
      const links = (p.links || []).map(l => `
        <a class="btn btn-ghost" href="${l.href}">
          <i class="fas fa-arrow-right"></i>
          <span>${l.label}</span>
        </a>`).join('');

      modalLinks.innerHTML = links || `<span style="color:#667;font-size:0.9rem;">(Aucun lien externe sur ce projet)</span>`;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // focus close button
    const closeBtn = modal.querySelector('[data-close="true"]');
    if (closeBtn) closeBtn.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
  };

  const tryOpenFromCard = (el) => {
    const card = el.closest && el.closest('.project-card');
    if (!card) return;
    const id = card.getAttribute('data-project');
    openModal(id);
  };

  if (grid) {
    grid.addEventListener('click', (e) => tryOpenFromCard(e.target));
    grid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tryOpenFromCard(e.target);
      }
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.getAttribute && target.getAttribute('data-close') === 'true') {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
    });
  }

  // Optional: anchor compatibility for "Voir la section Expérience"
  // Add an id to experience section if missing
  const expTitle = Array.from(document.querySelectorAll('.section-title span'))
    .find(sp => sp.textContent.trim().toLowerCase().includes('expérience'));
  if (expTitle) {
    const expSection = expTitle.closest('.section');
    if (expSection && !expSection.id) expSection.id = 'experience';
  }

});
