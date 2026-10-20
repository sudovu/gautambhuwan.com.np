/**
 * VHUWON MATHERS — Interactive Enterprise Network Flow Simulator
 * Domain: gautambhuwan.com.np
 * Live visual simulation of multi-tier data flows (LAN, Voice QoS, CCTV Enclave, Wi-Fi, Threat Block)
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('network-transformation');
  if (!container) return;

  // Simulator State
  const simState = {
    activeFlow: 'all', // 'all', 'lan', 'voice', 'cctv', 'wifi', 'attack'
    isPlaying: true,
    speed: 1,
    currentStep: 0,
    intervalId: null
  };

  // Flow Definitions for the AFTER Segmented Topology
  const FLOWS = {
    lan: {
      id: 'lan',
      name: 'Workstation Data LAN',
      color: '#06b6d4', // Cyan
      vlan: 'VLAN 20 (Staff Data)',
      protocol: 'TCP / HTTPS (Port 443)',
      priority: 'Standard (Best Effort)',
      path: ['node-pc', 'node-dfp', 'node-edge-sw', 'node-core-sw', 'node-gw', 'node-isp'],
      logText: 'PC traffic authenticated and routed to Internet via Core Switch trunk.'
    },
    voice: {
      id: 'voice',
      name: 'IP Telephony (VoIP)',
      color: '#a855f7', // Purple
      vlan: 'VLAN 50 (Voice QoS)',
      protocol: 'SIP / RTP (DSCP EF Expedited Forwarding)',
      priority: 'High Priority (Zero Jitter)',
      path: ['node-phone', 'node-dfp', 'node-voice-sw', 'node-core-sw', 'node-pbx'],
      logText: 'VoIP call routed to IP PBX Server with hardware-rate DSCP priority queueing.'
    },
    cctv: {
      id: 'cctv',
      name: 'CCTV Surveillance Stream',
      color: '#10b981', // Emerald
      vlan: 'VLAN 60 (CCTV Enclave)',
      protocol: 'RTSP Video Stream (H.265)',
      priority: 'Maximum Security (Non-Routable)',
      path: ['node-cctv', 'node-sfp', 'node-cctv-sw', 'node-core-sw', 'node-nvr'],
      blockedAt: 'node-gw',
      logText: 'Camera feed routed locally to 32-Ch NVR. Direct Internet egress is BLOCKED by firewall.'
    },
    wifi: {
      id: 'wifi',
      name: 'Wireless Access (Staff / Guest)',
      color: '#3b82f6', // Blue
      vlan: 'VLAN 30 (Staff) / VLAN 40 (Guest)',
      protocol: 'WPA3 / 802.1X & DHCP',
      priority: 'Client Isolated',
      path: ['node-ap', 'node-sfp', 'node-ap-sw', 'node-core-sw', 'node-gw', 'node-isp'],
      logText: 'Guest device connected with Layer 2 Client Isolation. Internal subnets restricted.'
    },
    attack: {
      id: 'attack',
      name: 'Simulated Lateral Attack Block',
      color: '#ef4444', // Red
      vlan: 'VLAN 40 -> VLAN 60 (Unauthorized Probe)',
      protocol: 'TCP SYN Port Scan (Port 554 RTSP)',
      priority: 'ACCESS DENIED',
      path: ['node-ap', 'node-sfp', 'node-ap-sw', 'node-core-sw'],
      blockedAt: 'node-core-sw',
      logText: 'BLOCKED: Guest endpoint attempted lateral scan toward CCTV VLAN 60. Dropped by ACL!'
    }
  };

  const telemetryLog = document.getElementById('sim-telemetry-log');
  const simFlowTag = document.getElementById('sim-active-flow-tag');
  const simStatusBanner = document.getElementById('sim-status-banner');
  const flowButtons = document.querySelectorAll('.flow-btn');
  const playPauseBtn = document.getElementById('btn-sim-play-pause');

  // Node Elements in SVG
  const nodeIds = [
    'node-isp', 'node-gw', 'node-core-sw', 'node-edge-sw', 'node-voice-sw',
    'node-cctv-sw', 'node-ap-sw', 'node-dfp', 'node-sfp', 'node-pbx',
    'node-nvr', 'node-pc', 'node-phone', 'node-cctv', 'node-ap'
  ];

  function logTelemetry(flow, sourceNode, targetNode, statusMsg, isBlocked = false) {
    if (!telemetryLog) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    
    const badgeColor = isBlocked ? '#ef4444' : flow.color;
    const logItem = document.createElement('div');
    logItem.className = 'sim-log-row';
    logItem.innerHTML = `
      <span class="sim-log-time">${timeStr}</span>
      <span class="sim-log-tag" style="background: ${badgeColor}22; color: ${badgeColor}; border: 1px solid ${badgeColor}44;">
        ${flow.name.toUpperCase()}
      </span>
      <span class="sim-log-route">${sourceNode} &rarr; ${targetNode}</span>
      <span class="sim-log-proto" style="color: var(--text-dim); font-size: 0.72rem;">[${flow.protocol}]</span>
      <span class="sim-log-status" style="color: ${isBlocked ? '#ef4444' : '#10b981'}; font-weight: 700;">
        ${statusMsg}
      </span>
    `;

    telemetryLog.prepend(logItem);
    // Keep log to max 6 entries
    while (telemetryLog.children.length > 6) {
      telemetryLog.removeChild(telemetryLog.lastChild);
    }
  }

  function highlightNode(nodeId, color, pulse = false) {
    const elem = document.getElementById(nodeId);
    if (!elem) return;
    elem.classList.add('node-active-flow');
    elem.style.borderColor = color;
    elem.style.boxShadow = `0 0 16px ${color}66`;

    setTimeout(() => {
      elem.classList.remove('node-active-flow');
      elem.style.borderColor = '';
      elem.style.boxShadow = '';
    }, 700);
  }

  function runFlowSimulation(flowKey) {
    const flow = FLOWS[flowKey];
    if (!flow) return;

    if (simFlowTag) {
      simFlowTag.textContent = flow.name.toUpperCase();
      simFlowTag.style.color = flow.color;
      simFlowTag.style.borderColor = flow.color + '66';
      simFlowTag.style.background = flow.color + '15';
    }

    if (simStatusBanner) {
      simStatusBanner.innerHTML = `
        <strong>${flow.vlan}</strong> &bull; Protocol: <code>${flow.protocol}</code> &bull; Priority: <span style="color: ${flow.color}">${flow.priority}</span>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">${flow.logText}</div>
      `;
    }

    // Traverse the path step by step
    let stepIndex = 0;
    const path = flow.path;

    function nextStep() {
      if (!simState.isPlaying) return;
      if (stepIndex >= path.length) {
        // If attack flow, flash blocked indicator
        if (flow.blockedAt) {
          const blockedElem = document.getElementById(flow.blockedAt);
          if (blockedElem) {
            blockedElem.style.borderColor = '#ef4444';
            blockedElem.style.boxShadow = '0 0 20px #ef4444aa';
            setTimeout(() => {
              blockedElem.style.borderColor = '';
              blockedElem.style.boxShadow = '';
            }, 900);
          }
          logTelemetry(flow, path[path.length - 1], 'BLOCKED_TARGET', 'ACCESS DENIED BY ACL', true);
        }
        return;
      }

      const currentNode = path[stepIndex];
      const nextNode = path[stepIndex + 1] || (flow.blockedAt ? 'FIREWALL' : 'ENDPOINT');
      
      highlightNode(currentNode, flow.color);
      
      const isBlocked = (flow.blockedAt && stepIndex === path.length - 1);
      const statusText = isBlocked ? 'BLOCKED BY ZERO-TRUST ACL' : 'FORWARDED (LINE RATE)';
      
      logTelemetry(flow, currentNode.replace('node-', '').toUpperCase(), nextNode.replace('node-', '').toUpperCase(), statusText, isBlocked);

      stepIndex++;
      if (stepIndex < path.length) {
        setTimeout(nextStep, 500);
      }
    }

    nextStep();
  }

  // Auto-Cycle Engine
  const flowKeys = ['lan', 'voice', 'cctv', 'wifi', 'attack'];
  let cycleIdx = 0;

  function cycleNext() {
    if (!simState.isPlaying) return;
    if (simState.activeFlow === 'all') {
      const key = flowKeys[cycleIdx % flowKeys.length];
      runFlowSimulation(key);
      cycleIdx++;
    } else {
      runFlowSimulation(simState.activeFlow);
    }
  }

  // Start interval
  simState.intervalId = setInterval(cycleNext, 3400);
  setTimeout(cycleNext, 600); // trigger first immediately

  // Flow selection buttons
  flowButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const flow = btn.getAttribute('data-flow');
      flowButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      simState.activeFlow = flow;

      if (flow === 'all') {
        cycleNext();
      } else {
        runFlowSimulation(flow);
      }
    });
  });

  // Play / Pause Button
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      simState.isPlaying = !simState.isPlaying;
      if (simState.isPlaying) {
        playPauseBtn.innerHTML = `<span>⏸ Pause Simulation</span>`;
        playPauseBtn.style.background = 'rgba(16, 185, 129, 0.15)';
        playPauseBtn.style.borderColor = '#10b981';
        cycleNext();
      } else {
        playPauseBtn.innerHTML = `<span>▶ Resume Simulation</span>`;
        playPauseBtn.style.background = 'rgba(245, 158, 11, 0.15)';
        playPauseBtn.style.borderColor = '#f59e0b';
      }
    });
  }
});
