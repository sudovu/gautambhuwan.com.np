/**
 * VHUWON MATHERS — Projects Filtering & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  const projectSearchInput = document.getElementById('project-search-input');
  const projectSearchCount = document.getElementById('project-search-count');
  const jumpBottomProjectsBtn = document.getElementById('btn-jump-bottom-projects');
  const jumpBottomArchitectBtn = document.getElementById('btn-jump-bottom-architect');

  let activeCategory = 'all';

  function filterProjects() {
    const query = projectSearchInput ? projectSearchInput.value.trim().toLowerCase() : '';
    let matchCount = 0;
    let firstMatch = null;

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const text = card.innerText.toLowerCase();
      const cardId = card.id ? card.id.toLowerCase() : '';

      let catMatch = false;
      if (activeCategory === 'all') {
        catMatch = true;
      } else if (activeCategory === 'huawei') {
        catMatch = text.includes('huawei') || text.includes('cloudengine') || text.includes('vrp') || text.includes('olt');
      } else {
        catMatch = category === activeCategory;
      }

      const queryMatch = !query || text.includes(query) || cardId.includes(query);

      if (catMatch && queryMatch) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
        matchCount++;
        if (!firstMatch) firstMatch = card;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });

    if (projectSearchCount) {
      if (query || activeCategory !== 'all') {
        projectSearchCount.textContent = `(${matchCount} match${matchCount === 1 ? '' : 'es'})`;
      } else {
        projectSearchCount.textContent = '';
      }
    }

    return firstMatch;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects();
    });
  });

  if (projectSearchInput) {
    projectSearchInput.addEventListener('input', () => {
      filterProjects();
    });

    projectSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const match = filterProjects();
        if (match) {
          match.scrollIntoView({ behavior: 'smooth', block: 'start' });
          match.classList.add('lab-highlight-match');
          setTimeout(() => match.classList.remove('lab-highlight-match'), 2000);
        }
      } else if (e.key === 'Escape') {
        projectSearchInput.value = '';
        activeCategory = 'all';
        filterBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-filter') === 'all'));
        filterProjects();
      }
    });
  }

  // Fast-Travel Jump to Bottom Handlers
  function scrollToBottomProjects() {
    const bottomProject = document.getElementById('project-huawei-ce') || document.getElementById('project-huawei-olt') || document.querySelector('.project-card:last-of-type');
    if (bottomProject) {
      bottomProject.scrollIntoView({ behavior: 'smooth', block: 'start' });
      bottomProject.classList.add('lab-highlight-match');
      setTimeout(() => bottomProject.classList.remove('lab-highlight-match'), 2000);
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }

  if (jumpBottomProjectsBtn) {
    jumpBottomProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToBottomProjects();
    });
  }

  if (jumpBottomArchitectBtn) {
    jumpBottomArchitectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToBottomProjects();
    });
  }

  // Subnet Plan Modal Controller
  const subnetModal = document.getElementById('subnet-modal');
  const openModalBtn = document.getElementById('btn-open-subnet-modal');
  const closeModalBtn = document.getElementById('close-subnet-modal');
  const closeFooterBtn = document.getElementById('btn-close-subnet-footer');
  const copyPlanBtn = document.getElementById('btn-copy-subnet-plan');

  function openSubnetModal() {
    if (!subnetModal) return;
    subnetModal.classList.add('is-open');
    subnetModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSubnetModal() {
    if (!subnetModal) return;
    subnetModal.classList.remove('is-open');
    subnetModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openModalBtn) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSubnetModal();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeSubnetModal);
  }

  if (closeFooterBtn) {
    closeFooterBtn.addEventListener('click', closeSubnetModal);
  }

  if (subnetModal) {
    subnetModal.addEventListener('click', (e) => {
      if (e.target === subnetModal) {
        closeSubnetModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && subnetModal.classList.contains('is-open')) {
        closeSubnetModal();
      }
    });
  }

  // Copy Subnet Table as Markdown
  if (copyPlanBtn) {
    copyPlanBtn.addEventListener('click', () => {
      const planMarkdown = [
        '# VLSM Subnet Allocation Matrix (172.16.0.0/23 & 2001:db8:acad::/48)',
        '',
        '| Segment / Role | VLAN | Hosts Req. | Network ID | Prefix / Mask | Usable Host Range | Broadcast | Dual-Stack IPv6 |',
        '|---|---|---|---|---|---|---|---|',
        '| Engineering & Dev | VLAN 10 | 110 | 172.16.0.0 | /25 (255.255.255.128) | 172.16.0.1 – 172.16.0.126 | 172.16.0.127 | 2001:db8:acad:10::/64 |',
        '| Corporate Operations | VLAN 20 | 55 | 172.16.0.128 | /26 (255.255.255.192) | 172.16.0.129 – 172.16.0.190 | 172.16.0.191 | 2001:db8:acad:20::/64 |',
        '| Server Farm & DMZ | VLAN 30 | 28 | 172.16.0.192 | /27 (255.255.255.224) | 172.16.0.193 – 172.16.0.222 | 172.16.0.223 | 2001:db8:acad:30::/64 |',
        '| VoIP & Telephony | VLAN 40 | 26 | 172.16.0.224 | /27 (255.255.255.224) | 172.16.0.225 – 172.16.0.254 | 172.16.0.255 | 2001:db8:acad:40::/64 |',
        '| Guest Wi-Fi Zone | VLAN 50 | 120 | 172.16.1.0 | /25 (255.255.255.128) | 172.16.1.1 – 172.16.1.126 | 172.16.1.127 | 2001:db8:acad:50::/64 |',
        '| IT Out-of-Band Mgmt | VLAN 99 | 12 | 172.16.1.128 | /28 (255.255.255.240) | 172.16.1.129 – 172.16.1.142 | 172.16.1.143 | 2001:db8:acad:99::/64 |',
        '| HQ-to-Branch WAN Link | P2P | 2 | 172.16.1.240 | /30 (255.255.255.252) | 172.16.1.241 – 172.16.1.242 | 172.16.1.243 | 2001:db8:acad:fff0::/64 |',
        '| HQ-to-Cloud Link | P2P | 2 | 172.16.1.244 | /30 (255.255.255.252) | 172.16.1.245 – 172.16.1.246 | 172.16.1.247 | 2001:db8:acad:fff1::/64 |',
        '',
        'Summary Route: 172.16.0.0/23 (255.255.254.0)'
      ].join('\n');

      if (window.AppData && typeof window.AppData.copyToClipboard === 'function') {
        window.AppData.copyToClipboard(planMarkdown, copyPlanBtn);
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(planMarkdown).then(() => {
          const original = copyPlanBtn.innerHTML;
          copyPlanBtn.innerHTML = '<span>✓ Copied Table!</span>';
          setTimeout(() => { copyPlanBtn.innerHTML = original; }, 2000);
        });
      }
    });
  }
  // Network Transformation (Before vs. After) Tab Controller
  const transTabs = document.querySelectorAll('.transformation-tab-btn');
  const transPanels = document.querySelectorAll('.transformation-panel');

  if (transTabs.length && transPanels.length) {
    transTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');

        // Update Tab active states
        transTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Update Panel visibility
        transPanels.forEach(panel => {
          panel.classList.remove('is-active');
        });

        const activePanel = document.getElementById('panel-' + targetTab);
        if (activePanel) {
          activePanel.classList.add('is-active');
        }
      });
    });
  }
});
