/**
 * VHUWON MATHERS — Projects Filtering & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

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
});
