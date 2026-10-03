/**
 * VHUWON MATHERS — Interactive Labs Command Line Simulator
 * Domain: gautambhuwan.com.np
 * Provides a client-side network CLI emulator and per-lab simulation runner
 */

document.addEventListener('DOMContentLoaded', () => {
  // Command Output Database
  const SIMULATOR_COMMANDS = {
    'help': `Available Simulation Commands:
  [Cisco IOS Routing & High Availability]
    show ip ospf neighbor        - Inspect OSPFv2 neighbor state & dead timers (Lab #001)
    show ip route ospf           - Display OSPF learned route table & summary masks (Lab #001)
    show standby brief           - Verify HSRPv2 active/standby state & tracking (Lab #004)
    show etherchannel summary    - Check LACP 802.3ad port-channel trunk bundle (Lab #004)
    show crypto session detail   - Inspect IPsec VTI phase 1/2 cryptographic tunnels (Lab #005)
    show ip bgp summary          - Verify eBGP dynamic neighbor peering across VTI (Lab #005)
    show ip route summary        - Display contiguous hierarchical route summarization (Lab #007)
    show ip interface brief      - List router subinterfaces, status & IP assignments (Lab #007)

  [MikroTik RouterOS Edge Gateway]
    /ip route print              - Inspect recursive check-gateway multi-WAN routing (Lab #006)
    /queue tree print            - View Per-Connection Queue (PCQ) bandwidth shaping (Lab #006)
    /ip firewall mangle print    - Inspect Per-Connection Classifier (PCC) marks (Lab #006)

  [Linux Systems & Container Architecture]
    nginx -t                     - Validate Nginx reverse proxy syntax & upstream conf (Lab #002)
    curl -I https://gautambhuwan.com.np - Probe HTTP/2 headers & TLS 1.3 handshakes (Lab #002)
    docker network inspect app_net - Inspect isolated bridge namespace & container IPs (Lab #003)
    docker ps                    - View running microservice containers (Lab #003)

  [Utilities & Diagnostics]
    subnet 172.16.0.0/23         - Run live VLSM CIDR calculation engine (Lab #007)
    ping 10.255.255.2            - Transmit ICMP echo packets across IPsec VTI tunnel
    ping 8.8.8.8                 - Probe recursive failover public DNS gateway
    uname -a                     - Inspect host kernel & architecture
    clear                        - Clear simulator screen`,

    'show ip ospf neighbor': `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/BDR        00:00:34    10.0.0.2        GigabitEthernet0/0/0
3.3.3.3           1   FULL/DR         00:00:31    10.0.0.6        GigabitEthernet0/0/1
Core-ABR# %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on Gi0/0/0 from LOADING to FULL, Done`,

    'show ip route ospf': `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       O - OSPF, IA - OSPF inter area, N1 - OSPF NSSA external type 1

Gateway of last resort is 10.0.0.1 to network 0.0.0.0

O IA  192.168.0.0/16 [110/20] via 10.0.0.2, 02:41:18, GigabitEthernet0/0/0
O     10.0.0.4/30 [110/2] via 10.0.0.6, 02:41:18, GigabitEthernet0/0/1
O IA  192.168.20.0/24 [110/11] via 10.0.0.2, 02:39:04, GigabitEthernet0/0/0`,

    'show standby brief': `                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vlan10      10   110 P Active  local           192.168.10.3    192.168.10.1
Vlan20      20   110 P Active  local           192.168.20.3    192.168.20.1
DSW1# %HSRP-5-STATECHANGE: Vlan10 Grp 10 state Standby -> Active (Preempted)
DSW1# Tracking Gi0/0 state UP, decrement 20`,

    'show etherchannel summary': `Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)
DSW1# Port-Channel 1 Status: Operational (2 Gbps Aggregate Bandwidth Full-Duplex)`,

    'show crypto session detail': `Crypto session current status: UP-ACTIVE

Interface: Tunnel0
Session status: UP-ACTIVE
Peer: 203.0.113.2 port 500 fvrf: (none) ivrf: (none)
      Phase1 id: 203.0.113.2
      IKEv2 SA: local 198.51.100.2/500 remote 203.0.113.2/500 Active
        Capabilities: AES-GCM-256 PRF-SHA256 DH19 (ECDH-256)
      IPsec FLOW: permit ip 0.0.0.0/0.0.0.0 0.0.0.0/0.0.0.0
        Active SAs: 2, origin: crypto profile IPSEC-VTI-PROF
        Inbound  Pkts: 48920, Decrypted: 48920, Errors: 0
        Outbound Pkts: 49104, Encrypted: 49104, Errors: 0
        TCP MSS Clamping: Inbound/Outbound adjusted to 1360 bytes (No Fragmentation)`,

    'show ip bgp summary': `BGP router identifier 10.255.255.1, local AS number 65001
BGP table version is 8, main routing table version 8
2 network entries using 496 bytes of memory
2 path entries using 272 bytes of memory

Neighbor        V         AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.255.255.2    4      65002    1489    1491        8    0    0 04:18:22        2
HQ-Core# Dynamic BGP Peering Established across IPsec VTI Tunnel0 (Sub-second DPD Active)`,

    '/ip route print': `Flags: X - disabled, A - active, D - dynamic, C - connect, S - static, r - rip, b - bgp, o - ospf, m - mme
 #      DST-ADDRESS        PREF-SRC        GATEWAY            DISTANCE
 0 A S  0.0.0.0/0                          1.1.1.1                   1  (ISP1-Recursive: ACTIVE, ping reachable)
 1   S  0.0.0.0/0                          8.8.8.8                   2  (ISP2-Recursive: STANDBY-BACKUP)
 2 A S  1.1.1.1/32                         192.168.1.1 (ether1-wan1) 1
 3 A S  8.8.8.8/32                         192.168.2.1 (ether2-wan2) 1
[admin@MikroTik-Edge] > Multi-Hop Target Scope 11 Check-Gateway PING: Operational`,

    '/queue tree print': `Flags: X - disabled, I - invalid
 0   name="Total-Download" parent=bridge-lan packet-mark="" limit-at=0 queue=pcq-download priority=1 max-limit=50M burst-limit=0
     rate=28.4Mbps packet-rate=2410 dropped=0
 1   name="Total-Upload" parent=ether1-wan1 packet-mark="" limit-at=0 queue=pcq-upload priority=1 max-limit=20M burst-limit=0
     rate=8.9Mbps packet-rate=982 dropped=0
[admin@MikroTik-Edge] > PCQ Dynamic Bufferbloat Prevention: ZERO drops on voice/DNS classes`,

    '/ip firewall mangle print': `Flags: X - disabled, I - invalid, D - dynamic
 0  chain=prerouting action=mark-connection new-connection-mark=ISP1_conn passthrough=yes dst-address-type=!local in-interface=bridge-lan per-connection-classifier=both-addresses:2/0
 1  chain=prerouting action=mark-connection new-connection-mark=ISP2_conn passthrough=yes dst-address-type=!local in-interface=bridge-lan per-connection-classifier=both-addresses:2/1
 2  chain=prerouting action=mark-routing new-routing-mark=to_ISP1 passthrough=no in-interface=bridge-lan connection-mark=ISP1_conn
 3  chain=prerouting action=mark-routing new-routing-mark=to_ISP2 passthrough=no in-interface=bridge-lan connection-mark=ISP2_conn`,

    'nginx -t': `nginx: the configuration file /etc/nginx/sites-available/production.conf syntax is ok
nginx: configuration file /etc/nginx/sites-available/production.conf test is successful`,

    'curl -I https://gautambhuwan.com.np': `HTTP/2 200 OK
date: Sat, 03 Oct 2026 14:48:10 GMT
content-type: text/html; charset=utf-8
server: GitHub.com / Nginx Anycast Edge
strict-transport-security: max-age=31536000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
access-control-allow-origin: *
cache-control: public, max-age=600`,

    'docker network inspect app_net': `[
  {
    "Name": "app_net",
    "Id": "a98f12c8b0e4392182098",
    "Scope": "local",
    "Driver": "bridge",
    "EnableIPv6": false,
    "IPAM": {
      "Driver": "default",
      "Config": [
        {
          "Subnet": "172.28.0.0/16",
          "Gateway": "172.28.0.1"
        }
      ]
    },
    "Containers": {
      "3a4b5c6d7e8f": {
        "Name": "secure_gateway",
        "IPv4Address": "172.28.0.10/16"
      }
    }
  }
]`,

    'docker ps': `CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES
3a4b5c6d7e8f   nginx:alpine   "/docker-entrypoint.…"   4 days ago      Up 4 days      0.0.0.0:8080->80/tcp   secure_gateway`,

    'show ip route summary': `IP routing table name is default (0x0)
Route Source    Networks    Subnets     Replicates  Overhead    Memory (bytes)
connected       0           7           0           448         1120
static          0           1           0           64          160
ospf 1          1           0           0           64          160
  Summary Route: 172.16.0.0/23 (Area 1 contiguous boundary)
Total           1           8           0           576         1440`,

    'show ip interface brief': `Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   unassigned      YES unset  up                    up
GigabitEthernet0/0/0.10 172.16.0.1     YES manual up                    up
GigabitEthernet0/0/0.20 172.16.0.129   YES manual up                    up
GigabitEthernet0/0/0.30 172.16.0.193   YES manual up                    up
GigabitEthernet0/0/0.40 172.16.0.225   YES manual up                    up
GigabitEthernet0/0/0.50 172.16.1.1     YES manual up                    up
GigabitEthernet0/0/0.99 172.16.1.129   YES manual up                    up
Tunnel0                10.255.255.1    YES manual up                    up`,

    'subnet 172.16.0.0/23': `[VLSM Subnet Calculation Result]
  Supernet: 172.16.0.0/23 (Mask: 255.255.254.0 | Total Addresses: 512)
  Dual-Stack IPv6 Root: 2001:db8:acad::/48

  Subnet 1: 172.16.0.0/25   (110 hosts) -> Range: 172.16.0.1 - 172.16.0.126   (Brd: 172.16.0.127) | IPv6: 2001:db8:acad:10::/64
  Subnet 2: 172.16.0.128/26  (55 hosts) -> Range: 172.16.0.129 - 172.16.0.190 (Brd: 172.16.0.191) | IPv6: 2001:db8:acad:20::/64
  Subnet 3: 172.16.0.192/27  (28 hosts) -> Range: 172.16.0.193 - 172.16.0.222 (Brd: 172.16.0.223) | IPv6: 2001:db8:acad:30::/64
  Subnet 4: 172.16.0.224/27  (26 hosts) -> Range: 172.16.0.225 - 172.16.0.254 (Brd: 172.16.0.255) | IPv6: 2001:db8:acad:40::/64
  Subnet 5: 172.16.1.0/25   (120 hosts) -> Range: 172.16.1.1 - 172.16.1.126   (Brd: 172.16.1.127) | IPv6: 2001:db8:acad:50::/64
  Subnet 6: 172.16.1.128/28  (12 hosts) -> Range: 172.16.1.129 - 172.16.1.142 (Brd: 172.16.1.143) | IPv6: 2001:db8:acad:99::/64
  Subnet 7: 172.16.1.240/30   (2 hosts) -> Range: 172.16.1.241 - 172.16.1.242 (Brd: 172.16.1.243) | IPv6: 2001:db8:acad:fff0::/64
  Subnet 8: 172.16.1.244/30   (2 hosts) -> Range: 172.16.1.245 - 172.16.1.246 (Brd: 172.16.1.247) | IPv6: 2001:db8:acad:fff1::/64
  Efficiency: 94.6% address utilization | Zero fragmented broadcast domains`,

    'ping 10.255.255.2': `Sending 5, 100-byte ICMP Echos to 10.255.255.2 (Branch VTI Endpoint), timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 14/18/24 ms (Encrypted over IPsec VTI)`,

    'ping 8.8.8.8': `Sending 5, 64-byte ICMP Echos to 8.8.8.8 (Google Anycast DNS via ISP1):
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 9/12/17 ms (Recursive Check-Gateway: OK)`,

    'uname -a': `Linux vm-primary 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`,

    'whoami': `neteng@gautambhuwan.com.np (Vhuwon Mathers - NetEng Node #01)`
  };

  // Map each lab to its verification command
  const LAB_VERIFICATIONS = {
    'lab-001': 'show ip ospf neighbor',
    'lab-002': 'curl -I https://gautambhuwan.com.np',
    'lab-003': 'docker network inspect app_net',
    'lab-004': 'show standby brief',
    'lab-005': 'show crypto session detail',
    'lab-006': '/ip route print',
    'lab-007': 'subnet 172.16.0.0/23'
  };

  // 1. Initialize Interactive CLI Sandbox
  const sandboxScreen = document.getElementById('sandbox-screen');
  const sandboxInput = document.getElementById('sandbox-input');
  const sandboxChips = document.querySelectorAll('.sandbox-chip');
  const commandHistory = [];
  let historyIndex = -1;

  function printToSandbox(cmdText, outputText, isError = false) {
    if (!sandboxScreen) return;
    const outputGroup = document.createElement('div');
    outputGroup.style.marginBottom = '14px';

    if (cmdText) {
      const promptLine = document.createElement('div');
      promptLine.innerHTML = `<span style="color: var(--accent-secondary); font-weight: 700;">VM-Gateway#</span> <span style="color: #f8fafc;">${escapeHtml(cmdText)}</span>`;
      outputGroup.appendChild(promptLine);
    }

    const resultPre = document.createElement('pre');
    resultPre.style.color = isError ? '#ef4444' : '#a5f3fc';
    resultPre.style.marginTop = '4px';
    resultPre.textContent = outputText;
    outputGroup.appendChild(resultPre);

    sandboxScreen.appendChild(outputGroup);
    sandboxScreen.scrollTop = sandboxScreen.scrollHeight;
  }

  function executeSandboxCommand(rawCmd) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    const lowerCmd = cmd.toLowerCase();

    if (lowerCmd === 'clear') {
      if (sandboxScreen) {
        sandboxScreen.innerHTML = `
          <div style="color: var(--text-dim); margin-bottom: 12px; font-size: 0.78rem;">
            [VM-NETOS v2.6.4 // RECONFIGURED & READY] Type 'help' to inspect command catalog.
          </div>
        `;
      }
      return;
    }

    // Match exact or case-insensitive command
    let matchedKey = Object.keys(SIMULATOR_COMMANDS).find(k => k.toLowerCase() === lowerCmd);

    // Fallback partial matching
    if (!matchedKey) {
      if (lowerCmd.startsWith('ping')) {
        matchedKey = 'ping 10.255.255.2';
      } else if (lowerCmd.startsWith('subnet')) {
        matchedKey = 'subnet 172.16.0.0/23';
      } else if (lowerCmd.includes('ospf')) {
        matchedKey = 'show ip ospf neighbor';
      } else if (lowerCmd.includes('standby') || lowerCmd.includes('hsrp')) {
        matchedKey = 'show standby brief';
      } else if (lowerCmd.includes('bgp')) {
        matchedKey = 'show ip bgp summary';
      } else if (lowerCmd.includes('etherchannel') || lowerCmd.includes('lacp')) {
        matchedKey = 'show etherchannel summary';
      } else if (lowerCmd.includes('docker')) {
        matchedKey = 'docker network inspect app_net';
      } else if (lowerCmd.includes('nginx')) {
        matchedKey = 'nginx -t';
      } else if (lowerCmd.includes('route')) {
        matchedKey = 'show ip route ospf';
      }
    }

    if (matchedKey && SIMULATOR_COMMANDS[matchedKey]) {
      printToSandbox(cmd, SIMULATOR_COMMANDS[matchedKey]);
    } else {
      printToSandbox(
        cmd,
        `% Command unrecognized: "${cmd}".\nType 'help' to view all supported Cisco IOS, MikroTik, Linux, and VLSM commands.`,
        true
      );
    }
  }

  if (sandboxInput) {
    sandboxInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = sandboxInput.value;
        sandboxInput.value = '';
        executeSandboxCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          sandboxInput.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          sandboxInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          sandboxInput.value = '';
        }
      }
    });
  }

  // Quick Chips in Sandbox
  sandboxChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd') || chip.textContent.trim();
      if (sandboxInput) {
        sandboxInput.value = cmd;
        sandboxInput.focus();
      }
      executeSandboxCommand(cmd);
    });
  });

  // 2. Per-Lab Card Simulation Runners
  const labArticles = document.querySelectorAll('article[id^="lab-"]');

  labArticles.forEach(article => {
    const labId = article.id;
    const terminalCard = article.querySelector('.terminal-card');
    if (!terminalCard) return;

    const terminalHeader = terminalCard.querySelector('.terminal-header');
    const terminalBody = terminalCard.querySelector('.terminal-body');
    if (!terminalHeader || !terminalBody) return;

    // Check if toolbar already injected
    if (terminalHeader.querySelector('.terminal-actions')) return;

    // Create action buttons in header
    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'terminal-actions';

    const runBtn = document.createElement('button');
    runBtn.type = 'button';
    runBtn.className = 'terminal-btn btn-run';
    runBtn.innerHTML = `<span>▶ Run Live Test</span>`;
    runBtn.title = 'Simulate and verify configuration output';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'terminal-btn';
    copyBtn.innerHTML = `<span>📋 Copy</span>`;
    copyBtn.title = 'Copy configuration';

    actionsGroup.appendChild(runBtn);
    actionsGroup.appendChild(copyBtn);
    terminalHeader.appendChild(actionsGroup);

    // Create output container
    const outputContainer = document.createElement('div');
    outputContainer.className = 'terminal-output-view';
    outputContainer.innerHTML = `
      <div class="terminal-live-badge">
        <span class="status-dot" style="background: #10b981;"></span> VERIFICATION PASS // SIMULATION RESULT
      </div>
      <pre style="margin: 0; color: #a5f3fc; font-family: inherit; font-size: inherit;"></pre>
    `;
    terminalCard.appendChild(outputContainer);

    // Copy event
    copyBtn.addEventListener('click', () => {
      const codeText = terminalBody.innerText;
      if (window.AppData && typeof window.AppData.copyToClipboard === 'function') {
        window.AppData.copyToClipboard(codeText, copyBtn);
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(codeText).then(() => {
          const original = copyBtn.innerHTML;
          copyBtn.innerHTML = `<span>✓ Copied!</span>`;
          setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
        });
      }
    });

    // Run / Toggle event
    runBtn.addEventListener('click', () => {
      const isShowingOutput = outputContainer.classList.contains('is-visible');

      if (isShowingOutput) {
        // Toggle back to config view
        outputContainer.classList.remove('is-visible');
        terminalBody.style.display = 'block';
        runBtn.innerHTML = `<span>▶ Run Live Test</span>`;
        runBtn.classList.remove('btn-reset');
        runBtn.classList.add('btn-run');
      } else {
        // Run live simulation
        const testCmd = LAB_VERIFICATIONS[labId] || 'show ip route summary';
        const simulatedOutput = SIMULATOR_COMMANDS[testCmd] || 'Verification pass: Status UP/UP';

        const pre = outputContainer.querySelector('pre');
        pre.innerHTML = `<span style="color: var(--accent-secondary); font-weight: 700;">Device#</span> <span style="color: #f8fafc;">${escapeHtml(testCmd)}</span>\n\n${escapeHtml(simulatedOutput)}`;

        terminalBody.style.display = 'none';
        outputContainer.classList.add('is-visible');
        runBtn.innerHTML = `<span>◀ Show Config</span>`;
        runBtn.classList.remove('btn-run');
        runBtn.classList.add('btn-reset');
      }
    });
  });

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
