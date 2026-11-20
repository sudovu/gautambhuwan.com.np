/**
 * VHUWON MATHERS — Interactive Labs Command Line Simulator
 * Domain: gautambhuwan.com.np
 * Provides a client-side network CLI emulator with Tab autocomplete and Cisco-style '?' context help
 */

document.addEventListener('DOMContentLoaded', () => {
  // Comprehensive Hierarchical Command & Help Tree
  const CLI_HELP_CATALOG = {
    // Huawei VRP & OLT Commands
    'display': {
      desc: 'Display system status and configuration information (Huawei VRP)',
      sub: {
        'isis': {
          desc: 'Intermediate System to Intermediate System (IS-IS)',
          sub: {
            'peer': { desc: 'Show IS-IS neighbor adjacencies, state and holdtimes' },
            'lsdb': { desc: 'Show Link-State Database (LSDB) summary' }
          }
        },
        'mpls': {
          desc: 'Multiprotocol Label Switching (MPLS)',
          sub: {
            'ldp': {
              desc: 'Label Distribution Protocol (LDP)',
              sub: {
                'session': { desc: 'Show operational LDP sessions and peer status' }
              }
            },
            'lsp': { desc: 'Show MPLS Label Switched Path (LSP) forwarding database' }
          }
        },
        'vsi': {
          desc: 'Virtual Switching Instance (VPLS L2VPN)',
          sub: {
            'verbose': { desc: 'Show detailed VSI configuration and pseudo-wire status' },
            'remote-mac': { desc: 'Show dynamically learned remote MAC addresses across PW' }
          }
        },
        'ospf': {
          desc: 'Open Shortest Path First (OSPF)',
          sub: {
            'peer': {
              desc: 'Show OSPF neighbor states',
              sub: {
                'brief': { desc: 'Show OSPF neighbor brief state and addresses' }
              }
            }
          }
        },
        'ont': {
          desc: 'Optical Network Terminal (ONT) diagnostics',
          sub: {
            'optical-info': { desc: 'Show ONT transceiver optical Rx/Tx power budget' },
            'info': { desc: 'Show ONT registration state, distance and serial number' },
            'autofind': {
              desc: 'Show auto-discovered unconfigured ONTs on PON ports',
              sub: {
                'all': { desc: 'Show all auto-discovered ONTs across all PON cards' }
              }
            }
          }
        },
        'board': {
          desc: 'Hardware board status',
          sub: {
            '0': { desc: 'Show slot status of all installed boards in chassis' }
          }
        },
        'service-port': {
          desc: 'OLT service port mappings',
          sub: {
            '100': { desc: 'Show specific service port configuration and state' },
            'all': { desc: 'Show all active service port mappings' }
          }
        },
        'dfs-group': {
          desc: 'Multichassis Link Aggregation (M-LAG) DFS status and peer-links',
          sub: {
            '1': {
              desc: 'DFS group 1 status',
              sub: {
                'm-lag': { desc: 'Show M-LAG interface synchronization and port states' },
                'node': { desc: 'Show DFS group dual-active heartbeat and keepalive status' }
              }
            }
          }
        },
        'vxlan': {
          desc: 'Virtual Extensible LAN (VXLAN) fabric',
          sub: {
            'vni': {
              desc: 'VXLAN Network Identifier (VNI) table',
              sub: {
                'verbose': { desc: 'Show detailed VNI tunnel bindings and packet statistics' }
              }
            },
            'tunnel': { desc: 'Show active VXLAN VTEP peer tunnels' }
          }
        },
        'evpn': {
          desc: 'BGP EVPN routing database',
          sub: {
            'routing-table': { desc: 'Show EVPN Type-2 MAC/IP, Type-3 Multicast, and Type-5 Prefix routes' }
          }
        },
        'dcb': {
          desc: 'Data Center Bridging and Lossless AI fabric',
          sub: {
            'pfc': {
              desc: 'Priority-based Flow Control status',
              sub: {
                'interface': { desc: 'Show per-interface PFC queue statistics and pause frames' }
              }
            }
          }
        },
        'device': {
          desc: 'Chassis hardware architecture, MPUs, SFU crossbars, and LPUs'
        },
        'configuration': {
          desc: 'Candidate and committed configuration states',
          sub: {
            'candidate': { desc: 'Show uncommitted VRPv8 candidate configuration changes' }
          }
        }
      }
    },

    'show': {
      desc: 'Show running system information',
      sub: {
        'ip': {
          desc: 'IP information',
          sub: {
            'ospf': {
              desc: 'Open Shortest Path First (OSPF)',
              sub: {
                'neighbor': { desc: 'Neighbor list, states and dead timers' },
                'database': { desc: 'Link-State Database (LSDB) summary' }
              }
            },
            'route': {
              desc: 'IP routing table',
              sub: {
                'ospf': { desc: 'OSPF learned routes and cost metrics' },
                'summary': { desc: 'Contiguous route summarization boundaries' }
              }
            },
            'bgp': {
              desc: 'Border Gateway Protocol (BGP)',
              sub: {
                'summary': { desc: 'BGP neighbor status and prefix counts' }
              }
            },
            'interface': {
              desc: 'IP interface status and configuration',
              sub: {
                'brief': { desc: 'Brief summary of IP status and configuration' }
              }
            }
          }
        },
        'standby': {
          desc: 'Hot Standby Router Protocol (HSRP)',
          sub: {
            'brief': { desc: 'HSRP group state, priority, and active/standby router' }
          }
        },
        'etherchannel': {
          desc: 'EtherChannel information',
          sub: {
            'summary': { desc: 'Port-channel status, protocol, and bundled ports' }
          }
        },
        'spanning-tree': {
          desc: 'Spanning Tree Protocol (STP)',
          sub: {
            'vlan': {
              desc: 'Spanning tree details for specific VLAN',
              sub: {
                '10': { desc: 'VLAN 10 Rapid-PVST+ root and port states' }
              }
            }
          }
        },
        'crypto': {
          desc: 'Cryptographic subsystems',
          sub: {
            'session': {
              desc: 'Crypto session status',
              sub: {
                'detail': { desc: 'Detailed IPsec VTI and IKEv2 session parameters' }
              }
            },
            'ikev2': {
              desc: 'IKEv2 parameters',
              sub: {
                'sa': { desc: 'IKEv2 Security Associations' }
              }
            },
            'ipsec': {
              desc: 'IPsec parameters',
              sub: {
                'sa': { desc: 'IPsec Security Associations' }
              }
            }
          }
        },
        'running-config': { desc: 'Current active operating configuration' },
        'version': { desc: 'System hardware and software version' }
      }
    },
    'ping': {
      desc: 'Send ICMP echo messages',
      sub: {
        '10.0.0.2': { desc: 'Ping OSPF neighbor router' },
        '10.255.255.2': { desc: 'Ping remote IPsec VTI endpoint' },
        '8.8.8.8': { desc: 'Ping recursive gateway via ISP1' }
      }
    },
    'subnet': {
      desc: 'VLSM hierarchical calculation engine',
      sub: {
        '172.16.0.0/23': { desc: 'Calculate 172.16.0.0/23 VLSM allocation matrix' }
      }
    },
    'commit': { desc: 'Commit candidate configuration to running database in VRPv8' },
    'clear': { desc: 'Reset and clear the console session' },
    'help': { desc: 'Description of the interactive help system' },

    // Linux Commands
    'nginx': {
      desc: 'Nginx reverse proxy control',
      sub: {
        '-t': { desc: 'Test Nginx configuration syntax and exit' }
      }
    },
    'curl': {
      desc: 'Transfer data from or to a server',
      sub: {
        '-I': {
          desc: 'Fetch HTTP response headers only',
          sub: {
            'https://gautambhuwan.com.np': { desc: 'Inspect production site HTTP/2 response headers' }
          }
        }
      }
    },
    'systemctl': {
      desc: 'Control systemd system and service manager',
      sub: {
        'status': {
          desc: 'Show runtime status information about units',
          sub: {
            'nginx': { desc: 'Show status of Nginx web service' }
          }
        }
      }
    },
    'cat': {
      desc: 'Concatenate files and print on the standard output',
      sub: {
        '/etc/nginx/sites-available/production.conf': { desc: 'Display Nginx virtual host configuration' }
      }
    },
    'docker': {
      desc: 'Docker container management tool',
      sub: {
        'network': {
          desc: 'Manage Docker networks',
          sub: {
            'inspect': {
              desc: 'Display detailed network information',
              sub: {
                'app_net': { desc: 'Inspect isolated bridge network app_net' }
              }
            }
          }
        },
        'ps': { desc: 'List running containers' },
        'logs': {
          desc: 'Fetch the logs of a container',
          sub: {
            'secure_gateway': { desc: 'View logs for container secure_gateway' }
          }
        }
      }
    },
    'uname': {
      desc: 'Print system information',
      sub: {
        '-a': { desc: 'Print all operating system and architecture information' }
      }
    },
    'whoami': { desc: 'Print effective user name' },

    // MikroTik RouterOS Commands
    '/ip': {
      desc: 'IP configuration menu',
      sub: {
        'route': {
          desc: 'Routing table management',
          sub: {
            'print': { desc: 'Print IP routing table with recursive gateways' }
          }
        },
        'firewall': {
          desc: 'Firewall rules and filters',
          sub: {
            'mangle': {
              desc: 'Packet marking and PCC load balancing',
              sub: {
                'print': { desc: 'Print PCC mangle rules' }
              }
            }
          }
        }
      }
    },
    '/queue': {
      desc: 'Bandwidth queue and QoS management',
      sub: {
        'tree': {
          desc: 'Hierarchical queue tree',
          sub: {
            'print': { desc: 'Print PCQ queue bandwidth shaping rules' }
          }
        }
      }
    },
    '/ping': {
      desc: 'Send ICMP echo packets',
      sub: {
        '1.1.1.1': { desc: 'Ping primary ISP DNS target' }
      }
    }
  };

  // Flattened List of Full Commands for Autocomplete
  function getAllCommands(node = CLI_HELP_CATALOG, prefix = '') {
    let list = [];
    for (const [key, val] of Object.entries(node)) {
      const full = prefix ? `${prefix} ${key}` : key;
      if (val.sub && Object.keys(val.sub).length > 0) {
        list.push(full);
        list = list.concat(getAllCommands(val.sub, full));
      } else {
        list.push(full);
      }
    }
    return list;
  }

  const ALL_FLAT_COMMANDS = getAllCommands();

  // Command Output Database
  const SIMULATOR_COMMANDS = {
    'display isis peer': `                          Peer information for ISIS(1)
                          ----------------------------
System Id          Interface          Circuit Id        State Holdtime Type     PRI
-----------------------------------------------------------------------------------
0000.0000.0010     Eth-Trunk1         p2p               Up    28s      L2       --
Total Peer(s): 1
<HW-PE01-CORE> %ISIS-5-ADJCHANGE: ISIS 1 Neighbor 0000.0000.0010 (Eth-Trunk1) adjacency state Up, Done.`,

    'display isis lsdb': `                        Database information for ISIS(1)
                        ---------------------------------
                          Level-2 Link State Database
LSPID                 Seq Num      Checksum      Holdtime      Length  ATT/P/OL
-------------------------------------------------------------------------------
0000.0000.0001.00-00* 0x00000012   0x3a4f        1185          148     0/0/0
0000.0000.0010.00-00  0x0000000e   0x8f22        1172          156     0/0/0
0000.0000.0002.00-00  0x00000015   0x11ce        1190          148     0/0/0
Total LSP(s): 3
    *(Ino) / Count: Outer(0) Non-zero Outer(0)
    *(Self) / Count: Directed(1) Non-directed(0)`,

    'display mpls ldp session': `                LDP Session(s) in Public Network
----------------------------------------------------------------------
Peer LDP ID         Source Interface   State     Role  Hold-Time  KA-Sent
----------------------------------------------------------------------
10.255.255.10:0     Loopback0          Operational Active 30         2451
10.255.255.2:0      Loopback0          Operational Active 30         2449
----------------------------------------------------------------------
TOTAL: 2 session(s) Found. LDP Graceful Restart: Enabled.`,

    'display mpls lsp': `-------------------------------------------------------------------------------
                 LSP Information: LDP LSP
-------------------------------------------------------------------------------
FEC                In/Out Label  In/Out Interface                    Token
-------------------------------------------------------------------------------
10.255.255.2/32    NULL/48118    Vlanif991                           0x1
10.255.255.10/32   NULL/3        Vlanif991 (Eth-Trunk1)              0x2
10.10.12.0/30      NULL/3        Vlanif991                           0x3
10.10.23.0/30      48119/48116   Vlanif991                           0x1`,

    'display vsi verbose': ` ***VSI Name               : BIZ_VPLS_100
    Work Mode              : normal
    Scope                  : public
    VSI State              : up
    VSI ID                 : 100
    Signaling Protocol     : ldp
    Encap Type             : ethernet
    MTU                    : 1500
    Diffserv Mode          : uniform
    Mac Learning           : enabled
    Mac Limit              : 2000
    Mac Limit Action       : discard
    Broadcast Suppression  : 5 (cir)
    Multicast Suppression  : 5 (cir)
    Total AC Number        : 2 (10GE1/0/1.100, 10GE1/0/1.200)
    Total PW Number        : 1
   *PW Information:
    Peer IP                : 10.255.255.2
    VSI ID                 : 100
    PW State               : up
    Inbound Label          : 48120
    Outbound Label         : 48118
    Interface Name         : Eth-Trunk1
    Tunnel ID              : 0x0000000100000002
    BFD State              : Admin-Up / Link-Up (30ms echo)`,

    'display vsi remote-mac': `VSI Name: BIZ_VPLS_100
MAC Address       VLAN    Peer IP         Tunnel ID     Age(s)
--------------------------------------------------------------
4857-021b-a101    100     10.255.255.2    0x10000002    18
4857-021b-a102    200     10.255.255.2    0x10000002    12
Total MAC addresses: 2`,

    'display ospf peer brief': `          OSPF Process 1 with Router ID 10.255.255.1
                   Peer Statistic Information
 -------------------------------------------------------------------
 Area Id          Interface                  Neighbor id      State
 0.0.0.0          Vlanif991                  10.255.255.10    Full
 0.0.0.1          Vlanif10                   10.10.10.254     Full
 -------------------------------------------------------------------
 Total Peer(s): 2`,

    'display board 0': `-------------------------------------------------------------------------
SlotID  BoardName  Status          SubType0 SubType1    Online/Offline
-------------------------------------------------------------------------
0/1     H901GPHF   Normal          16*GPON              Online
0/2     H901XGHD   Normal          8*10G-GPON           Online
0/8     H901MPLA   Active_normal   4*10GE Uplink        Online
0/9     H901MPLA   Standby_normal  4*10GE Uplink        Online
0/10    H901PISA   Normal          Dual-AC Power        Online
-------------------------------------------------------------------------`,

    'display ont optical-info 0/1 0 1': `-------------------------------------------------------------------------
  ONU NII interface                      : GPON
  OLT Rx ONT optical power(dBm)          : -19.82
  ONT Rx optical power(dBm)              : -18.45  (Nominal: -8 to -27 dBm Standard)
  ONT Tx optical power(dBm)              : 2.34
  OLT Tx optical power(dBm)              : 2.85
  Temperature(C)                         : 42
  Voltage(V)                             : 3.28
  Bias current(mA)                       : 14
  Rogue ONT state                        : Normal (Non-Rogue, Burst Mode Confirmed)
-------------------------------------------------------------------------`,

    'display ont info 0/1 0 1': `-------------------------------------------------------------------------
  F/S/P                   : 0/1/0
  ONT-ID                  : 1
  Control flag            : active
  Run state               : online
  Config state            : normal
  Match state             : match
  SN                      : 48575443F8A1B2C3 (HWTC-F8A1B2C3)
  Type                    : HG8245H5 (4GE + 2POTS + 2.4G/5G Wi-Fi)
  Distance                : 1248m
  Rx power                : -18.45 dBm
  Memory usage            : 38%
  CPU usage               : 8%
-------------------------------------------------------------------------`,

    'display ont autofind all': `----------------------------------------------------------------------------
  Number              : 1
  F/S/P               : 0/1/0
  Ont SN              : 48575443D4E5F6A7 (HWTC-D4E5F6A7)
  Password            :
  Device type         : HG8546M
  Software Version    : V5R019C00S105
  Auto-find time      : 2026-11-20 09:40:12
----------------------------------------------------------------------------`,

    'display dfs-group 1 m-lag': `--------------------------------------------------------------------------------
MLAG-ID   State      Local-State  Peer-State   Local-Port     Peer-Port
--------------------------------------------------------------------------------
1         Success    Active       Active       Eth-Trunk10    Eth-Trunk10
--------------------------------------------------------------------------------
Peer-Link Status     : Up (200 Gbps, Eth-Trunk0)
Heartbeat (DAD)      : Normal (Keepalive RTT: 0.42 ms via __LOCAL_MGMT__)
Config-Consistency   : Consistent (VLAN, STP, LACP, MTU synchronized)
Dual-Active Action   : Error-Down (Standby member ports isolate on peer-link fault)`,

    'display dfs-group 1 node': `DFS Group 1 Node Status:
  Local Priority     : 150 (Master Role)
  Peer Priority      : 120 (Backup Role)
  Local IP Address   : 192.168.100.11 (vpn-instance __LOCAL_MGMT__)
  Peer IP Address    : 192.168.100.12 (vpn-instance __LOCAL_MGMT__)
  Heartbeat State    : Established (Timer: 1000ms, Timeout: 6000ms)
  Peer-Link Port     : Eth-Trunk0 (100GE1/0/5, 100GE1/0/6)
  M-LAG Version      : V200R020C10 (CloudEngine Standard)`,

    'display vxlan vni verbose': `--------------------------------------------------------------------------------
BD-ID   VNI     Source-IP        Peer-VTEP-IP     Status   In-Packets   Out-Packets
--------------------------------------------------------------------------------
10      10010   10.255.255.11    10.255.255.12    Up       189,451,202  187,902,110
10      10010   10.255.255.11    10.255.255.13    Up        98,114,500   97,882,410
20      10020   10.255.255.11    10.255.255.12    Up       240,119,410  239,812,001
--------------------------------------------------------------------------------
Total Active VNIs: 2 | Encap Type: VXLAN Standard (RFC 7348)`,

    'display vxlan tunnel': `--------------------------------------------------------------------------------
Tunnel-ID   Source          Destination     State   Type    Out-Interface
--------------------------------------------------------------------------------
1           10.255.255.11   10.255.255.12   Up      bgp     100GE1/0/1
2           10.255.255.11   10.255.255.13   Up      bgp     100GE1/0/2
--------------------------------------------------------------------------------
Total VXLAN Tunnels: 2 | MTU: 9216 (Jumbo Underlay Enabled)`,

    'display evpn routing-table': `Local AS: 65001   BGP EVPN Routing Table
Routes: 4 Total, 4 Active
RD: 65001:10010 (Bridge-Domain 10)
  Type-2 (MAC/IP Route):
    * >  [2]:[0]:[48]:[4857-021b-a101]:[32]:[192.168.10.15]/104  Nexthop: 10.255.255.12  Label: 10010
    * >  [2]:[0]:[48]:[4857-021b-a102]:[32]:[192.168.10.16]/104  Nexthop: 10.255.255.13  Label: 10010
  Type-3 (Inclusive Multicast Route):
    * >  [3]:[0]:[32]:[10.255.255.12]/64                          Nexthop: 10.255.255.12  Label: 10010
  Type-5 (IP Prefix Route):
    * >  [5]:[0]:[24]:[192.168.10.0]/88                           Nexthop: 10.255.255.11  Label: 10010`,

    'display dcb pfc interface 100ge 1/0/1': `--------------------------------------------------------------------------------
Port: 100GE1/0/1   PFC-Admin-Status: Enabled   PFC-Oper-Status: Enabled
Priority: 3 (Lossless RoCEv2 AI Fabric)
Rx-Pause-Frames: 0      Tx-Pause-Frames: 0      PFC-Deadlock-Recovery: Normal
Dynamic-Buffer: Allocated (32MB Unified Egress Pool)
ECN-Thresholds: Queue 3 (Min: 25%, Max: 75%, Discard: 100% Mark-Only)`,

    'display device': `--------------------------------------------------------------------------------
Slot  Type           Item                  Status     Sub-Type  Power  Fan
--------------------------------------------------------------------------------
1     LPU            CE-LPU-36CQ-FD (36*100GE) Normal     --        Normal Normal
2     LPU            CE-LPU-48S8CQ (48*25G)    Normal     --        Normal Normal
9     MPU            CE-MPU-B (Active)         Normal     Master    Normal Normal
10    MPU            CE-MPU-B (Standby)        Normal     Slave     Normal Normal
11    SFU            CE-SFU-12808 (Switch-Fab) Normal     --        Normal Normal
12    SFU            CE-SFU-12808 (Switch-Fab) Normal     --        Normal Normal
13    SFU            CE-SFU-12808 (Switch-Fab) Normal     --        Normal Normal
14    SFU            CE-SFU-12808 (Switch-Fab) Normal     --        Normal Normal
--------------------------------------------------------------------------------
System State: Non-blocking Orthogonal Crossbar Fabric Operational`,

    'display configuration candidate': `System candidate configuration changes:
#
+ dfs-group 1
+  priority 150
+  source ip 192.168.100.11 vpn-instance __LOCAL_MGMT__
+  dual-active detection track vpn-instance __LOCAL_MGMT__ ip 192.168.100.12
#
+ interface Eth-Trunk0
+  peer-link 1
+  mode lacp-static
#
+ dcb pfc enable
+ dcb pfc priority 3
#
Total 6 uncommitted candidate blocks ready. Use 'commit' or 'commit trial 300' to apply.`,

    'commit': `[~HW-CE6881-LEAF01] commit
Commit operational changes to running system database...
Info: Candidate configuration committed successfully. Current configuration generation: 0x48a12.`,

    'commit trial 300': `[~HW-CE6881-LEAF01] commit trial 300
Trial commit initiated with 300 second safety timeout.
Info: The trial configuration will be automatically rolled back if not confirmed within 300 seconds.`,

    'display service-port 100': `-------------------------------------------------------------------------
  Index                   : 100
  VLAN ID                 : 1100 (SVLAN Metro Aggregation)
  VLAN attr               : common
  Port type               : gpon
  F/S/P                   : 0/1/0
  ONT ID                  : 1
  GEM index               : 1
  User VLAN               : 100 (CVLAN Residential Internet)
  Tag transform           : translate
  Inbound traffic-table   : 8 (Rate: 300M Residential)
  Outbound traffic-table  : 8 (Rate: 300M Residential)
  State                   : up
  Active state            : active
-------------------------------------------------------------------------`,

    'help': `Available Simulation Commands:
  [Cisco IOS Routing & High Availability]
    show ip ospf neighbor        - Inspect OSPFv2 neighbor state & dead timers (Lab #001)
    show ip route ospf           - Display OSPF learned route table & summary masks (Lab #001)
    show ip ospf database        - Link-State Database (LSDB) summary
    show standby brief           - Verify HSRPv2 active/standby state & tracking (Lab #004)
    show etherchannel summary    - Check LACP 802.3ad port-channel trunk bundle (Lab #004)
    show spanning-tree vlan 10   - Verify Rapid-PVST+ root bridge priority & ports
    show crypto session detail   - Inspect IPsec VTI phase 1/2 cryptographic tunnels (Lab #005)
    show ip bgp summary          - Verify eBGP dynamic neighbor peering across VTI (Lab #005)
    show ip route summary        - Display contiguous hierarchical route summarization (Lab #007)
    show ip interface brief      - List router subinterfaces, status & IP assignments (Lab #007)
    show running-config          - Display device configuration

  [MikroTik RouterOS Edge Gateway]
    /ip route print              - Inspect recursive check-gateway multi-WAN routing (Lab #006)
    /queue tree print            - View Per-Connection Queue (PCQ) bandwidth shaping (Lab #006)
    /ip firewall mangle print    - Inspect Per-Connection Classifier (PCC) marks (Lab #006)
    /ping 1.1.1.1                - Ping primary ISP recursive gateway target

  [Linux Systems & Container Architecture]
    nginx -t                     - Validate Nginx reverse proxy syntax & upstream conf (Lab #002)
    curl -I https://gautambhuwan.com.np - Probe HTTP/2 headers & TLS 1.3 handshakes (Lab #002)
    systemctl status nginx       - Check Nginx service unit status
    cat /etc/nginx/sites-available/production.conf - Inspect Nginx proxy pass block
    docker network inspect app_net - Inspect isolated bridge namespace & container IPs (Lab #003)
    docker ps                    - View running microservice containers (Lab #003)
    docker logs secure_gateway   - Inspect container startup logs & HTTP hits

  [Utilities & Diagnostics]
    subnet 172.16.0.0/23         - Run live VLSM CIDR calculation engine (Lab #007)
    ping 10.255.255.2            - Transmit ICMP echo packets across IPsec VTI tunnel
    ping 10.0.0.2                - Ping OSPF neighbor router
    ping 8.8.8.8                 - Probe recursive failover public DNS gateway
    uname -a                     - Inspect host kernel & architecture
    whoami                       - Display authenticated user identity
    clear                        - Clear simulator screen

Tip: Press TAB to autocomplete commands. Type '?' at any time for context-sensitive help.`,

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

    'show ip ospf database': `            OSPF Router with ID (1.1.1.1) (Process ID 1)

                Router Link States (Area 0)

Link ID         ADV Router      Age         Seq#       Checksum Link count
1.1.1.1         1.1.1.1         312         0x80000004 0x00A123 2
2.2.2.2         2.2.2.2         289         0x80000003 0x00B412 2

                Summary Net Link States (Area 0)

Link ID         ADV Router      Age         Seq#       Checksum
192.168.0.0     1.1.1.1         312         0x80000001 0x005E21`,

    'show standby brief': `                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vlan10      10   110 P Active  local           192.168.10.3    192.168.10.1
Vlan20      20   110 P Active  local           192.168.20.3    192.168.20.1
DSW1# %HSRP-5-STATECHANGE: Vlan10 Grp 10 state Standby -> Active (Preempted)
DSW1# Tracking Gi0/0 state UP, decrement 20`,

    'show standby': `Vlan10 - Group 10 (version 2)
  State is Active
    5 state changes, last state change 01:14:02
  Virtual IP address is 192.168.10.1
  Active virtual MAC address is 0000.0c9f.f00a (local)
  Local virtual MAC address is 0000.0c9f.f00a (v2 default)
  Hello time 1 sec, hold time 3 sec
  Preemption enabled
  Active router is local
  Standby router is 192.168.10.3, priority 100 (expires in 2.816 sec)
  Priority 110 (configured 110)
  Track interface GigabitEthernet0/0 state UP decrement 20`,

    'show etherchannel summary': `Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)
DSW1# Port-Channel 1 Status: Operational (2 Gbps Aggregate Bandwidth Full-Duplex)`,

    'show spanning-tree vlan 10': `VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586 (sys-id-ext 10)
             Address     0001.42a1.d800
             This bridge is the root
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    24586 (priority 24576 sys-id-ext 10)
             Address     0001.42a1.d800
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Po1                 Desg FWD 9         128.56   P2p
Gi0/3               Desg FWD 19        128.3    P2p Edge (PortFast: ACTIVE)`,

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

    'systemctl status nginx': `● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2026-09-22 08:14:02 UTC; 1 weeks 4 days ago
    Process: 1240 ExecStart=/usr/sbin/nginx -g daemon on; master_process on; (code=exited, status=0/SUCCESS)
   Main PID: 1241 (nginx)
      Tasks: 3 (limit: 4612)
     Memory: 28.4M
        CPU: 18.291s
     CGroup: /system.slice/nginx.service
             ├─1241 "nginx: master process /usr/sbin/nginx -g daemon on; master_process on;"
             ├─1242 "nginx: worker process"
             └─1243 "nginx: worker process"`,

    'cat /etc/nginx/sites-available/production.conf': `server {
    listen 443 ssl http2;
    server_name gautambhuwan.com.np;

    ssl_certificate /etc/ssl/certs/fullchain.pem;
    ssl_certificate_key /etc/ssl/private/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,

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

    'docker logs secure_gateway': `172.28.0.1 - - [03/Oct/2026:14:48:11 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0 NetProbe"
172.28.0.1 - - [03/Oct/2026:14:48:15 +0000] "GET /healthz HTTP/1.1" 200 18 "-" "HealthAudit/2.1"
2026/10/03 14:48:20 [notice] 1#1: Configuration reloaded successfully via SIGUP`,

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

    'ping 10.0.0.2': `Sending 5, 100-byte ICMP Echos to 10.0.0.2 (Core ABR Neighbor), timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 2/4/6 ms`,

    'ping 8.8.8.8': `Sending 5, 64-byte ICMP Echos to 8.8.8.8 (Google Anycast DNS via ISP1):
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 9/12/17 ms (Recursive Check-Gateway: OK)`,

    '/ping 1.1.1.1': `  SEQ HOST                                     SIZE TTL TIME  STATUS
    0 1.1.1.1                                    56  58 11ms  echo reply
    1 1.1.1.1                                    56  58 10ms  echo reply
    2 1.1.1.1                                    56  58 12ms  echo reply
    sent=3 received=3 packet-loss=0% min-rtt=10ms avg-rtt=11ms max-rtt=12ms`,

    'uname -a': `Linux vm-primary 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`,

    'whoami': `neteng@gautambhuwan.com.np (Vhuwon Mathers - NetEng Node #01)`
  };

  // Lab Device Configurations
  const LAB_CONFIGS = {
    'lab-016': {
      prompt: '<HW-CE6881-LEAF01>',
      device: 'Huawei CloudEngine CE6881-48T6CQ TOR Leaf (VRPv8)',
      defaultCmd: 'display dfs-group 1 m-lag',
      helpCmds: [
        'display dfs-group 1 m-lag',
        'display dfs-group 1 node',
        'display vxlan vni verbose',
        'display vxlan tunnel',
        'display evpn routing-table',
        'display dcb pfc interface 100ge 1/0/1',
        'display device',
        'display configuration candidate',
        'commit',
        'display current-configuration',
        'help',
        'clear'
      ]
    },

    'lab-014': {
      prompt: '<HW-PE01-CORE>',
      device: 'Huawei CloudEngine S6730 Core Switch (VRP v8)',
      defaultCmd: 'display vsi verbose',
      helpCmds: ['display isis peer', 'display mpls ldp session', 'display vsi verbose', 'display vsi remote-mac', 'display ospf peer brief', 'display isis lsdb', 'display mpls lsp', 'display current-configuration', 'help', 'clear']
    },
    'lab-015': {
      prompt: 'MA5800-X7(config)#',
      device: 'Huawei SmartAX MA5800-X7 Next-Gen OLT',
      defaultCmd: 'display ont optical-info 0/1 0 1',
      helpCmds: ['display ont optical-info 0/1 0 1', 'display ont info 0/1 0 1', 'display board 0', 'display service-port 100', 'display ont autofind all', 'display current-configuration', 'help', 'clear']
    },

    'lab-001': {
      prompt: 'Core-ABR#',
      device: 'Cisco IOS Core ABR',
      defaultCmd: 'show ip ospf neighbor',
      helpCmds: ['show ip ospf neighbor', 'show ip route ospf', 'show ip ospf database', 'ping 10.0.0.2', 'show running-config', 'help', 'clear']
    },
    'lab-002': {
      prompt: 'root@web-gw:~#',
      device: 'Ubuntu Linux 24.04 LTS Gateway',
      defaultCmd: 'nginx -t',
      helpCmds: ['nginx -t', 'curl -I https://gautambhuwan.com.np', 'systemctl status nginx', 'cat /etc/nginx/sites-available/production.conf', 'help', 'clear']
    },
    'lab-003': {
      prompt: 'sysadmin@docker-host:~$',
      device: 'Linux Microservice Host',
      defaultCmd: 'docker network inspect app_net',
      helpCmds: ['docker network inspect app_net', 'docker ps', 'docker logs secure_gateway', 'ip addr show', 'help', 'clear']
    },
    'lab-004': {
      prompt: 'DSW1#',
      device: 'Cisco Catalyst 3850 Core Switch',
      defaultCmd: 'show standby brief',
      helpCmds: ['show standby brief', 'show etherchannel summary', 'show spanning-tree vlan 10', 'show running-config', 'help', 'clear']
    },
    'lab-005': {
      prompt: 'HQ-Core#',
      device: 'Cisco ISR 4451 Edge Gateway',
      defaultCmd: 'show crypto session detail',
      helpCmds: ['show crypto session detail', 'show ip bgp summary', 'ping 10.255.255.2', 'show running-config', 'help', 'clear']
    },
    'lab-006': {
      prompt: '[admin@MikroTik-Edge] >',
      device: 'MikroTik RouterOS v7.14',
      defaultCmd: '/ip route print',
      helpCmds: ['/ip route print', '/queue tree print', '/ip firewall mangle print', '/ping 1.1.1.1', 'help', 'clear']
    },
    'lab-007': {
      prompt: 'Core-RTR#',
      device: 'Cisco ASR 1001-X Enterprise Router',
      defaultCmd: 'subnet 172.16.0.0/23',
      helpCmds: ['subnet 172.16.0.0/23', 'show ip route summary', 'show ip interface brief', 'show running-config', 'help', 'clear']
    }
  };

  // Helper: Find Longest Common Prefix of an array of strings
  function getLongestCommonPrefix(strings) {
    if (!strings.length) return '';
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (!strings[i].toLowerCase().startsWith(prefix.toLowerCase())) {
        prefix = prefix.slice(0, -1);
        if (!prefix) return '';
      }
    }
    return prefix;
  }

  // Context-Sensitive Help Generator (triggered by '?')
  function generateContextHelp(inputVal, labId = null) {
    const raw = inputVal.trim();
    const endsWithSpace = inputVal.endsWith(' ');
    const tokens = raw ? raw.split(/\s+/) : [];

    let currentLevel = CLI_HELP_CATALOG;
    let path = [];

    // Traverse down catalog tree
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].toLowerCase();
      // If we are at the last token and there's no trailing space, it's partially typed
      if (i === tokens.length - 1 && !endsWithSpace) {
        break;
      }
      if (currentLevel[token] && currentLevel[token].sub) {
        currentLevel = currentLevel[token].sub;
        path.push(token);
      } else if (currentLevel[token]) {
        return `  <cr>           Execute command`;
      } else {
        return `% Unrecognized command at '${token}'. Type 'help' for full catalog.`;
      }
    }

    // Filter available options at current level
    const lastToken = (!endsWithSpace && tokens.length > 0) ? tokens[tokens.length - 1].toLowerCase() : '';
    const entries = Object.entries(currentLevel).filter(([key]) => {
      return !lastToken || key.toLowerCase().startsWith(lastToken);
    });

    if (entries.length === 0) {
      return `  <cr>           Execute command`;
    }

    // Format like authentic Cisco IOS '?' output
    const maxLen = Math.max(...entries.map(([k]) => k.length));
    const lines = entries.map(([key, item]) => {
      const padding = ' '.repeat(Math.max(2, maxLen - key.length + 4));
      return `  ${key}${padding}${item.desc || ''}`;
    });

    return lines.join('\n');
  }

  // Autocomplete Engine (triggered by 'Tab')
  function handleTabCompletion(inputElem, labId = null, outputCallback = null) {
    const originalVal = inputElem.value;
    const currentVal = originalVal.trimStart();
    if (!currentVal) {
      // Empty input Tab: show root commands
      if (outputCallback) {
        outputCallback(generateContextHelp('', labId));
      }
      return;
    }

    // Get candidate commands
    const matches = ALL_FLAT_COMMANDS.filter(cmd => {
      return cmd.toLowerCase().startsWith(currentVal.toLowerCase());
    });

    if (matches.length === 0) {
      // No matches found
      return;
    }

    if (matches.length === 1) {
      // Exactly one completion
      inputElem.value = matches[0] + ' ';
    } else {
      // Multiple matches: find longest common prefix
      const lcp = getLongestCommonPrefix(matches);
      if (lcp.length > currentVal.length) {
        inputElem.value = lcp;
      } else if (outputCallback) {
        // Output all candidate completions like Bash/IOS double-tab
        const formatted = matches.slice(0, 12).map(m => `  ${m}`).join('\n');
        outputCallback(`Possible completions:\n${formatted}`);
      }
    }
  }

  // Helper: Match and execute command in database
  function resolveCommandOutput(cmd, labId = null) {
    const raw = cmd.trim();
    if (!raw) return '';

    const lower = raw.toLowerCase();

    if (lower === 'clear') {
      return '__CLEAR__';
    }

    if (lower === 'help' || lower === '?') {
      if (labId && LAB_CONFIGS[labId]) {
        return `Commands for ${LAB_CONFIGS[labId].device}:\n  ${LAB_CONFIGS[labId].helpCmds.join('\n  ')}\n\nTip: Press TAB to autocomplete. Type '?' after any word for contextual help.`;
      }
      return SIMULATOR_COMMANDS['help'];
    }

    // Huawei VRP Heuristics
    if (lower.startsWith('display isis') || (labId === 'lab-014' && lower.includes('isis'))) {
      return lower.includes('lsdb') ? SIMULATOR_COMMANDS['display isis lsdb'] : SIMULATOR_COMMANDS['display isis peer'];
    }

    if (lower.startsWith('display mpls') || (labId === 'lab-014' && lower.includes('mpls'))) {
      return lower.includes('lsp') ? SIMULATOR_COMMANDS['display mpls lsp'] : SIMULATOR_COMMANDS['display mpls ldp session'];
    }

    if (lower.startsWith('display vsi') || (labId === 'lab-014' && lower.includes('vsi'))) {
      return lower.includes('mac') ? SIMULATOR_COMMANDS['display vsi remote-mac'] : SIMULATOR_COMMANDS['display vsi verbose'];
    }

    if (lower.startsWith('display ont') || (labId === 'lab-015' && lower.includes('ont'))) {
      if (lower.includes('autofind')) return SIMULATOR_COMMANDS['display ont autofind all'];
      if (lower.includes('optical')) return SIMULATOR_COMMANDS['display ont optical-info 0/1 0 1'];
      return SIMULATOR_COMMANDS['display ont info 0/1 0 1'];
    }

    if (lower.startsWith('display board') || (labId === 'lab-015' && lower.includes('board'))) {
      return SIMULATOR_COMMANDS['display board 0'];
    }

    if (lower.startsWith('display service-port') || (labId === 'lab-015' && lower.includes('service-port'))) {
      return SIMULATOR_COMMANDS['display service-port 100'];
    }

    if (lower.startsWith('display dfs-group') || lower.startsWith('display m-lag') || lower.startsWith('display mlag') || (labId === 'lab-016' && (lower.includes('lag') || lower.includes('dfs')))) {
      if (lower.includes('node') || lower.includes('heartbeat')) return SIMULATOR_COMMANDS['display dfs-group 1 node'];
      return SIMULATOR_COMMANDS['display dfs-group 1 m-lag'];
    }

    if (lower.startsWith('display vxlan') || (labId === 'lab-016' && lower.includes('vxlan'))) {
      if (lower.includes('tunnel')) return SIMULATOR_COMMANDS['display vxlan tunnel'];
      return SIMULATOR_COMMANDS['display vxlan vni verbose'];
    }

    if (lower.startsWith('display evpn') || (labId === 'lab-016' && lower.includes('evpn'))) {
      return SIMULATOR_COMMANDS['display evpn routing-table'];
    }

    if (lower.startsWith('display dcb') || lower.startsWith('display pfc') || (labId === 'lab-016' && (lower.includes('pfc') || lower.includes('roce')))) {
      return SIMULATOR_COMMANDS['display dcb pfc interface 100ge 1/0/1'];
    }

    if (lower === 'display device' || (labId === 'lab-016' && lower.includes('device'))) {
      return SIMULATOR_COMMANDS['display device'];
    }

    if (lower.startsWith('display configuration candidate') || lower.startsWith('display cand')) {
      return SIMULATOR_COMMANDS['display configuration candidate'];
    }

    if (lower.startsWith('commit trial')) {
      return SIMULATOR_COMMANDS['commit trial 300'];
    }

    if (lower === 'commit') {
      return SIMULATOR_COMMANDS['commit'];
    }

    // Check show running-config or show run
    if (lower === 'show running-config' || lower === 'show run' || lower === 'sh run') {
      if (labId) {
        const article = document.getElementById(labId);
        const codeElem = article ? article.querySelector('.terminal-body code') : null;
        if (codeElem) {
          return `! Current active configuration on ${LAB_CONFIGS[labId].device}:\n` + codeElem.innerText;
        }
      }
      return '! Current active running-configuration loaded and verified.';
    }

    // Exact match in database
    const exact = Object.keys(SIMULATOR_COMMANDS).find(k => k.toLowerCase() === lower);
    if (exact) {
      return SIMULATOR_COMMANDS[exact];
    }

    // Heuristic partial matching
    if (lower.startsWith('ping')) {
      const parts = raw.split(/\s+/);
      const target = parts[1] || '10.255.255.2';
      return `Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 12/16/22 ms`;
    }

    if (lower.startsWith('subnet')) {
      return SIMULATOR_COMMANDS['subnet 172.16.0.0/23'];
    }

    if (lower.includes('ospf')) {
      return lower.includes('route') ? SIMULATOR_COMMANDS['show ip route ospf'] : SIMULATOR_COMMANDS['show ip ospf neighbor'];
    }

    if (lower.includes('standby') || lower.includes('hsrp')) {
      return SIMULATOR_COMMANDS['show standby brief'];
    }

    if (lower.includes('bgp')) {
      return SIMULATOR_COMMANDS['show ip bgp summary'];
    }

    if (lower.includes('etherchannel') || lower.includes('lacp')) {
      return SIMULATOR_COMMANDS['show etherchannel summary'];
    }

    if (lower.includes('crypto') || lower.includes('ipsec') || lower.includes('vti')) {
      return SIMULATOR_COMMANDS['show crypto session detail'];
    }

    if (lower.includes('/ip route') || (labId === 'lab-006' && lower.includes('route'))) {
      return SIMULATOR_COMMANDS['/ip route print'];
    }

    if (lower.includes('queue') || (labId === 'lab-006' && lower.includes('pcq'))) {
      return SIMULATOR_COMMANDS['/queue tree print'];
    }

    if (lower.includes('mangle')) {
      return SIMULATOR_COMMANDS['/ip firewall mangle print'];
    }

    if (lower.includes('nginx')) {
      return SIMULATOR_COMMANDS['nginx -t'];
    }

    if (lower.includes('curl')) {
      return SIMULATOR_COMMANDS['curl -I https://gautambhuwan.com.np'];
    }

    if (lower.includes('docker') && lower.includes('ps')) {
      return SIMULATOR_COMMANDS['docker ps'];
    }

    if (lower.includes('docker')) {
      return SIMULATOR_COMMANDS['docker network inspect app_net'];
    }

    // Default error formats depending on device OS
    if (labId === 'lab-002' || labId === 'lab-003') {
      return `bash: ${raw}: command not found\nType 'help' to see available commands.`;
    } else if (labId === 'lab-006') {
      return `bad command name ${raw} (line 1 column 1)\nType 'help' to see RouterOS commands.`;
    } else {
      return `% Invalid input detected at '^' marker.\nType 'help' or '?' to inspect valid Cisco IOS commands.`;
    }
  }

  // 1. Initialize Master CLI Sandbox at Top
  const sandboxScreen = document.getElementById('sandbox-screen');
  const sandboxInput = document.getElementById('sandbox-input');
  const sandboxChips = document.querySelectorAll('.sandbox-chip');
  const masterHistory = [];
  let masterHistoryIdx = -1;

  function appendMasterSandbox(cmd, output, isError = false) {
    if (!sandboxScreen) return;
    const group = document.createElement('div');
    group.style.marginBottom = '14px';

    if (cmd) {
      const promptLine = document.createElement('div');
      promptLine.innerHTML = `<span style="color: var(--accent-secondary); font-weight: 700;">VM-Gateway#</span> <span style="color: #f8fafc;">${escapeHtml(cmd)}</span>`;
      group.appendChild(promptLine);
    }

    const pre = document.createElement('pre');
    pre.style.color = isError ? '#ef4444' : '#a5f3fc';
    pre.style.marginTop = '4px';
    pre.textContent = output;
    group.appendChild(pre);

    sandboxScreen.appendChild(group);
    sandboxScreen.scrollTop = sandboxScreen.scrollHeight;
  }

  function runMasterCommand(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    masterHistory.push(trimmed);
    masterHistoryIdx = masterHistory.length;

    const res = resolveCommandOutput(trimmed);
    if (res === '__CLEAR__') {
      if (sandboxScreen) {
        sandboxScreen.innerHTML = `
          <div style="color: var(--text-dim); margin-bottom: 12px; font-size: 0.78rem;">
            [VM-NETOS v2.6.4 // MULTI-VENDOR LAB EMULATOR ONLINE] Screen cleared. Type 'help' for commands.
          </div>
        `;
      }
    } else {
      const isErr = res.startsWith('% Invalid') || res.startsWith('bash:') || res.startsWith('bad command');
      appendMasterSandbox(trimmed, res, isErr);
    }
  }

  if (sandboxInput) {
    sandboxInput.setAttribute('placeholder', "Type a command (Press TAB to complete, '?' for help)...");

    sandboxInput.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion(sandboxInput, null, (helpText) => {
          appendMasterSandbox(sandboxInput.value, helpText);
        });
      } else if (e.key === '?') {
        e.preventDefault();
        const helpText = generateContextHelp(sandboxInput.value);
        appendMasterSandbox(`${sandboxInput.value}?`, helpText);
      } else if (e.key === 'Enter') {
        const val = sandboxInput.value;
        sandboxInput.value = '';
        runMasterCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (masterHistoryIdx > 0) {
          masterHistoryIdx--;
          sandboxInput.value = masterHistory[masterHistoryIdx] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (masterHistoryIdx < masterHistory.length - 1) {
          masterHistoryIdx++;
          sandboxInput.value = masterHistory[masterHistoryIdx] || '';
        } else {
          masterHistoryIdx = masterHistory.length;
          sandboxInput.value = '';
        }
      }
    });

    // Click anywhere on sandbox screen to focus input
    const sandboxCard = document.getElementById('interactive-sandbox');
    if (sandboxCard) {
      sandboxCard.addEventListener('click', (e) => {
        if (!e.target.closest('.sandbox-chips')) {
          sandboxInput.focus();
        }
      });
    }
  }

  // Quick Chips in Master Sandbox
  sandboxChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd') || chip.textContent.trim();
      if (sandboxInput) {
        sandboxInput.value = cmd;
        sandboxInput.focus();
      }
      runMasterCommand(cmd);
    });
  });

  // 2. Initialize Per-Lab Interactive Typing Terminals
  const labArticles = document.querySelectorAll('article[id^="lab-"]');

  labArticles.forEach(article => {
    const labId = article.id;
    const cfg = LAB_CONFIGS[labId] || {
      prompt: 'Device#',
      device: 'Network Device',
      defaultCmd: 'show ip route',
      helpCmds: ['help', 'clear']
    };

    const terminalCard = article.querySelector('.terminal-card');
    if (!terminalCard) return;

    const terminalHeader = terminalCard.querySelector('.terminal-header');
    const terminalBody = terminalCard.querySelector('.terminal-body');
    if (!terminalHeader || !terminalBody) return;

    // A. Add Quick-Actions to Terminal Header
    if (!terminalHeader.querySelector('.terminal-actions')) {
      const actionsGroup = document.createElement('div');
      actionsGroup.className = 'terminal-actions';

      const runBtn = document.createElement('button');
      runBtn.type = 'button';
      runBtn.className = 'terminal-btn btn-run';
      runBtn.innerHTML = `<span>▶ Run Live Test</span>`;
      runBtn.title = `Simulate live verification on ${cfg.device}`;

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'terminal-btn';
      copyBtn.innerHTML = `<span>📋 Copy</span>`;
      copyBtn.title = 'Copy configuration';

      actionsGroup.appendChild(runBtn);
      actionsGroup.appendChild(copyBtn);
      terminalHeader.appendChild(actionsGroup);

      // Copy listener
      copyBtn.addEventListener('click', () => {
        const codeText = terminalBody.innerText;
        if (window.AppData && typeof window.AppData.copyToClipboard === 'function') {
          window.AppData.copyToClipboard(codeText, copyBtn);
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(codeText).then(() => {
            const orig = copyBtn.innerHTML;
            copyBtn.innerHTML = `<span>✓ Copied!</span>`;
            setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
          });
        }
      });
    }

    // B. Create Interactive Session Output Log Window
    let sessionLog = terminalCard.querySelector('.terminal-session-log');
    if (!sessionLog) {
      sessionLog = document.createElement('div');
      sessionLog.className = 'terminal-session-log';
      sessionLog.setAttribute('role', 'region');
      sessionLog.setAttribute('aria-label', `Interactive terminal output for ${cfg.device}`);
      terminalCard.appendChild(sessionLog);
    }

    // C. Create Interactive Command Prompt Input Bar
    let interactiveBar = terminalCard.querySelector('.terminal-interactive-bar');
    if (!interactiveBar) {
      interactiveBar = document.createElement('div');
      interactiveBar.className = 'terminal-interactive-bar';
      interactiveBar.innerHTML = `
        <span class="terminal-interactive-prompt">${escapeHtml(cfg.prompt)}</span>
        <input 
          type="text" 
          class="terminal-interactive-input" 
          placeholder="Type command (Tab to autocomplete, '?' for help)..." 
          autocomplete="off" 
          spellcheck="false"
          aria-label="Execute command on ${escapeHtml(cfg.device)}"
        >
        <button type="button" class="terminal-interactive-btn">Enter ↵</button>
      `;
      terminalCard.appendChild(interactiveBar);
    }

    const cardInput = interactiveBar.querySelector('.terminal-interactive-input');
    const cardSubmit = interactiveBar.querySelector('.terminal-interactive-btn');
    const cardRunHeaderBtn = terminalHeader.querySelector('.btn-run');

    const cardHistory = [];
    let cardHistoryIdx = -1;

    function appendCardSession(cmd, output, isError = false) {
      sessionLog.classList.add('has-entries');

      const entry = document.createElement('div');
      entry.style.marginBottom = '12px';

      const promptDiv = document.createElement('div');
      promptDiv.innerHTML = `<span style="color: var(--accent-secondary); font-weight: 700;">${escapeHtml(cfg.prompt)}</span> <span style="color: #f8fafc;">${escapeHtml(cmd)}</span>`;
      entry.appendChild(promptDiv);

      const outPre = document.createElement('pre');
      outPre.style.color = isError ? '#ef4444' : '#a5f3fc';
      outPre.style.margin = '4px 0 0 0';
      outPre.style.whiteSpace = 'pre-wrap';
      outPre.style.wordBreak = 'break-word';
      outPre.textContent = output;
      entry.appendChild(outPre);

      sessionLog.appendChild(entry);
      sessionLog.scrollTop = sessionLog.scrollHeight;
    }

    function executeCardCommand(commandText) {
      const trimmed = commandText.trim();
      if (!trimmed) return;

      cardHistory.push(trimmed);
      cardHistoryIdx = cardHistory.length;

      const res = resolveCommandOutput(trimmed, labId);

      if (res === '__CLEAR__') {
        sessionLog.innerHTML = '';
        sessionLog.classList.remove('has-entries');
        return;
      }

      const isErr = res.startsWith('% Invalid') || res.startsWith('bash:') || res.startsWith('bad command');
      appendCardSession(trimmed, res, isErr);
    }

    // Input keydown listener (Enter, Tab, ?, ArrowUp, ArrowDown)
    if (cardInput) {
      cardInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          handleTabCompletion(cardInput, labId, (helpText) => {
            appendCardSession(cardInput.value, helpText);
          });
        } else if (e.key === '?') {
          e.preventDefault();
          const helpText = generateContextHelp(cardInput.value, labId);
          appendCardSession(`${cardInput.value}?`, helpText);
        } else if (e.key === 'Enter') {
          const val = cardInput.value;
          cardInput.value = '';
          executeCardCommand(val);
        } else if (e.key === 'ArrowUp') {
          if (cardHistoryIdx > 0) {
            cardHistoryIdx--;
            cardInput.value = cardHistory[cardHistoryIdx] || '';
          }
        } else if (e.key === 'ArrowDown') {
          if (cardHistoryIdx < cardHistory.length - 1) {
            cardHistoryIdx++;
            cardInput.value = cardHistory[cardHistoryIdx] || '';
          } else {
            cardHistoryIdx = cardHistory.length;
            cardInput.value = '';
          }
        }
      });
    }

    // Button submit listener
    if (cardSubmit) {
      cardSubmit.addEventListener('click', () => {
        if (cardInput) {
          const val = cardInput.value;
          cardInput.value = '';
          executeCardCommand(val);
          cardInput.focus();
        }
      });
    }

    // Header "Run Live Test" button types in default command and executes
    if (cardRunHeaderBtn) {
      cardRunHeaderBtn.addEventListener('click', () => {
        if (cardInput) {
          cardInput.value = cfg.defaultCmd;
          executeCardCommand(cfg.defaultCmd);
          cardInput.focus();
        }
      });
    }

    // Clicking anywhere on the session log focuses the input
    sessionLog.addEventListener('click', () => {
      if (cardInput) cardInput.focus();
    });
  });

  // 3. Lab Search & Fast-Travel Navigator Controller
  const labSearchInput = document.getElementById('lab-search-input');
  const labFilterPills = document.querySelectorAll('.lab-filter-pill');
  const labSearchStatus = document.getElementById('lab-search-status');
  const jumpBottomLabsBtn = document.getElementById('btn-jump-bottom-labs');

  if (jumpBottomLabsBtn) {
    jumpBottomLabsBtn.addEventListener('click', () => {
      const bottomLab = document.getElementById('lab-016') || document.querySelector('article[id^="lab-"]:last-of-type');
      if (bottomLab) {
        bottomLab.scrollIntoView({ behavior: 'smooth', block: 'start' });
        bottomLab.classList.add('lab-highlight-match');
        setTimeout(() => bottomLab.classList.remove('lab-highlight-match'), 2000);
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    });
  }

  if (labSearchInput && labArticles.length) {
    let activePlatform = 'all';

    function filterLabs() {
      const query = labSearchInput.value.trim().toLowerCase();
      let matchCount = 0;
      let firstMatch = null;

      labArticles.forEach(article => {
        const text = article.innerText.toLowerCase();
        const articleId = article.id.toLowerCase();
        
        let platformMatch = true;
        if (activePlatform === 'huawei') {
          platformMatch = text.includes('huawei') || text.includes('vrp') || text.includes('cloudengine') || text.includes('ma5800') || text.includes('ma5608t') || text.includes('ce6800') || text.includes('ce8800');
        } else if (activePlatform === 'cisco') {
          platformMatch = text.includes('cisco') || text.includes('ios') || text.includes('hsrp');
        } else if (activePlatform === 'juniper') {
          platformMatch = text.includes('juniper') || text.includes('junos') || text.includes('srx') || text.includes('mx204');
        } else if (activePlatform === 'mikrotik') {
          platformMatch = text.includes('mikrotik') || text.includes('routeros');
        } else if (activePlatform === 'linux') {
          platformMatch = text.includes('linux') || text.includes('docker') || text.includes('nginx') || text.includes('wireguard') || text.includes('python');
        }

        const queryMatch = !query || text.includes(query) || articleId.includes(query);

        if (platformMatch && queryMatch) {
          article.style.display = 'block';
          matchCount++;
          if (!firstMatch) firstMatch = article;
        } else {
          article.style.display = 'none';
        }
      });

      if (labSearchStatus) {
        if (query || activePlatform !== 'all') {
          labSearchStatus.style.display = 'block';
          labSearchStatus.textContent = `Showing ${matchCount} of ${labArticles.length} lab configurations${query ? ` matching "${query}"` : ''}.`;
        } else {
          labSearchStatus.style.display = 'none';
        }
      }

      return firstMatch;
    }

    labSearchInput.addEventListener('input', () => {
      filterLabs();
    });

    labSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const match = filterLabs();
        if (match) {
          match.scrollIntoView({ behavior: 'smooth', block: 'start' });
          match.classList.add('lab-highlight-match');
          setTimeout(() => match.classList.remove('lab-highlight-match'), 2000);
        }
      } else if (e.key === 'Escape') {
        labSearchInput.value = '';
        activePlatform = 'all';
        labFilterPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-platform') === 'all'));
        filterLabs();
      }
    });

    labFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        labFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activePlatform = pill.getAttribute('data-platform') || 'all';
        filterLabs();
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
