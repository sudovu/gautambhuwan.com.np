/**
 * VHUWON MATHERS — Universal Custom Project Architect & Simulator Engine
 * Domain: gautambhuwan.com.np
 * Interactive multi-vendor configuration generator and in-page CLI emulator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if architect container exists on page
  const architectContainer = document.getElementById('project-architect');
  if (!architectContainer) return;

  // State Management
  const state = {
    platform: 'cisco',
    scenario: 'cisco-campus',
    securityHardened: true,
    haRedundancy: true,
    dualStackIPv6: true,
    telemetryLogging: true,
    hostname: 'EDGE-CORE-01',
    subnet: '10.10.0.0/24'
  };

  // Scenario Catalog by Platform
  const SCENARIOS = {
    cisco: [
      {
        id: 'cisco-campus',
        title: 'Enterprise Campus LAN Core (HSRPv2 & LACP)',
        desc: 'Multi-layer switching core with HSRPv2 active/standby failover, 802.3ad LACP EtherChannel, Rapid-PVST+, and Port Security.'
      },
      {
        id: 'cisco-ipsec',
        title: 'Route-Based IPsec VTI VPN with Dynamic eBGP',
        desc: 'Virtual Tunnel Interface (VTI) with IKEv2 AES-256-GCM encryption, SHA-384 integrity, and dynamic eBGP multihop routing.'
      },
      {
        id: 'cisco-ospf',
        title: 'Multi-Area OSPF Enterprise Core & Summarization',
        desc: 'Area 0 backbone with Totally Stubby Area 10, contiguous route summarization, passive interfaces, and cryptographic MD5 auth.'
      },
      {
        id: 'cisco-zbfw',
        title: 'Zone-Based Policy Firewall (ZBFW) & Dynamic NAT',
        desc: 'Enterprise zone security (INSIDE, OUTSIDE, DMZ) with deep stateful packet inspection (CBAR) and overload NAT translation.'
      }
    ],
    mikrotik: [
      {
        id: 'mikrotik-dualwan',
        title: 'Dual-WAN PCC Balancing & Recursive Failover',
        desc: 'Per-Connection Classifier (PCC) packet marking with recursive check-gateway ping routing for seamless ISP failover.'
      },
      {
        id: 'mikrotik-wireguard',
        title: 'Zero-Trust WireGuard Site-to-Site Mesh & OSPF',
        desc: 'Kernel WireGuard VPN interface with ChaCha20-Poly1305 encryption, preshared keys, and dynamic OSPFv3 routing.'
      },
      {
        id: 'mikrotik-hotspot',
        title: 'ISP Edge Gateway with PCQ Fair-Queue QoS',
        desc: 'Per-Connection Queueing (PCQ) rate shaping, burst bandwidth allocation, and dynamic PPPoE / Hotspot subscriber control.'
      },
      {
        id: 'mikrotik-vlan',
        title: 'Multi-Tenant VLAN Bridge with Hardware Offload',
        desc: 'Bridge VLAN filtering with Layer 2 hardware offloading (L2HW), bridge firewall packet filters, and isolated customer trunks.'
      }
    ],
    linux: [
      {
        id: 'linux-nginx',
        title: 'Production Nginx Reverse Proxy with TLS 1.3',
        desc: 'Hardened HTTP/2 gateway, SSL session resumption, leaky-bucket rate limiting, and OWASP security headers.'
      },
      {
        id: 'linux-wireguard',
        title: 'Hardened WireGuard VPN Gateway & Split-Tunnel',
        desc: 'Linux kernel WireGuard interface with persistent keepalives, iptables masquerading, and strict forwarding policy.'
      },
      {
        id: 'linux-nftables',
        title: 'Stateful nftables Edge Firewall & Fail2ban Jails',
        desc: 'Modern Linux packet filtering replacing iptables, with connection tracking, SYN flood mitigation, and dynamic blacklisting.'
      },
      {
        id: 'linux-vrrp',
        title: 'Keepalived Dual-Node VRRP High-Availability Cluster',
        desc: 'Virtual Router Redundancy Protocol (VRRP) with health check tracking scripts and automated virtual IP (VIP) migration.'
      }
    ],
    docker: [
      {
        id: 'docker-traefik',
        title: 'Microservices Mesh with Traefik Ingress & TLS',
        desc: 'Automated reverse proxy with Let’s Encrypt ACME challenges, Docker socket discovery, and isolated user-defined bridge networks.'
      },
      {
        id: 'docker-webdb',
        title: 'Production Web App + PostgreSQL + Redis Stack',
        desc: 'Containerized production stack with internal isolated database networks, healthchecks, volume persistence, and secrets injection.'
      },
      {
        id: 'docker-monitoring',
        title: 'Prometheus + Grafana + Node-Exporter Observability',
        desc: 'Complete cloud telemetry stack scraping system metrics, container cgroups, and alerting rules with pre-provisioned dashboards.'
      }
    ],
    python: [
      {
        id: 'py-netmiko',
        title: 'Multi-Vendor Netmiko Config Pusher & Auditor',
        desc: 'Python network automation script for multi-device concurrent SSH provisioning, golden configuration diff checking, and rollback.'
      },
      {
        id: 'py-ipam',
        title: 'Hierarchical VLSM Subnet Engine & IPAM Exporter',
        desc: 'Algorithmic CIDR allocation calculator parsing requirements, generating host bounds, and exporting JSON/CSV IPAM matrices.'
      },
      {
        id: 'py-telemetry',
        title: 'Real-Time BGP / Link Flap Anomaly Monitor',
        desc: 'Event-driven telemetry listener polling operational link state, detecting flapping thresholds, and triggering webhook alerts.'
      }
    ]
  };

  // Quick Presets
  const PRESETS = {
    cisco_campus: {
      platform: 'cisco',
      scenario: 'cisco-campus',
      securityHardened: true,
      haRedundancy: true,
      dualStackIPv6: true,
      telemetryLogging: true,
      hostname: 'DSW-CORE-01',
      subnet: '10.10.0.0/24'
    },
    mikrotik_dualwan: {
      platform: 'mikrotik',
      scenario: 'mikrotik-dualwan',
      securityHardened: true,
      haRedundancy: true,
      dualStackIPv6: true,
      telemetryLogging: true,
      hostname: 'MikroTik-Border-01',
      subnet: '192.168.88.0/24'
    },
    linux_wireguard: {
      platform: 'linux',
      scenario: 'linux-wireguard',
      securityHardened: true,
      haRedundancy: false,
      dualStackIPv6: true,
      telemetryLogging: true,
      hostname: 'vpn-gw-ams',
      subnet: '10.8.0.0/24'
    },
    docker_mesh: {
      platform: 'docker',
      scenario: 'docker-traefik',
      securityHardened: true,
      haRedundancy: true,
      dualStackIPv6: false,
      telemetryLogging: true,
      hostname: 'prod-cluster-node1',
      subnet: '172.28.0.0/16'
    },
    python_audit: {
      platform: 'python',
      scenario: 'py-netmiko',
      securityHardened: true,
      haRedundancy: true,
      dualStackIPv6: true,
      telemetryLogging: true,
      hostname: 'netops-orchestrator',
      subnet: '10.0.0.0/8'
    }
  };

  // DOM Elements
  const platformButtons = document.querySelectorAll('.platform-btn');
  const scenarioContainer = document.getElementById('architect-scenarios');
  const checkSecurity = document.getElementById('arch-sec-hardened');
  const checkRedundancy = document.getElementById('arch-ha-redundancy');
  const checkDualStack = document.getElementById('arch-dual-stack');
  const checkTelemetry = document.getElementById('arch-telemetry');
  const inputHostname = document.getElementById('arch-input-hostname');
  const inputSubnet = document.getElementById('arch-input-subnet');

  const codePreview = document.getElementById('arch-code-preview');
  const filenameBadge = document.getElementById('arch-filename-badge');
  const btnCopyCode = document.getElementById('btn-arch-copy-code');
  const btnDownloadCode = document.getElementById('btn-arch-download-code');

  const specRole = document.getElementById('arch-spec-role');
  const specInterfaces = document.getElementById('arch-spec-interfaces');
  const specProtocol = document.getElementById('arch-spec-protocol');
  const specSecurity = document.getElementById('arch-spec-security');
  const projectTagBadge = document.getElementById('arch-project-tag');

  // Simulator Elements
  const simPrompt = document.getElementById('arch-sim-prompt');
  const simInput = document.getElementById('arch-sim-input');
  const simBtnExecute = document.getElementById('arch-sim-execute');
  const simScreen = document.getElementById('arch-sim-screen');
  const simBtnRun = document.getElementById('btn-arch-run-simulation');
  const simBtnClear = document.getElementById('btn-arch-clear-sim');
  const simChipsContainer = document.getElementById('arch-sim-chips-list');

  // Preset Buttons
  document.querySelectorAll('.architect-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const presetKey = chip.getAttribute('data-preset');
      if (PRESETS[presetKey]) {
        applyPreset(PRESETS[presetKey]);
      }
    });
  });

  function applyPreset(preset) {
    state.platform = preset.platform;
    state.scenario = preset.scenario;
    state.securityHardened = preset.securityHardened;
    state.haRedundancy = preset.haRedundancy;
    state.dualStackIPv6 = preset.dualStackIPv6;
    state.telemetryLogging = preset.telemetryLogging;
    state.hostname = preset.hostname;
    state.subnet = preset.subnet;

    // Update UI controls
    inputHostname.value = state.hostname;
    inputSubnet.value = state.subnet;
    checkSecurity.checked = state.securityHardened;
    checkRedundancy.checked = state.haRedundancy;
    checkDualStack.checked = state.dualStackIPv6;
    checkTelemetry.checked = state.telemetryLogging;

    platformButtons.forEach(btn => {
      if (btn.getAttribute('data-platform') === state.platform) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    renderScenarioList();
    regenerateProject();
  }

  // Handle Platform Change
  platformButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-platform');
      if (state.platform === p) return;

      platformButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.platform = p;

      // Select first scenario for new platform
      if (SCENARIOS[p] && SCENARIOS[p].length > 0) {
        state.scenario = SCENARIOS[p][0].id;
      }

      // Adjust default hostname and subnet suggestions
      if (p === 'cisco') {
        state.hostname = 'EDGE-CORE-01';
        state.subnet = '10.10.0.0/24';
      } else if (p === 'mikrotik') {
        state.hostname = 'MikroTik-Border-01';
        state.subnet = '192.168.88.0/24';
      } else if (p === 'linux') {
        state.hostname = 'linux-edge-gw';
        state.subnet = '10.8.0.0/24';
      } else if (p === 'docker') {
        state.hostname = 'cloud-docker-host';
        state.subnet = '172.28.0.0/16';
      } else if (p === 'python') {
        state.hostname = 'netops-orchestrator';
        state.subnet = '10.0.0.0/8';
      }

      inputHostname.value = state.hostname;
      inputSubnet.value = state.subnet;

      renderScenarioList();
      regenerateProject();
    });
  });

  // Render Scenarios for current platform
  function renderScenarioList() {
    if (!scenarioContainer) return;
    const list = SCENARIOS[state.platform] || [];
    scenarioContainer.innerHTML = '';

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = `scenario-card ${item.id === state.scenario ? 'active' : ''}`;
      card.setAttribute('data-scenario-id', item.id);
      card.innerHTML = `
        <div class="scenario-indicator"></div>
        <div class="scenario-info">
          <div class="scenario-title">${item.title}</div>
          <div class="scenario-desc">${item.desc}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        scenarioContainer.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.scenario = item.id;
        regenerateProject();
      });

      scenarioContainer.appendChild(card);
    });
  }

  // Modifiers & Inputs change events
  checkSecurity.addEventListener('change', (e) => {
    state.securityHardened = e.target.checked;
    regenerateProject();
  });

  checkRedundancy.addEventListener('change', (e) => {
    state.haRedundancy = e.target.checked;
    regenerateProject();
  });

  checkDualStack.addEventListener('change', (e) => {
    state.dualStackIPv6 = e.target.checked;
    regenerateProject();
  });

  checkTelemetry.addEventListener('change', (e) => {
    state.telemetryLogging = e.target.checked;
    regenerateProject();
  });

  inputHostname.addEventListener('input', (e) => {
    state.hostname = e.target.value.trim() || 'NODE-01';
    regenerateProject();
  });

  inputSubnet.addEventListener('input', (e) => {
    state.subnet = e.target.value.trim() || '10.0.0.0/24';
    regenerateProject();
  });

  // Helper to extract IP prefix from CIDR
  function parseSubnetBase(cidr) {
    const parts = cidr.split('/')[0].split('.');
    if (parts.length >= 3) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    }
    return '10.10.0';
  }

  // Code & Specs Generator
  function generateConfiguration() {
    const { platform, scenario, securityHardened, haRedundancy, dualStackIPv6, telemetryLogging, hostname, subnet } = state;
    const baseIP = parseSubnetBase(subnet);
    let code = '';
    let filename = '';
    let roleText = '';
    let interfacesText = '';
    let protocolText = '';
    let securityText = securityHardened ? 'Strict ACLs / Drop Invalid' : 'Standard / Permissive';

    if (platform === 'cisco') {
      filename = `${hostname.toLowerCase()}.ios`;
      if (scenario === 'cisco-campus') {
        roleText = 'Campus Core Multi-Layer Switch';
        interfacesText = 'VLAN 10, 20, 99 / Port-Channel 1 (Gi0/1-2)';
        protocolText = 'HSRPv2, 802.3ad LACP, Rapid-PVST+';

        code = `! ====================================================================
! CISCO IOS-XE PRODUCTION CONFIGURATION
! Generated for: ${hostname}
! Architecture: Enterprise Campus LAN Core with HSRPv2 & LACP EtherChannel
! Addressing Scope: ${subnet} ${dualStackIPv6 ? '& 2001:db8:acad::/48' : ''}
! Security Posture: ${securityText} | HA Mode: ${haRedundancy ? 'Dual-HSRP Active/Standby' : 'Standalone'}
! ====================================================================

hostname ${hostname}
!
${dualStackIPv6 ? 'ipv6 unicast-routing\n!' : ''}
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree portfast bpduguard default
!
vlan 10
 name ENGINEERING_CORP
!
vlan 20
 name MANAGEMENT_OOB
!
vlan 99
 name NATIVE_TRANSIT
!
! --- High-Density Trunking with 802.3ad LACP EtherChannel ---
interface GigabitEthernet0/1
 description UPLINK_LACP_LINK1_TO_PEER
 switchport trunk encapsulation dot1q
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport mode trunk
 channel-group 1 mode active
 no shutdown
!
interface GigabitEthernet0/2
 description UPLINK_LACP_LINK2_TO_PEER
 switchport trunk encapsulation dot1q
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport mode trunk
 channel-group 1 mode active
 no shutdown
!
interface Port-channel1
 description AGGREGATED_LACP_INTERCONNECT_2000MBPS
 switchport trunk encapsulation dot1q
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport mode trunk
 spanning-tree guard root
!
! --- Switched Virtual Interfaces (SVIs) with HSRPv2 Redundancy ---
interface Vlan10
 description USERS_DEFAULT_GATEWAY
 ip address ${baseIP}.2 255.255.255.0
 ${dualStackIPv6 ? 'ipv6 address 2001:db8:acad:10::2/64\n ipv6 enable' : ''}
 standby version 2
 standby 10 ip ${baseIP}.1
 ${haRedundancy ? `standby 10 priority 110\n standby 10 preempt delay minimum 30` : 'standby 10 priority 100'}
 standby 10 authentication md5 key-string EnterpriseSecSecret2026!
 ${dualStackIPv6 ? 'standby 10 ipv6 autoconfig' : ''}
 no shutdown
!
interface Vlan20
 description OOB_MANAGEMENT_ISOLATED
 ip address ${baseIP.split('.').slice(0, 2).join('.')}.20.2 255.255.255.0
 ${dualStackIPv6 ? 'ipv6 address 2001:db8:acad:20::2/64' : ''}
 standby version 2
 standby 20 ip ${baseIP.split('.').slice(0, 2).join('.')}.20.1
 ${haRedundancy ? 'standby 20 priority 110\n standby 20 preempt' : ''}
 no shutdown
!
${securityHardened ? `! --- Port Security & Hardened Access Control ---
interface range GigabitEthernet0/3 - 24
 switchport mode access
 switchport access vlan 10
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation restrict
 switchport port-security mac-address sticky
!
ip access-list extended ACL_HARDENED_INSPECT
 permit icmp any any echo-reply
 permit icmp any any unreachable
 deny tcp any any eq 23
 deny tcp any any eq 80
 permit ip ${subnet.split('/')[0]} 0.0.0.255 any
 deny ip any any log-input
!` : ''}
${telemetryLogging ? `! --- Operational Telemetry & Audit Logs ---
logging buffered 64000 informational
logging trap debugging
service timestamps debug datetime msec localtime show-timezone
service timestamps log datetime msec localtime show-timezone
service password-encryption
!` : ''}
end
write memory`;
      } else if (scenario === 'cisco-ipsec') {
        roleText = 'Enterprise Edge IPSec Gateway';
        interfacesText = 'Gi0/0 (WAN) / Tunnel0 (VTI)';
        protocolText = 'IPSec VTI, IKEv2, eBGP AS 65001';

        code = `! ====================================================================
! CISCO IOS-XE ROUTE-BASED IPSEC VTI WITH DYNAMIC BGP
! Device: ${hostname} | Subnet: ${subnet}
! ====================================================================

hostname ${hostname}
!
crypto ikev2 proposal IKEV2_PROP_AES_GCM
 encryption aes-gcm-256
 prf sha384
 group 19 20
!
crypto ikev2 policy IKEV2_POLICY_ENTERPRISE
 proposal IKEV2_PROP_AES_GCM
!
crypto ikev2 keyring REMOTE_PEER_KEYRING
 peer REMOTE_DC_GATEWAY
  address 198.51.100.2
  pre-shared-key EnterpriseMeshVpnAuthToken2026#
!
crypto ikev2 profile IKEV2_PROFILE_VTI
 match identity remote address 198.51.100.2 255.255.255.255
 identity local address 203.0.113.2
 authentication remote pre-share
 authentication local pre-share
 keyring local REMOTE_PEER_KEYRING
 dpd 10 2 on-demand
!
crypto ipsec transform-set TS_AES256GCM esp-gcm 256
 mode transport
!
crypto ipsec profile IPSEC_VTI_PROFILE
 set transform-set TS_AES256GCM
 set ikev2-profile IKEV2_PROFILE_VTI
!
! --- Virtual Tunnel Interface (VTI) ---
interface Tunnel0
 description SECURE_VTI_IPSEC_TUNNEL_TO_REMOTE_DC
 ip address 10.255.255.1 255.255.255.252
 ${dualStackIPv6 ? 'ipv6 address 2001:db8:ffff::1/64' : ''}
 ip mtu 1400
 ip tcp adjust-mss 1360
 tunnel source GigabitEthernet0/0
 tunnel destination 198.51.100.2
 tunnel mode ipsec ipv4
 tunnel protection ipsec profile IPSEC_VTI_PROFILE
 no shutdown
!
! --- Dynamic eBGP Over IPSec Tunnel ---
router bgp 65001
 bgp router-id ${baseIP}.1
 bgp log-neighbor-changes
 neighbor 10.255.255.2 remote-as 65002
 neighbor 10.255.255.2 description PEER_REMOTE_HEADQUARTERS
 neighbor 10.255.255.2 soft-reconfiguration inbound
 !
 address-family ipv4 unicast
  network ${subnet.split('/')[0]} mask 255.255.255.0
  neighbor 10.255.255.2 activate
  neighbor 10.255.255.2 next-hop-self
 exit-address-family
!
end`;
      } else if (scenario === 'cisco-ospf') {
        roleText = 'OSPF Backbone ABR / Enterprise Core';
        interfacesText = 'Gi0/0, Gi0/1, Gi0/2, Loopback0';
        protocolText = 'Multi-Area OSPFv2, Summarization';

        code = `! ====================================================================
! CISCO IOS-XE MULTI-AREA OSPF WITH CONTIGUOUS SUMMARIZATION
! Device: ${hostname} | Router ID: ${baseIP}.1
! ====================================================================

hostname ${hostname}
!
interface Loopback0
 ip address ${baseIP}.1 255.255.255.255
!
router ospf 1
 router-id ${baseIP}.1
 auto-cost reference-bandwidth 100000
 log-adjacency-changes detail
 passive-interface default
 no passive-interface GigabitEthernet0/0
 no passive-interface GigabitEthernet0/1
 !
 ! Area 0 Backbone Network
 network 10.0.0.0 0.0.0.3 area 0
 !
 ! Area 10 Branch Access Subnet with Route Summarization
 area 10 range ${subnet.split('/')[0]} 255.255.254.0
 network ${subnet.split('/')[0]} 0.0.0.255 area 10
 !
 ! Area 20 Totally Stubby Area for Remote Warehouse
 area 20 stub no-summary
 network 10.20.0.0 0.0.255.255 area 20
!
interface GigabitEthernet0/0
 description UPLINK_CORE_AREA0
 ip address 10.0.0.1 255.255.255.252
 ip ospf message-digest-key 1 md5 OspfAuthEnterprise2026!
 ip ospf authentication message-digest
 ip ospf network point-to-point
 ip ospf hello-interval 5
 ip ospf dead-interval 20
 no shutdown
!
end`;
      } else {
        roleText = 'Enterprise Perimeter Security Firewall';
        interfacesText = 'Gi0/0 (OUTSIDE), Gi0/1 (INSIDE), Gi0/2 (DMZ)';
        protocolText = 'Zone-Based Policy Firewall (ZBFW) & Dynamic NAT';

        code = `! ====================================================================
! CISCO IOS-XE ZONE-BASED POLICY FIREWALL (ZBFW) & NAT
! Device: ${hostname} | Protected Subnet: ${subnet}
! ====================================================================

hostname ${hostname}
!
zone security ZONE_INSIDE
zone security ZONE_OUTSIDE
zone security ZONE_DMZ
!
class-map type inspect match-any PROTOCOLS_ALLOWED
 match protocol tcp
 match protocol udp
 match protocol icmp
 match protocol https
 match protocol dns
!
policy-map type inspect IN_TO_OUT_POLICY
 class type inspect PROTOCOLS_ALLOWED
  inspect
 class class-default
  drop log
!
zone-pair security PAIR_INSIDE_OUTSIDE source ZONE_INSIDE destination ZONE_OUTSIDE
 service-policy type inspect IN_TO_OUT_POLICY
!
interface GigabitEthernet0/0
 description WAN_INTERNET_UPLINK
 ip address dhcp
 zone-member security ZONE_OUTSIDE
 ip nat outside
 no shutdown
!
interface GigabitEthernet0/1
 description LAN_USERS_INTERNAL
 ip address ${baseIP}.1 255.255.255.0
 zone-member security ZONE_INSIDE
 ip nat inside
 no shutdown
!
ip access-list standard NAT_LAN_PERMIT
 permit ${subnet.split('/')[0]} 0.0.0.255
!
ip nat inside source list NAT_LAN_PERMIT interface GigabitEthernet0/0 overload
!
end`;
      }
    } else if (platform === 'mikrotik') {
      filename = `${hostname.toLowerCase()}.rsc`;
      if (scenario === 'mikrotik-dualwan') {
        roleText = 'MikroTik Dual-WAN Balancing Gateway';
        interfacesText = 'ether1 (ISP1), ether2 (ISP2), ether3-5 (LAN-Bridge)';
        protocolText = 'PCC (Per-Connection-Classifier) & Recursive Routing';

        code = `# ====================================================================
# MIKROTIK ROUTEROS v7.14+ PRODUCTION CONFIGURATION SCRIPT
# System Identity: ${hostname}
# Target LAN: ${subnet}
# Architecture: Dual-WAN PCC Balancing with Recursive Failover
# ====================================================================

/system identity set name="${hostname}"

# 1. Interface Bridge & Addressing
/interface bridge add name=bridge-lan comment="Main Enterprise Local Bridge"
/interface bridge port add bridge=bridge-lan interface=ether3
/interface bridge port add bridge=bridge-lan interface=ether4
/interface bridge port add bridge=bridge-lan interface=ether5

/ip address add address=${baseIP}.1/24 interface=bridge-lan comment="LAN Gateway"
/ip address add address=203.0.113.2/30 interface=ether1 comment="WAN1 ISP1 Uplink"
/ip address add address=198.51.100.2/30 interface=ether2 comment="WAN2 ISP2 Uplink"

# 2. Firewall Mangle PCC (Per-Connection Classifier)
/ip firewall mangle
add chain=prerouting dst-address=203.0.113.0/30 action=accept comment="Bypass WAN1 Subnet"
add chain=prerouting dst-address=198.51.100.0/30 action=accept comment="Bypass WAN2 Subnet"

add chain=prerouting in-interface=bridge-lan connection-state=new dst-address-type=!local \\
    per-connection-classifier=both-addresses-and-ports:2/0 action=mark-connection \\
    new-connection-mark=WAN1_CONN passthrough=yes comment="PCC Hash Group 1"

add chain=prerouting in-interface=bridge-lan connection-state=new dst-address-type=!local \\
    per-connection-classifier=both-addresses-and-ports:2/1 action=mark-connection \\
    new-connection-mark=WAN2_CONN passthrough=yes comment="PCC Hash Group 2"

add chain=prerouting in-interface=bridge-lan connection-mark=WAN1_CONN action=mark-routing \\
    new-routing-mark=to_WAN1 passthrough=no
add chain=prerouting in-interface=bridge-lan connection-mark=WAN2_CONN action=mark-routing \\
    new-routing-mark=to_WAN2 passthrough=no

# 3. Dynamic Source NAT Masquerade
/ip firewall nat
add chain=srcnat out-interface=ether1 action=masquerade comment="NAT Masquerade ISP1"
add chain=srcnat out-interface=ether2 action=masquerade comment="NAT Masquerade ISP2"

# 4. Recursive Routing with Dynamic Health-Check Ping
/ip route
add dst-address=8.8.8.8/32 gateway=203.0.113.1 scope=10 comment="Host Route ISP1 Health Target"
add dst-address=1.1.1.1/32 gateway=198.51.100.1 scope=10 comment="Host Route ISP2 Health Target"

add dst-address=0.0.0.0/0 gateway=8.8.8.8 check-gateway=ping distance=1 routing-table=to_WAN1 comment="Recursive Default via ISP1"
add dst-address=0.0.0.0/0 gateway=1.1.1.1 check-gateway=ping distance=1 routing-table=to_WAN2 comment="Recursive Default via ISP2"

${securityHardened ? `# 5. Stateful Drop Rules
/ip firewall filter
add chain=input connection-state=established,related action=accept
add chain=input connection-state=invalid action=drop comment="Drop Malformed Packets"
add chain=input protocol=icmp action=accept limit=5,10:packet
add chain=input in-interface=!bridge-lan action=drop comment="Block WAN Input Management"
` : ''}`;
      } else {
        roleText = 'MikroTik WireGuard Enterprise Mesh';
        interfacesText = 'wg0 (Tunnel), ether1 (WAN), bridge-lan (Local)';
        protocolText = 'WireGuard ChaCha20-Poly1305 & Dynamic OSPF';

        code = `# ====================================================================
# MIKROTIK ROUTEROS v7 WIREGUARD OVERLAY MESH TUNNEL
# System Identity: ${hostname} | Subnet: ${subnet}
# ====================================================================

/system identity set name="${hostname}"

/interface wireguard add name=wg0 listen-port=51820 comment="WireGuard VPN Mesh Endpoint"
/ip address add address=10.200.0.1/24 interface=wg0

/interface wireguard peers
add interface=wg0 public-key="yWqjR5P98eU2aN9XQc6p1X5K6L7m8N9O0P1Q2R3S4T5=" \\
    endpoint-address=198.51.100.5 endpoint-port=51820 \\
    allowed-address=10.200.0.0/24,${subnet} \\
    persistent-keepalive=25 comment="Headquarters DC Peer"

/routing ospf instance add name=ospf-wg-inst router-id=10.200.0.1
/routing ospf area add name=area-backbone instance=ospf-wg-inst area-id=0.0.0.0
/routing ospf interface-template add area=area-backbone networks=10.200.0.0/24 type=ptp auth=md5 auth-key="SecretWGKey2026!"
`;
      }
    } else if (platform === 'linux') {
      filename = `${hostname.toLowerCase()}.conf`;
      if (scenario === 'linux-nginx') {
        roleText = 'High-Performance Edge Reverse Proxy';
        interfacesText = 'eth0 (Public) / lo (Internal Loopback)';
        protocolText = 'HTTP/2, TLS 1.3, Rate-Limiting, Security Headers';

        code = `# ====================================================================
# PRODUCTION NGINX REVERSE PROXY SPECIFICATION
# Node: ${hostname} | Gateway IP: ${baseIP}.1
# Security: Hardened SSL/TLS 1.3 & OWASP Defense
# ====================================================================

# Leaky-bucket rate limit zones
limit_req_zone $binary_remote_addr zone=api_rate_limit:10m rate=15r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

upstream backend_microservices {
    least_conn;
    server 127.0.0.1:8080 max_fails=3 fail_timeout=10s;
    server 127.0.0.1:8081 max_fails=3 fail_timeout=10s;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name gautambhuwan.com.np *.gautambhuwan.com.np;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name gautambhuwan.com.np;

    # SSL TLS 1.3 Configuration
    ssl_certificate /etc/letsencrypt/live/gautambhuwan.com.np/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gautambhuwan.com.np/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:20m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;

    location / {
        limit_req zone=api_rate_limit burst=20 nodelay;
        limit_conn conn_limit 30;

        proxy_pass http://backend_microservices;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }

    location = /healthz {
        access_log off;
        return 200 '{"status":"healthy","node":"${hostname}"}\\n';
    }
}`;
      } else {
        roleText = 'Hardened WireGuard Gateway Node';
        interfacesText = 'wg0 (Tunnel 10.8.0.1) / eth0 (WAN)';
        protocolText = 'WireGuard Kernel Module, iptables NAT, sysctl';

        code = `# ====================================================================
# LINUX /etc/wireguard/wg0.conf PRODUCTION PROFILE
# Host: ${hostname} | Subnet: ${subnet}
# ====================================================================

[Interface]
Address = ${baseIP}.1/24${dualStackIPv6 ? ', 2001:db8:8888::1/64' : ''}
ListenPort = 51820
PrivateKey = aB8f9G1h2I3j4K5l6M7n8O9p0Q1r2S3t4U5v6W7x8Y8=
SaveConfig = false

# Enable Kernel IP Forwarding & NAT Masquerade on Start
PostUp = sysctl -w net.ipv4.ip_forward=1
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
${dualStackIPv6 ? 'PostUp = sysctl -w net.ipv6.conf.all.forwarding=1\nPostUp = ip6tables -A FORWARD -i wg0 -j ACCEPT' : ''}

# Clean rules on Shutdown
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client Peer #01 (Mobile NetEng Terminal)
[Peer]
PublicKey = XxYyZz1234567890AaBbCcDdEeFfGgHhIiJjKkLlMm=
AllowedIPs = ${baseIP}.2/32
PersistentKeepalive = 25

# Client Peer #02 (Remote Branch Node)
[Peer]
PublicKey = KkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789=
AllowedIPs = ${baseIP}.10/32
PersistentKeepalive = 25`;
      }
    } else if (platform === 'docker') {
      filename = 'docker-compose.yml';
      roleText = 'Microservice Containerized Mesh';
      interfacesText = 'Traefik Ingress, Isolated Bridge (app_net)';
      protocolText = 'Docker Engine v26+, Traefik v3, Healthchecks';

      code = `# ====================================================================
# DOCKER COMPOSE HIGH-AVAILABILITY CLUSTER
# Host: ${hostname} | Bridge: ${subnet}
# ====================================================================

version: '3.8'

networks:
  ingress_public:
    driver: bridge
  internal_mesh:
    driver: bridge
    ipam:
      config:
        - subnet: ${subnet}

volumes:
  traefik_certs:
  redis_data:
  postgres_data:

services:
  traefik:
    image: traefik:v3.0
    container_name: ${hostname}-traefik
    restart: unless-stopped
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=info@gautambhuwan.com.np"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_certs:/letsencrypt
    networks:
      - ingress_public

  web_api:
    image: python:3.11-slim
    container_name: ${hostname}-api
    restart: unless-stopped
    working_dir: /app
    environment:
      - NODE_ENV=production
      - HOSTNAME=${hostname}
      - DB_HOST=postgres
      - REDIS_HOST=redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(\`api.gautambhuwan.com.np\`)"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/healthz"]
      interval: 15s
      timeout: 5s
      retries: 3
    networks:
      - ingress_public
      - internal_mesh

  postgres:
    image: postgres:16-alpine
    container_name: ${hostname}-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: enterprise_db
      POSTGRES_USER: netops_admin
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal_mesh`;
    } else {
      filename = 'audit_compliance.py';
      roleText = 'Python Netmiko Network Automation';
      interfacesText = 'SSH / Paramiko v3 / Async Polling';
      protocolText = 'Netmiko, Diff Engine, JSON/CSV Exporter';

      code = `#!/usr/bin/env python3
"""
====================================================================
NETMIKO MULTI-VENDOR COMPLIANCE & GOLDEN CONFIG AUDITOR
System Host: ${hostname} | Scope: ${subnet}
====================================================================
"""

import sys
import logging
from netmiko import ConnectHandler
from concurrent.futures import ThreadPoolExecutor

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

TARGET_DEVICES = [
    {
        "device_type": "cisco_ios",
        "host": "${baseIP}.2",
        "username": "netadmin",
        "password": "SecretPassword2026!",
        "secret": "EnterpriseSecret!",
    },
    {
        "device_type": "mikrotik_routeros",
        "host": "${baseIP}.3",
        "username": "admin",
        "password": "SecretPassword2026!",
    }
]

def audit_device(device):
    logging.info(f"Connecting to {device['host']} ({device['device_type']})...")
    try:
        with ConnectHandler(**device) as net_connect:
            if device['device_type'] == 'cisco_ios':
                net_connect.enable()
                version_out = net_connect.send_command("show version | include Cisco IOS")
                route_out = net_connect.send_command("show ip route summary")
                hsrp_out = net_connect.send_command("show standby brief")
                logging.info(f"[{device['host']}] HSRP Status:\\n{hsrp_out}")
            else:
                out = net_connect.send_command("/system resource print")
                logging.info(f"[{device['host']}] MikroTik System:\\n{out}")
            return {"host": device["host"], "status": "COMPLIANT"}
    except Exception as exc:
        logging.error(f"Failed to audit {device['host']}: {exc}")
        return {"host": device["host"], "status": "FAILED", "error": str(exc)}

def main():
    logging.info(f"Initiating network compliance audit across scope: ${subnet}")
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(audit_device, TARGET_DEVICES))
    
    print("\\n=== AUDIT MATRIX SUMMARY ===")
    for res in results:
        print(f"Device: {res['host']} --> Status: {res['status']}")

if __name__ == "__main__":
    main()`;
    }

    return { code, filename, roleText, interfacesText, protocolText, securityText };
  }

  // Update simulator prompt & chips
  function updateSimulatorUI() {
    const { platform, hostname } = state;
    if (platform === 'cisco') {
      simPrompt.textContent = `${hostname}#`;
      renderChips([
        'show ip route',
        'show standby brief',
        'show etherchannel summary',
        'show ip interface brief',
        'show running-config',
        'ping 8.8.8.8'
      ]);
    } else if (platform === 'mikrotik') {
      simPrompt.textContent = `[admin@${hostname}] >`;
      renderChips([
        '/ip route print',
        '/ip firewall mangle print',
        '/ip firewall nat print',
        '/interface wireguard print',
        '/system resource print',
        'ping 8.8.8.8'
      ]);
    } else if (platform === 'linux') {
      simPrompt.textContent = `root@${hostname}:~#`;
      renderChips([
        'nginx -t',
        'systemctl status nginx',
        'ip addr show',
        'wg show',
        'curl -I https://gautambhuwan.com.np',
        'nft list ruleset'
      ]);
    } else if (platform === 'docker') {
      simPrompt.textContent = `developer@${hostname}:~$`;
      renderChips([
        'docker compose ps',
        'docker network ls',
        'docker compose logs --tail=10',
        'docker stats --no-stream',
        'curl -I http://localhost:80'
      ]);
    } else {
      simPrompt.textContent = `ops@${hostname}:~$`;
      renderChips([
        'python3 audit_compliance.py --dry-run',
        'python3 audit_compliance.py --deploy',
        'pytest test_compliance.py',
        'cat golden_config_diff.log'
      ]);
    }
  }

  function renderChips(commands) {
    if (!simChipsContainer) return;
    simChipsContainer.innerHTML = '';
    commands.forEach(cmd => {
      const chip = document.createElement('span');
      chip.className = 'architect-preset-chip';
      chip.textContent = cmd;
      chip.addEventListener('click', () => {
        simInput.value = cmd;
        simInput.focus();
        executeSimCommand(cmd);
      });
      simChipsContainer.appendChild(chip);
    });
  }

  // Regenerate Project Code & View
  function regenerateProject() {
    const generated = generateConfiguration();
    codePreview.textContent = generated.code;
    filenameBadge.textContent = generated.filename;
    specRole.innerHTML = `Role: <strong>${generated.roleText}</strong>`;
    specInterfaces.innerHTML = `Interfaces: <strong>${generated.interfacesText}</strong>`;
    specProtocol.innerHTML = `Protocols: <strong>${generated.protocolText}</strong>`;
    specSecurity.innerHTML = `Security: <strong>${generated.securityText}</strong>`;
    projectTagBadge.textContent = `${state.platform.toUpperCase()} // ${generated.roleText.split(' ')[0]}`;

    updateSimulatorUI();
  }

  // Copy Code
  btnCopyCode.addEventListener('click', () => {
    const text = codePreview.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const orig = btnCopyCode.innerHTML;
        btnCopyCode.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => { btnCopyCode.innerHTML = orig; }, 2000);
      });
    }
  });

  // Download Code File
  btnDownloadCode.addEventListener('click', () => {
    const text = codePreview.textContent;
    const filename = filenameBadge.textContent || 'configuration.txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // Simulator Engine Command Execution
  function appendLog(line, isPrompt = false, isSuccess = false, isWarn = false) {
    const p = document.createElement('div');
    if (isPrompt) {
      p.style.color = '#38bdf8';
      p.style.fontWeight = '700';
      p.style.marginTop = '6px';
    } else if (isSuccess) {
      p.style.color = '#10b981';
    } else if (isWarn) {
      p.style.color = '#f59e0b';
    } else {
      p.style.color = '#cbd5e1';
    }
    p.textContent = line;
    simScreen.appendChild(p);
    simScreen.scrollTop = simScreen.scrollHeight;
  }

  function executeSimCommand(cmd) {
    const raw = cmd.trim();
    if (!raw) return;

    const promptText = simPrompt.textContent;
    appendLog(`${promptText} ${raw}`, true);
    simInput.value = '';

    const lower = raw.toLowerCase();
    const { platform, hostname, subnet } = state;
    const baseIP = parseSubnetBase(subnet);

    if (lower === 'clear') {
      simScreen.innerHTML = '';
      return;
    }

    if (lower === 'help' || lower === '?') {
      appendLog(`Universal Simulator Command Reference (${platform.toUpperCase()}):`);
      appendLog(` - Type any verified command or click the shortcut chips above`);
      appendLog(` - Press [Tab] to trigger autocomplete suggestions`);
      appendLog(` - Press [?] to view context-sensitive help`);
      appendLog(` - Type 'clear' to wipe terminal log`);
      return;
    }

    // Platform Specific Responses
    if (platform === 'cisco') {
      if (lower.startsWith('show standby')) {
        appendLog(`                     P indicates configured to preempt.`);
        appendLog(`                     |`);
        appendLog(`Interface   Grp  Pri P State   Active          Standby         Virtual IP`);
        appendLog(`Vl10        10   110 P Active  local           ${baseIP}.3     ${baseIP}.1`);
        appendLog(`Vl20        20   110 P Active  local           ${baseIP.split('.').slice(0, 2).join('.')}.20.3  ${baseIP.split('.').slice(0, 2).join('.')}.20.1`, false, true);
      } else if (lower.startsWith('show etherchannel')) {
        appendLog(`Group  Port-channel  Protocol    Ports`);
        appendLog(`------+-------------+-----------+-----------------------------------------------`);
        appendLog(`1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)`);
        appendLog(`[OK] Port-channel 1 operational (2.0 Gbps aggregate bandwidth).`, false, true);
      } else if (lower.startsWith('show ip route')) {
        appendLog(`Gateway of last resort is ${baseIP}.1 to network 0.0.0.0`);
        appendLog(`      ${subnet.split('/')[0]}/24 is variably subnetted, 3 subnets, 2 masks`);
        appendLog(`C        ${subnet.split('/')[0]}/24 is directly connected, Vlan10`);
        appendLog(`L        ${baseIP}.2/32 is directly connected, Vlan10`);
        appendLog(`O    0.0.0.0/0 [110/2] via 10.0.0.1, 04:12:33, GigabitEthernet0/0`, false, true);
      } else if (lower.startsWith('show ip interface brief')) {
        appendLog(`Interface              IP-Address      OK? Method Status                Protocol`);
        appendLog(`GigabitEthernet0/1     unassigned      YES unset  up                    up`);
        appendLog(`GigabitEthernet0/2     unassigned      YES unset  up                    up`);
        appendLog(`Port-channel1          unassigned      YES unset  up                    up`);
        appendLog(`Vlan10                 ${baseIP}.2      YES NVRAM  up                    up`);
        appendLog(`Vlan20                 ${baseIP.split('.').slice(0, 2).join('.')}.20.2   YES NVRAM  up                    up`, false, true);
      } else if (lower.startsWith('show running-config')) {
        appendLog(`Building configuration...`);
        appendLog(`Current configuration : 1840 bytes`);
        appendLog(`hostname ${hostname}`);
        appendLog(`! (Active verified syntax matches preview panel)`, false, true);
      } else if (lower.startsWith('ping')) {
        appendLog(`Type escape sequence to abort.`);
        appendLog(`Sending 5, 100-byte ICMP Echos to target, timeout is 2 seconds:`);
        appendLog(`!!!!!`);
        appendLog(`Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/3 ms`, false, true);
      } else {
        appendLog(`% Unrecognized command "${raw}". Type '?' or check quick chips.`, false, false, true);
      }
    } else if (platform === 'mikrotik') {
      if (lower.startsWith('/ip route print')) {
        appendLog(`Flags: D - DYNAMIC; A - ACTIVE; c - CONNECT, s - STATIC, r - RECURSIVE`);
        appendLog(`Columns: DST-ADDRESS, GATEWAY, DISTANCE, ROUTING-TABLE`);
        appendLog(`0  As   0.0.0.0/0       8.8.8.8 (via ether1)    1   to_WAN1`);
        appendLog(`1  As   0.0.0.0/0       1.1.1.1 (via ether2)    1   to_WAN2`);
        appendLog(`2  DAc  ${subnet}   bridge-lan              0   main`, false, true);
      } else if (lower.startsWith('/ip firewall mangle')) {
        appendLog(`Flags: X - disabled, I - invalid, D - dynamic`);
        appendLog(`0    chain=prerouting action=mark-connection new-connection-mark=WAN1_CONN passthrough=yes per-connection-classifier=both-addresses-and-ports:2/0`);
        appendLog(`1    chain=prerouting action=mark-connection new-connection-mark=WAN2_CONN passthrough=yes per-connection-classifier=both-addresses-and-ports:2/1`, false, true);
      } else if (lower.startsWith('/interface wireguard print')) {
        appendLog(`Flags: X - disabled, R - running`);
        appendLog(`0  R name="wg0" mtu=1420 listen-port=51820 private-key="..." public-key="yWqjR5P98eU2aN9XQc6p1X5K6L7m8N9O0P1Q2R3S4T5="`, false, true);
      } else if (lower.startsWith('/system resource print')) {
        appendLog(`                   uptime: 14w2d18h`);
        appendLog(`                  version: 7.14.3 (stable)`);
        appendLog(`               build-time: Feb/20/2026 11:22:04`);
        appendLog(`         factory-software: 7.8`);
        appendLog(`              free-memory: 894.2MiB`);
        appendLog(`             total-memory: 1024.0MiB`);
        appendLog(`                      cpu: ARM64`);
        appendLog(`                cpu-count: 4`);
        appendLog(`            cpu-frequency: 1400MHz`);
        appendLog(`                 cpu-load: 3%`, false, true);
      } else if (lower.startsWith('ping')) {
        appendLog(`  SEQ HOST                                     SIZE TTL TIME  STATUS`);
        appendLog(`    0 8.8.8.8                                    56  58 11ms  echo reply`);
        appendLog(`    1 8.8.8.8                                    56  58 10ms  echo reply`);
        appendLog(`    sent=2 received=2 packet-loss=0% min-rtt=10ms avg-rtt=10ms max-rtt=11ms`, false, true);
      } else {
        appendLog(`bad command name ${raw} (line 1 column 1)`, false, false, true);
      }
    } else if (platform === 'linux') {
      if (lower.startsWith('nginx -t')) {
        appendLog(`nginx: the configuration file /etc/nginx/nginx.conf syntax is ok`);
        appendLog(`nginx: configuration file /etc/nginx/nginx.conf test is successful`, false, true);
      } else if (lower.startsWith('systemctl status')) {
        appendLog(`● nginx.service - A high performance web server and a reverse proxy server`);
        appendLog(`     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)`);
        appendLog(`     Active: active (running) since Sat 2026-10-03 21:10:00 UTC; 4h 22min ago`);
        appendLog(`   Main PID: 1240 (nginx)`);
        appendLog(`      Tasks: 4 (limit: 9481)`);
        appendLog(`     Memory: 28.4M`);
        appendLog(`     CGroup: /system.slice/nginx.service`, false, true);
      } else if (lower.startsWith('ip addr show')) {
        appendLog(`1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN`);
        appendLog(`    inet 127.0.0.1/8 scope host lo`);
        appendLog(`2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP`);
        appendLog(`    inet ${baseIP}.1/24 brd ${baseIP}.255 scope global eth0`, false, true);
      } else if (lower.startsWith('wg show')) {
        appendLog(`interface: wg0`);
        appendLog(`  public key: aB8f9G1h2I3j4K5l6M7n8O9p0Q1r2S3t4U5v6W7x8Y8=`);
        appendLog(`  listening port: 51820`);
        appendLog(`peer: XxYyZz1234567890AaBbCcDdEeFfGgHhIiJjKkLlMm=`);
        appendLog(`  endpoint: 198.51.100.22:51820`);
        appendLog(`  allowed ips: ${baseIP}.2/32`);
        appendLog(`  latest handshake: 14 seconds ago`);
        appendLog(`  transfer: 4.82 MiB received, 18.94 MiB sent`, false, true);
      } else if (lower.startsWith('curl')) {
        appendLog(`HTTP/2 200 OK`);
        appendLog(`server: nginx/1.24.0`);
        appendLog(`date: Sat, 03 Oct 2026 21:30:00 GMT`);
        appendLog(`content-type: text/html; charset=UTF-8`);
        appendLog(`strict-transport-security: max-age=63072000; includeSubDomains; preload`);
        appendLog(`x-frame-options: DENY`);
        appendLog(`x-content-type-options: nosniff`, false, true);
      } else {
        appendLog(`bash: ${raw}: command not found. Check quick action chips.`, false, false, true);
      }
    } else if (platform === 'docker') {
      if (lower.startsWith('docker compose ps') || lower.startsWith('docker ps')) {
        appendLog(`NAME                     IMAGE              COMMAND                  SERVICE      STATUS              PORTS`);
        appendLog(`${hostname}-traefik       traefik:v3.0       "/entrypoint.sh --pr…"   traefik      Up 3 hours          0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp`);
        appendLog(`${hostname}-api           python:3.11-slim   "uvicorn main:app …"     web_api      Up 3 hours (healthy) 8000/tcp`);
        appendLog(`${hostname}-db            postgres:16        "docker-entrypoint.s…"   postgres     Up 3 hours          5432/tcp`, false, true);
      } else if (lower.startsWith('docker network ls')) {
        appendLog(`NETWORK ID     NAME                   DRIVER    SCOPE`);
        appendLog(`a1b2c3d4e5f6   ingress_public         bridge    local`);
        appendLog(`f6e5d4c3b2a1   internal_mesh          bridge    local (${subnet})`, false, true);
      } else {
        appendLog(`[Docker Engine]: Container task completed successfully for "${raw}".`, false, true);
      }
    } else {
      if (lower.includes('audit_compliance.py')) {
        appendLog(`2026-10-03 21:35:12,100 [INFO] Connecting to ${baseIP}.2 (cisco_ios)...`);
        appendLog(`2026-10-03 21:35:12,840 [INFO] [${baseIP}.2] HSRP Status: Vl10 Grp 10 Active (Virtual IP: ${baseIP}.1)`);
        appendLog(`2026-10-03 21:35:13,420 [INFO] Connecting to ${baseIP}.3 (mikrotik_routeros)...`);
        appendLog(`2026-10-03 21:35:14,010 [INFO] Audit Complete: 2/2 devices COMPLIANT with golden image.`, false, true);
      } else {
        appendLog(`(automation-env) Process finished with exit code 0.`);
      }
    }
  }

  // Live Automated Simulation Runner
  let isSimulating = false;
  simBtnRun.addEventListener('click', async () => {
    if (isSimulating) return;
    isSimulating = true;
    simBtnRun.disabled = true;
    simBtnRun.innerHTML = '<span>⚡ Running Live Simulation...</span>';

    simScreen.innerHTML = '';
    const { platform, hostname, scenario } = state;

    appendLog(`====================================================================`);
    appendLog(`[INIT] LAUNCHING AUTOMATED TEST SUITE FOR: ${hostname}`);
    appendLog(`[PLATFORM] ${platform.toUpperCase()} // SCENARIO: ${scenario}`);
    appendLog(`====================================================================\n`);

    const stages = [
      { msg: `[PHASE 1/5] Syntactic & Parsing Validation...`, status: `[PASS] Syntax tree verified without errors.` },
      { msg: `[PHASE 2/5] Bringing up interfaces & Link-State Convergence...`, status: `[OK] All configured interfaces transitioned to UP/UP.` },
      { msg: `[PHASE 3/5] Verifying Protocol & Redundancy Handshakes...`, status: `[ESTABLISHED] Session peers converged successfully.` },
      { msg: `[PHASE 4/5] Executing Security ACL & Packet Inspection Probe...`, status: `[VERIFIED] 0 packets dropped in error; stateful inspection active.` },
      { msg: `[PHASE 5/5] End-to-End Latency, Throughput & Resiliency Benchmark...`, status: `[COMPLETE] RTT avg: 0.84ms | Loss: 0.0% | Status: OPTIMAL.` }
    ];

    for (let i = 0; i < stages.length; i++) {
      appendLog(stages[i].msg, true);
      await new Promise(r => setTimeout(r, 450));
      appendLog(stages[i].status, false, true);
      await new Promise(r => setTimeout(r, 200));
    }

    appendLog(`\n✓ AUTOMATION RESULT: ALL 5 DIAGNOSTIC CHECKS PASSED.`);
    appendLog(`You can now type manual verification commands in the CLI input below.`);

    isSimulating = false;
    simBtnRun.disabled = false;
    simBtnRun.innerHTML = '<span>▶ Run Live Simulation</span>';
  });

  // Clear Simulator
  simBtnClear.addEventListener('click', () => {
    simScreen.innerHTML = '';
  });

  // CLI Input Submit
  simBtnExecute.addEventListener('click', () => {
    executeSimCommand(simInput.value);
  });

  simInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSimCommand(simInput.value);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutocomplete();
    } else if (e.key === '?') {
      e.preventDefault();
      executeSimCommand('?');
    }
  });

  // Tab Autocomplete Handler
  function handleAutocomplete() {
    const val = simInput.value.trim().toLowerCase();
    const { platform } = state;
    let list = [];

    if (platform === 'cisco') {
      list = ['show ip route', 'show standby brief', 'show etherchannel summary', 'show ip interface brief', 'show running-config', 'ping 8.8.8.8', 'clear', 'help'];
    } else if (platform === 'mikrotik') {
      list = ['/ip route print', '/ip firewall mangle print', '/ip firewall nat print', '/interface wireguard print', '/system resource print', 'ping 8.8.8.8', 'clear', 'help'];
    } else if (platform === 'linux') {
      list = ['nginx -t', 'systemctl status nginx', 'ip addr show', 'wg show', 'curl -I https://gautambhuwan.com.np', 'nft list ruleset', 'clear', 'help'];
    } else if (platform === 'docker') {
      list = ['docker compose ps', 'docker network ls', 'docker compose logs --tail=10', 'docker stats --no-stream', 'clear', 'help'];
    } else {
      list = ['python3 audit_compliance.py --dry-run', 'python3 audit_compliance.py --deploy', 'pytest test_compliance.py', 'clear', 'help'];
    }

    if (!val) {
      simInput.value = list[0];
      return;
    }

    const matches = list.filter(item => item.startsWith(val));
    if (matches.length === 1) {
      simInput.value = matches[0];
    } else if (matches.length > 1) {
      appendLog(`Matches: ${matches.join('   ')}`);
    }
  }

  // Initial Boot
  renderScenarioList();
  regenerateProject();
});
