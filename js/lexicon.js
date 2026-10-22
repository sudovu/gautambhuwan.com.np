/**
 * VHUWON MATHERS — The Plain-English Systems & Network Lexicon
 * Domain: gautambhuwan.com.np
 * 
 * Interactive Encyclopedia & Jargon Buster for:
 * - Networking & Protocols
 * - Systems, Linux & OS
 * - Fiber Optics & Hardware
 * - Cloud & Architecture
 * - Security & Access
 * 
 * Features:
 * - Real-time keyword & fuzzy search
 * - Category filter pills with dynamic count badges
 * - A-Z alphabetical jump index
 * - Shareable permalink deep-linking (#term-slug)
 * - Copy definition & permalink actions
 */

const LEXICON_DATA = [
  {
    "id": "anycast",
    "term": "Anycast",
    "full": "Anycast Routing Architecture",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Imagine calling emergency services (911 or 100). The phone number is the exact same across the entire country, but your call isn't answered in a capital city 1,000 km away\u2014it rings at the local police station just 2 km from your house. In Anycast, 50 servers across the globe all share the exact same IP address (like Cloudflare's 1.1.1.1 or Google's 8.8.8.8), and Internet routers automatically deliver your packet to the closest physical server.",
    "technical": "A network addressing and routing methodology where a single unicast IP address is simultaneously advertised via BGP from multiple geographic edge locations. Routers forward traffic along the shortest AS-path using standard BGP path selection, delivering natural DDoS absorption, low latency, and automatic geographic failover.",
    "whyItMatters": "Anycast is the backbone of global CDNs (Cloudflare, Fastly) and root DNS servers. If an Anycast server in Tokyo catches fire or goes offline, BGP instantly diverts traffic to Seoul or Osaka with zero user downtime.",
    "tags": [
      "BGP",
      "CDN",
      "1.1.1.1",
      "8.8.8.8",
      "DDoS Mitigation",
      "Geographic Routing"
    ]
  },
  {
    "id": "arp-ndp",
    "term": "ARP & NDP",
    "full": "Address Resolution Protocol (IPv4) & Neighbor Discovery (IPv6)",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Imagine entering a crowded classroom where you know someone's name ('Who is 192.168.1.50?') but you don't know what they look like. You stand up and shout to the entire room: 'Whoever is 192.168.1.50, tell me your face!'. The person stands up and replies: 'That's me, my face is MAC 00:1A:2B:3C:4D:5E!'. Now you can pass notes directly to their desk.",
    "technical": "ARP translates a known Layer 3 IP address into a Layer 2 physical MAC address via local broadcast requests (FF:FF:FF:FF:FF:FF) and unicast replies. IPv6 replaces ARP with NDP (Neighbor Discovery Protocol), which uses ICMPv6 multicast solicitations instead of noisy broadcasts.",
    "whyItMatters": "Without ARP/NDP, computers cannot wrap IP packets inside Ethernet frames to deliver them across local switches. ARP spoofing/poisoning is also a common cyberattack where hackers trick your computer into sending all your bank traffic to the hacker's MAC address.",
    "tags": [
      "Layer 2/3",
      "Broadcast",
      "Multicast",
      "ICMPv6",
      "MAC Mapping"
    ]
  },
  {
    "id": "asic-cpu-fpga",
    "term": "ASIC vs CPU vs FPGA",
    "full": "Application-Specific Integrated Circuit vs General CPU vs Programmable Gate Array",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "A CPU is a brilliant universal mathematician who can solve any puzzle in the world, write essays, or play games, but handles one task at a time. An ASIC is a physical stamping machine with steel gears carved at a factory that does ONLY ONE job (like inspecting Ethernet packet headers and forwarding them at 100 Gigabits per second), but does it in nanoseconds with tiny electricity. An FPGA is like a box of magnetic Lego bricks that can reshape its physical circuitry on demand.",
    "technical": "CPUs handle general-purpose von Neumann computing with variable clock instruction cycles. ASICs are custom silicon chips with hardwired logic gates designed exclusively for high-throughput packet switching (e.g. Broadcom Tomahawk, Cisco Silicon One) processing terabits per second at wire speed. FPGAs provide field-reconfigurable logic blocks for rapid prototyping and low-latency financial trading.",
    "whyItMatters": "Enterprise 48-port switches cannot forward 480 Gigabits of network traffic per second using an Intel or AMD CPU; they require dedicated switching ASICs to perform lookups in hardware.",
    "tags": [
      "Hardware",
      "Silicon",
      "Wire Speed",
      "Broadcom",
      "Nanoseconds"
    ]
  },
  {
    "id": "bgp",
    "term": "BGP",
    "full": "Border Gateway Protocol",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "BGP is the Postal Navigation GPS of the entire global Internet. Individual companies, universities, and ISPs (called Autonomous Systems) are like different countries. BGP is the treaty and routing map they use to tell each other: 'If you want to send mail to Nepal or Google, hand the packet to me, and I can deliver it in 3 border hops.'",
    "technical": "The de facto exterior gateway path-vector protocol (TCP port 179) that connects the global Internet between Autonomous Systems (ASNs). It makes routing decisions based on network policies, path attributes (AS_PATH, Local Preference, MED, Communities), and prevents routing loops by rejecting routes that contain the receiving router's own ASN.",
    "whyItMatters": "When a major telco accidentally fat-fingers or leaks a BGP route announcement, millions of users around the world lose access to Facebook, Google, or Cloudflare in seconds (BGP route hijacking / leaks).",
    "tags": [
      "Exterior Routing",
      "ASN",
      "AS_PATH",
      "Peering",
      "Transit",
      "TCP 179"
    ]
  },
  {
    "id": "cdn",
    "term": "CDN",
    "full": "Content Delivery Network (Cloudflare, Fastly, Akamai)",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "Imagine your favorite ice cream factory is located in California, USA. If an ice cream lover in Kathmandu, Nepal orders a scoop, waiting for a plane to fly across the Pacific Ocean takes 20 hours and the ice cream melts. Instead, the company opens hundreds of local refrigerated mini-stores in Kathmandu, London, Tokyo, and Sydney. When you order, your scoop is handed to you from the shop around the corner in 5 milliseconds. That's a CDN for images, CSS, and video.",
    "technical": "A geographically distributed network of proxy edge servers caching static web assets (images, video, JS, CSS) and terminating TLS connections close to end-users via Anycast routing, reducing Round-Trip Time (RTT) and origin server load.",
    "whyItMatters": "A viral news article or product launch that would instantly crush an origin web server with 100,000 requests/sec will be easily served by CDN edge cache with 95%+ cache hit ratios.",
    "tags": [
      "Edge Caching",
      "Anycast",
      "RTT Reduction",
      "Origin Shield",
      "Cloudflare"
    ]
  },
  {
    "id": "container-vs-vm",
    "term": "Container vs VM",
    "full": "Docker Containers vs Hardware Virtual Machines",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "A Virtual Machine (VM) is like building an entire standalone house with its own concrete foundation, plumbing, furnace, and electricity generator (its own heavy guest operating system). A Container (Docker) is like renting a room in a modern apartment building: everyone has private lockable doors and their own furniture (isolated app code and libraries), but everyone shares the main building's water pipes and structural foundation (the host Linux kernel). Containers start in 100 milliseconds; VMs take 2 minutes.",
    "technical": "VMs run atop a Hypervisor (Type 1 KVM/ESXi or Type 2 VirtualBox) virtualizing physical CPU, memory, and virtual disks with full guest OS kernels. Containers are isolated user-space processes sharing the host Linux kernel, isolated via kernel Namespaces and constrained via cgroups.",
    "whyItMatters": "A single server that can run only 10 heavy Virtual Machines can easily run 300 lightweight Docker microservices, slashing cloud hosting costs.",
    "tags": [
      "Docker",
      "Hypervisor",
      "KVM",
      "Lightweight",
      "Kernel Sharing"
    ]
  },
  {
    "id": "cron",
    "term": "Cron & Cronjob",
    "full": "Time-Based Job Scheduler",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Think of Cron like the recurring alarm clock on your nightstand. You set it to ring 'Every Sunday at 3:00 AM' so you can take out the trash or run database backups. You don't have to stay awake in the middle of the night; the server automatically wakes up, executes the chore, and goes back to sleep.",
    "technical": "A Unix background daemon (`crond`) that executes scheduled shell commands at specified intervals defined in `crontab` files. Standard syntax consists of 5 time fields: `Minute (0-59)`, `Hour (0-23)`, `Day of Month (1-31)`, `Month (1-12)`, and `Day of Week (0-7)` followed by the command path.",
    "whyItMatters": "Cron powers automated database backups, log rotation, SSL certificate renewals (Let's Encrypt Certbot), and health checks across millions of production servers.",
    "tags": [
      "Automation",
      "crontab",
      "Scheduling",
      "Backups",
      "crond"
    ]
  },
  {
    "id": "daemon-systemd",
    "term": "Daemon & Systemd Service",
    "full": "Background Process & Linux Service Manager",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "When you use your computer, you see active windows like your browser or music player. But in the background, there are silent utility workers running: the clock sync worker, the printer monitor, and the Wi-Fi scanner. You don't have to open a window for them; they start when the server boots and work in the shadows. That's a daemon (traditionally ending in 'd', like `sshd` or `httpd`). Systemd is their supervisor.",
    "technical": "A daemon is a background process detached from any controlling terminal (TTY), usually with parent PID 1. `systemd` is the dominant Linux init system and service manager that handles parallel boot service initialization, socket activation, dependency tracking, logging via `journald`, and process lifecycle via `systemctl`.",
    "whyItMatters": "Modern web servers, databases, and microservices run as daemons managed by systemd. If a database crashes, systemd can automatically restart it in 50 milliseconds without human intervention.",
    "tags": [
      "PID 1",
      "Init",
      "systemctl",
      "Background Process",
      "journalctl"
    ]
  },
  {
    "id": "db-vs-dbm",
    "term": "dB vs dBm",
    "full": "Decibels (Relative Ratio) vs Decibel-Milliwatts (Absolute Power)",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Think of dB like a percentage coupon: '50% off' (a loss of 3 dB) tells you how much smaller something became, but it doesn't tell you how much money you started with. Decibel-milliwatts (dBm) is the actual money in your wallet measured against 1 milliwatt of power. If your laser starts with +3 dBm and passes through a splitter with -15 dB of loss, your home router receives -12 dBm of optical power.",
    "technical": "dB is a dimensionless logarithmic unit expressing the relative ratio between two power values ($10 \\log_{10}(P_1 / P_2)$); -3 dB represents a 50% power loss. dBm is an absolute power measurement referenced to 1 milliwatt ($10 \\log_{10}(P / 1\\text{mW})$); 0 dBm = 1 mW, +10 dBm = 10 mW, -20 dBm = 0.01 mW.",
    "whyItMatters": "Fiber engineers verify FTTH optical budgets using dBm: a healthy home ONU expects an optical signal between -15 dBm and -24 dBm. If power drops past -28 dBm, packet loss spikes and the router loses sync.",
    "tags": [
      "Optical Budget",
      "Logarithmic",
      "Power Ratio",
      "Attenuation",
      "-27 dBm"
    ]
  },
  {
    "id": "ddos",
    "term": "DDoS",
    "full": "Distributed Denial of Service",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "Imagine a prankster hiring 500 people to simultaneously crowd into the doorway of a small neighborhood bakery and constantly ask stupid questions. Real paying customers who want to buy fresh bread cannot even get inside the door, and the bakery staff collapses from exhaustion. A DDoS attack is when a hacker hijacks 100,000 infected smart toasters, cameras, and computers (a Botnet) and commands them to spam a website with fake requests all at once.",
    "technical": "A coordinated malicious cyberattack overwhelming a target server, network, or service with a massive flood of Internet traffic from distributed compromised nodes (Botnet). Categories include volumetric floods (UDP/NTP amplification, SYN floods), protocol attacks, and Layer 7 application resource exhaustion (HTTP POST floods).",
    "whyItMatters": "Volumetric DDoS attacks can easily exceed 1 to 2 Terabits per second of malicious traffic, completely saturating an ISP's physical fiber links unless absorbed by Anycast scrubbing centers.",
    "tags": [
      "Botnet",
      "SYN Flood",
      "Amplification",
      "Scrubbing",
      "Rate Limiting"
    ]
  },
  {
    "id": "default-gateway",
    "term": "Default Gateway",
    "full": "Default Gateway Router",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of your local home or office network like your private living room. If you want to talk to your sibling sitting on the couch (another PC on the same Wi-Fi), you speak directly. But if you want a pizza from across town (a website like Netflix or Wikipedia), you must walk through the front security door. The front door is the Default Gateway\u2014the router that leads out to the rest of the planet.",
    "technical": "The Layer 3 router interface IP (often .1 or .254) configured on a host. When a packet's destination IP is evaluated against the local subnet mask and falls outside the local subnet, the host consults its route table (0.0.0.0/0) and encapsulates the packet addressed to the gateway's MAC address.",
    "whyItMatters": "If your default gateway IP is misconfigured, missing, or unreachable, your computer can talk to local printers and NAS storage in your room, but 100% of external internet traffic will immediately fail.",
    "tags": [
      "Router",
      "Route 0.0.0.0/0",
      "Next-Hop",
      "Exit Point"
    ]
  },
  {
    "id": "dhcp",
    "term": "DHCP",
    "full": "Dynamic Host Configuration Protocol",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of DHCP like a valet parking attendant at a luxury hotel. When your car (laptop/phone) pulls up to the parking lot (Wi-Fi router), the attendant hands you an available numbered parking spot ticket (IP address), points you to the exit driveway (Default Gateway), and gives you the hotel guide (DNS server). When you leave, that parking ticket goes back to the valet for the next visitor.",
    "technical": "A client-server protocol (UDP ports 67/68) using the 4-step DORA process (Discover, Offer, Request, Acknowledge) to automatically assign temporary IP addresses from a subnet pool, along with subnet masks, default gateways, and DNS resolvers under a configurable lease time.",
    "whyItMatters": "Without DHCP, every user in a 5,000-person office or coffee shop would have to manually type their IP address, subnet mask, and gateway by hand, creating chaotic IP address collisions whenever two people pick the same number.",
    "tags": [
      "DORA",
      "IP Lease",
      "UDP 67/68",
      "Auto-Config"
    ]
  },
  {
    "id": "dns",
    "term": "DNS",
    "full": "Domain Name System",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of DNS like the Contact Book on your smartphone. You don't memorize 10-digit random phone numbers for everyone; you just tap 'Mom' or 'Pizza Shop', and your phone looks up the actual phone number behind the scenes. DNS turns human names (like google.com) into numeric IP addresses (like 142.250.190.46) so computers can talk.",
    "technical": "A hierarchical, globally distributed database operating over UDP/TCP port 53. Resolves Fully Qualified Domain Names (FQDNs) to IPv4/IPv6 addresses (A/AAAA records), mail exchangers (MX), and aliases (CNAME) via Root ('.'), Top-Level Domain (.com, .np), and Authoritative nameservers with client-side caching governed by TTL (Time-to-Live).",
    "whyItMatters": "Almost 80% of perceived 'Internet is down!' incidents are actually DNS resolution failures. If your DNS server crashes or times out, websites won't load even if your fiber cable and router are working perfectly.",
    "tags": [
      "IP",
      "Domain",
      "UDP 53",
      "Root Servers",
      "Resolver"
    ]
  },
  {
    "id": "dom-ddm",
    "term": "DOM / DDM",
    "full": "Digital Optical Monitoring / Digital Diagnostic Monitoring",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Think of DOM like the digital dashboard inside a modern car that displays your real-time engine temperature, oil pressure, and battery voltage. Instead of sending an engineer with an optical power meter into the server room to physically unplug a cable and measure the light, the switch reads internal sensors built directly inside the SFP transceiver chip.",
    "technical": "An industry standard (SFF-8472) providing real-time telemetry from transceiver microcontrollers via I2C serial bus. Monitors 5 primary physical parameters: Transmit (Tx) Optical Power, Receive (Rx) Optical Power, Laser Bias Current, Operating Temperature, and Transceiver Supply Voltage.",
    "whyItMatters": "Network monitoring tools (like LibreNMS or Zabbix) use DOM via SNMP to trigger automated alerts when a fiber's optical receive power degrades from -18 dBm toward -26 dBm, allowing engineers to replace dirty patch cords before customers experience outages.",
    "tags": [
      "SFF-8472",
      "Rx/Tx Power",
      "Telemetry",
      "SNMP",
      "Transceiver Health"
    ]
  },
  {
    "id": "env-vars",
    "term": "Environment Variable",
    "full": "Process Dynamic Configuration Values ($PATH, $HOME)",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Think of environment variables like colorful sticky notes placed on a workshop bulletin board where all craftsmen (programs) can glance at them. One note says '$HOME = /home/bhuwan' and another says '$PATH = where to find tools'. When a program starts, it reads the sticky notes to know where to find its tools without you having to re-type the directions every single time.",
    "technical": "Key-value string pairs maintained in a process's memory space and inherited by child processes during `fork()`. Crucial system variables include `$PATH` (directories searched for executable binaries), `$USER`, `$SHELL`, and application-specific settings like `DATABASE_URL`.",
    "whyItMatters": "Modern twelve-factor app architecture requires keeping passwords, API keys, and database credentials inside environment variables rather than hardcoded in source code files.",
    "tags": [
      "$PATH",
      "Twelve-Factor",
      "Shell Config",
      "Credentials",
      "Processes"
    ]
  },
  {
    "id": "ephemeral-ports",
    "term": "Ephemeral Ports",
    "full": "Dynamic Client Return Ports",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "When you mail a letter to a company, you write their permanent address on the envelope (Port 443 for HTTPS). But you must also write YOUR return address in the corner so they know where to mail the reply. An Ephemeral Port is that temporary return mailbox your operating system creates for 2 seconds while a web page is downloading, then erases when finished.",
    "technical": "Short-lived transport ports dynamically allocated by the client OS IP stack from a designated range (Linux default: 32768 to 60999; IANA standard: 49152 to 65535) for outbound connections, ensuring bidirectional socket uniqueness.",
    "whyItMatters": "High-throughput proxies and microservices can suffer from 'Ephemeral Port Exhaustion' if connections are opened and closed too rapidly without connection reuse (TIME_WAIT saturation).",
    "tags": [
      "TIME_WAIT",
      "Dynamic Range",
      "Client Ports",
      "TCP Sockets"
    ]
  },
  {
    "id": "file-descriptor",
    "term": "File Descriptor (FD)",
    "full": "Integer Handle to Open I/O Streams",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "When you check your winter coat at a busy museum cloakroom, the attendant hands you a small brass token stamped with the number '7'. You don't carry your heavy coat around; whenever you want to check your pocket or retrieve your coat, you just show token #7. A File Descriptor is that numbered token the Linux OS hands your program whenever it opens a file, network socket, or pipe.",
    "technical": "A non-negative integer serving as an index into the process's per-process file descriptor table, which points to the system-wide open file table in kernel memory. Standard streams are initialized as 0 (Standard Input / stdin), 1 (Standard Output / stdout), and 2 (Standard Error / stderr). Everything in Linux\u2014including network sockets\u2014is treated as a file descriptor.",
    "whyItMatters": "High-traffic web servers like Nginx or Redis can crash with 'Too many open files' errors if the OS file descriptor limit (`ulimit -n`) is left at default values (like 1024) instead of raised to 65535+.",
    "tags": [
      "ulimit",
      "stdin/stdout/stderr",
      "Sockets",
      "Linux I/O",
      "Handles"
    ]
  },
  {
    "id": "firewall-types",
    "term": "Firewall",
    "full": "Stateless vs Stateful vs Next-Gen (L7) Firewall",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "A Stateless Firewall is a guard checking IDs at a door with a printed checklist: 'If someone is wearing a red hat, block them.' (it has no memory). A Stateful Firewall is a guard who remembers: 'I watched this specific office worker walk out the door 2 minutes ago to fetch coffee, so I will naturally let them back in without interrogating them.' A Next-Gen (L7) Firewall reads the contents of the worker's briefcase to make sure they aren't sneaking in malware disguised as a coffee thermos.",
    "technical": "Network security devices controlling traffic flow. Stateless firewalls inspect individual packets in isolation against ACLs. Stateful firewalls track connection states (TCP 3-way handshake, SYN, ESTABLISHED) via connection tracking tables (`conntrack`). Next-Generation Firewalls (NGFW / Palo Alto, Fortinet) perform Deep Packet Inspection (DPI) to identify application signatures, malware, and inspect decrypted TLS streams.",
    "whyItMatters": "Stateful firewalls prevent hackers from injecting unsolicited attack packets into an internal network while allowing internal employees to initiate outbound web browsing without having to open every port in reverse.",
    "tags": [
      "iptables",
      "conntrack",
      "ACL",
      "DPI",
      "NGFW",
      "Stateful"
    ]
  },
  {
    "id": "fusion-splicer",
    "term": "Fusion Splicer",
    "full": "Core-Alignment Fiber Fusion Machine",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "When an underground fiber optic cable is cut, you cannot twist the glass wires together with electrical tape like copper cables. You must strip the protective plastic, cut the glass at a laser-flat 90-degree angle using a diamond cleaver, lay the two 9-micron glass strands under a microscopic camera, and shoot an electric spark that melts and welds the two pieces of molten glass into a single continuous seamless strand.",
    "technical": "A precision field instrument that aligns two stripped and cleaved optical fiber cores along X, Y, and Z axes using automated image processing cameras, then generates a calibrated electric arc between two tungsten electrodes to melt and fuse the glass cores with an optical insertion loss typically under 0.02 dB.",
    "whyItMatters": "A bad splice with a 0.5 dB loss or air bubble creates a back-reflection that can burn out laser transceivers or accumulate enough loss to starve downstream fiber splitters.",
    "tags": [
      "Core Alignment",
      "Electric Arc",
      "Cleaver",
      "0.02 dB Loss",
      "Glass Welding"
    ]
  },
  {
    "id": "gpon",
    "term": "GPON",
    "full": "Gigabit Passive Optical Network (ITU-T G.984)",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "In traditional networking, splitting a signal between 64 homes required placing active powered electrical switches in waterproof boxes on street telephone poles (which break during power cuts). A Passive Optical Network (PON) uses no electricity on the street whatsoever. Pure glass prisms (splitters) split the light beam like sunlight passing through a crystal prism. GPON is the technology that delivers 2.5 Gbps downstream across those glass prisms.",
    "technical": "A point-to-multipoint optical access architecture standardized by ITU-T G.984. Provides 2.488 Gbps downstream (1490nm) and 1.244 Gbps upstream (1310nm) across unpowered optical splitters (typically 1:32 or 1:64 split ratios) up to a 20km physical reach.",
    "whyItMatters": "Because the distribution network contains zero electronic chips or power supplies in the field, GPON networks are immune to lightning strikes, electromagnetic interference, and neighborhood electricity blackouts.",
    "tags": [
      "Passive Splitters",
      "2.5G Down / 1.25G Up",
      "G.984",
      "FTTH Tree"
    ]
  },
  {
    "id": "high-availability-failover",
    "term": "High Availability (HA) & Failover",
    "full": "Redundant Architecture & Automated Recovery",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "Think of a twin-engine commercial airliner flying across the ocean. Both engines run during flight. If Engine #1 suddenly catches fire or suffers a bird strike, Engine #2 instantly takes over the full load so the plane never falls from the sky. Passengers sipping coffee in the cabin barely notice. High Availability means designing computer systems with zero single points of failure.",
    "technical": "System design ensuring continuous operational uptime (measured in 'Nines', e.g. 99.999% uptime = max 5.26 minutes downtime per year) through redundant hardware, clustering, heartbeat synchronization (Keepalived, Corosync), and automated failover mechanisms.",
    "whyItMatters": "Without HA, a single dead power supply, blown fuse, or cut fiber cable in a datacenter brings down an entire business, costing thousands of dollars per minute of unplanned outage.",
    "tags": [
      "99.999%",
      "Redundancy",
      "No Single Point of Failure",
      "Heartbeat",
      "Clustering"
    ]
  },
  {
    "id": "icmp-ping",
    "term": "ICMP & Ping",
    "full": "Internet Control Message Protocol & Echo Utility",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of Ping like a submarine sonar: the submarine sends out a 'PING!' sound pulse through the ocean water, waits for the sound to hit a rock or hull, and listens for the 'PONG!' echo. By timing the delay, the captain knows if the target is alive and how far away it is. ICMP is the diagnostic whisper protocol routers use to say: 'Hey, that road is blocked!' or 'You exceeded your time limit!'.",
    "technical": "A supporting network-layer protocol (IP protocol 1) used by network devices to send error messages and operational information. Ping sends ICMP Echo Request (Type 8) packets and listens for ICMP Echo Reply (Type 0). Traceroute leverages ICMP Time Exceeded (Type 11) to discover every intermediate router along a path.",
    "whyItMatters": "Ping is the universally recognized 'first tool' of every systems and network engineer. If ping fails, you immediately know whether the physical link, route, or remote firewall is blocking traffic.",
    "tags": [
      "Diagnostics",
      "Echo Request",
      "RTT",
      "Traceroute",
      "Type 8 / Type 0"
    ]
  },
  {
    "id": "inode",
    "term": "Inode",
    "full": "Index Node (Filesystem Metadata Structure)",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "In a physical library, the book's title written on the spine is just a label for humans. The library catalog card contains the real identity: who wrote it, how thick it is, when it was borrowed, and the exact shelf coordinate where the physical paper pages reside. In Linux, a file's name is just a sticky note; the Inode is the catalog card that holds all file permissions, size, and disk block pointers.",
    "technical": "A fixed-size data structure in Unix filesystems (ext4, XFS) containing metadata about a file or directory (file size, device ID, user/group ownership, permission mode, timestamps, and pointers to disk storage blocks). Crucially, the filename itself is stored in the directory table, NOT in the inode.",
    "whyItMatters": "You can encounter a bizarre error where Linux reports 'No space left on device', even though your hard drive has 500GB of free space! This happens when millions of tiny files have exhausted all allocated Inodes (`df -i`).",
    "tags": [
      "Filesystem",
      "ext4",
      "Metadata",
      "df -i",
      "Hard Links"
    ]
  },
  {
    "id": "ip-address",
    "term": "IP Address",
    "full": "Internet Protocol Address (IPv4 & IPv6)",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of an IP address like your building's physical mailing street address. Just as the postal worker needs your country, city, street, and house number to deliver a package, the Internet routers need your IP address to know where to send YouTube video chunks or WhatsApp messages.",
    "technical": "A logical identifier assigned to a network interface at OSI Layer 3. IPv4 uses 32 bits (4 octets, e.g. 192.168.1.1, ~4.3 billion total), while IPv6 uses 128 bits represented in 8 hexadecimal quartets (e.g. 2001:db8::1, providing 340 undecillion addresses) eliminating address exhaustion.",
    "whyItMatters": "IP addresses provide global routability. Your public IP identifies your network to the entire world, while private IPs (RFC 1918) allow millions of devices in homes and offices to communicate internally without wasting global addresses.",
    "tags": [
      "Layer 3",
      "IPv4",
      "IPv6",
      "Subnet",
      "Addressing"
    ]
  },
  {
    "id": "kernel",
    "term": "Kernel",
    "full": "Operating System Kernel (Linux, XNU, NT)",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Think of the Kernel like the air traffic control tower of an international airport. The planes (software applications like Chrome, Python, or games) cannot simply land or take off whenever they feel like it, nor can they touch the tarmac (physical RAM, CPU cores, or SSD storage) without speaking to the air traffic controller (the Kernel) first. The Kernel keeps everyone from crashing into each other.",
    "technical": "The core privileged program of an operating system running in Ring 0 (kernel space). It has complete, unrestricted access to the underlying hardware and orchestrates memory management, CPU process scheduling, hardware device drivers, file system I/O, and the networking stack.",
    "whyItMatters": "If an application crashes, only that app disappears. But if the kernel encounters an unrecoverable illegal condition, the entire machine freezes and crashes (Kernel Panic in Linux, Blue Screen of Death in Windows).",
    "tags": [
      "Ring 0",
      "Core OS",
      "Process Scheduler",
      "Memory Manager",
      "Drivers"
    ]
  },
  {
    "id": "latency-bandwidth-jitter",
    "term": "Latency, Bandwidth & Jitter",
    "full": "Network Performance Metrics",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "Bandwidth is how wide your water pipe is (how many gallons per minute can flow). Latency is how many seconds it takes for a single drop of water to travel from the reservoir to your tap. Throughput is how much water actually pours into your glass right now after friction. Jitter is when the water splutters unpredictably: splash... pause... gush... pause. In online gaming and voice calls, high jitter is what turns your voice into an unrecognizable robotic stutter.",
    "technical": "Bandwidth is maximum theoretical link capacity (e.g. 1 Gbps). Latency is round-trip delay time (RTT, in ms) governed by propagation speed of light in fiber (~5\u00b5s/km) and queueing. Throughput is actual delivered data payload. Jitter is the statistical variance in packet arrival delay over time.",
    "whyItMatters": "Gamers often buy expensive 500 Mbps fiber plans thinking it will fix their game lag, but their problem was actually 150ms latency and 40ms jitter caused by poor Wi-Fi or routing, not bandwidth.",
    "tags": [
      "RTT",
      "Throughput",
      "Packet Delay Variation",
      "VoIP Quality",
      "Metrics"
    ]
  },
  {
    "id": "load-average",
    "term": "Load Average",
    "full": "System Load Average (1, 5, 15 Minutes)",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Imagine a bridge with 4 toll booths (representing a 4-core CPU). If 4 cars arrive, all 4 toll booths are busy, but nobody is waiting in line (Load Average = 4.00). If only 2 cars are there, the bridge is at 50% capacity (Load Average = 2.00). But if 12 cars arrive, 4 are paying the toll and 8 cars are backed up waiting on the highway (Load Average = 12.00). Load average tells you if your CPU is keeping up or drowning in lines.",
    "technical": "The average number of processes in a runnable state (using or waiting for CPU) PLUS processes in an uninterruptible sleep state (waiting for disk I/O or NFS locks) over 1, 5, and 15-minute intervals. Displayed by `uptime` and `top`.",
    "whyItMatters": "A high load average with low CPU percentage indicates an I/O bottleneck (processes stuck waiting for a failing hard drive or slow remote storage) rather than CPU exhaustion.",
    "tags": [
      "uptime",
      "top",
      "CPU Contention",
      "I/O Wait",
      "System Health"
    ]
  },
  {
    "id": "load-balancer",
    "term": "Load Balancer",
    "full": "Application (L7) & Network (L4) Load Balancer",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "Think of a busy supermarket with 5,000 customers queuing up. If everyone tries to push toward Cash Register #1, the cashier will collapse from exhaustion while Cash Registers #2 through #10 sit empty. A Load Balancer is the floor manager standing at the front of the queue, directing incoming customers evenly across all 10 cashiers, and immediately rerouting shoppers if one cashier takes a lunch break.",
    "technical": "A reverse proxy device or software service distributing incoming client requests across a pool of backend servers. Layer 4 load balancers (HAProxy, AWS NLB) operate at TCP/UDP level forwarding by IP/Port. Layer 7 load balancers (Nginx, Envoy, AWS ALB) inspect HTTP headers, URL paths, cookies, and TLS SNI to make application-aware routing decisions.",
    "whyItMatters": "Load balancing provides horizontal scalability and high availability: if a backend server crashes, the load balancer detects the failed health check in 1 second and transparently stops sending traffic to it.",
    "tags": [
      "L4 vs L7",
      "HAProxy",
      "Nginx",
      "Reverse Proxy",
      "Health Checks",
      "Round Robin"
    ]
  },
  {
    "id": "mac-address",
    "term": "MAC Address",
    "full": "Media Access Control Address",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of a MAC address like your government Citizen ID number or your car's stamped VIN number on the engine chassis: it is burned into your network chip at the factory and never changes no matter where you travel. In contrast, an IP address is just the temporary hotel room number you are staying in tonight.",
    "technical": "A unique 48-bit (6-octet) physical hardware address burned into a Network Interface Card (NIC) at OSI Layer 2 (e.g. 00:1A:2B:3C:4D:5E). The first 24 bits represent the Organizationally Unique Identifier (OUI / manufacturer), and the last 24 bits are the device serial number.",
    "whyItMatters": "Ethernet switches do not understand IP addresses; they only forward local traffic using MAC address tables. If two devices somehow clone or share the exact same MAC address on a local switch, packet delivery fails completely with MAC flapping.",
    "tags": [
      "Layer 2",
      "Hardware",
      "NIC",
      "Ethernet",
      "OUI"
    ]
  },
  {
    "id": "macrobend-microbend",
    "term": "Macrobend & Microbend",
    "full": "Optical Fiber Bending Losses",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Light travels through glass fiber using a physics trick called Total Internal Reflection: as long as the cable is reasonably straight, the light hits the outer cladding at a shallow angle and bounces forward. But if an installer ties a tight knot in the yellow fiber patch cord or pinches it under an office door hinge (Macrobend), the glass angle becomes too steep, and the light leaks out through the sides into the room as invisible heat.",
    "technical": "Macrobending is optical power loss caused by visible physical bends exceeding the fiber's minimum bend radius (typically <30mm in legacy G.652D, or <7.5mm in bend-insensitive G.657A2). Microbending is microscopic localized pressure or deformations on the fiber cladding. Higher wavelengths (1550nm/1625nm) suffer significantly higher macrobend attenuation than 1310nm.",
    "whyItMatters": "By comparing OTDR traces taken at both 1310nm and 1550nm, an engineer can instantly identify a pinch or crushed cable: if a loss event shows up significantly worse at 1550nm, it is a macrobend, not a bad fusion splice.",
    "tags": [
      "Bend Radius",
      "Total Internal Reflection",
      "G.657A2",
      "1550nm vs 1310nm"
    ]
  },
  {
    "id": "microservices-monolith",
    "term": "Microservices vs Monolith",
    "full": "Distributed Architecture vs Unified Single Codebase",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "A Monolith is like a giant Swiss Army Knife: the screwdriver, scissors, knife, and magnifying glass are all forged into one single metal handle. It is simple to hold, but if the scissor blade snaps, you must throw away the entire knife. Microservices are like an open-air food truck festival: one truck sells tacos, one sells lemonade, and one makes burgers. If the taco truck's stove breaks, you can still buy burgers and lemonade without shutting down the entire festival.",
    "technical": "Monolithic architectures package UI, business logic, and database access into a single deployable binary or runtime. Microservice architectures decompose applications into autonomous, loosely coupled services communicating via lightweight network APIs (gRPC, REST) with dedicated data stores.",
    "whyItMatters": "Microservices allow massive engineering teams (like Netflix or Uber) to deploy 500 times a day without waiting on a single company-wide release cycle, though it adds distributed tracing and networking complexity.",
    "tags": [
      "Architecture",
      "Loose Coupling",
      "gRPC",
      "Scalability",
      "Decomposition"
    ]
  },
  {
    "id": "mitm-attack",
    "term": "MITM Attack",
    "full": "Man-In-The-Middle Attack",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "Imagine sending handwritten romantic letters to your pen-pal, but the mail carrier secretly opens every envelope, reads your secrets, changes a few words, seals the envelope back up, and delivers it. Neither you nor your pen-pal know that a snooping third party is reading and altering every message. That is a Man-In-The-Middle attack on an unencrypted network.",
    "technical": "An attack where an adversary positions themselves in the network communication path between two legitimate endpoints (via ARP poisoning, rogue DHCP, DNS spoofing, or rogue Wi-Fi access points) to eavesdrop on or alter traffic in real-time.",
    "whyItMatters": "Strict HTTPS enforcement, HSTS (HTTP Strict Transport Security), and certificate pinning protect modern web apps against MITM interception even when users connect to compromised public Wi-Fi networks.",
    "tags": [
      "Eavesdropping",
      "ARP Poisoning",
      "HSTS",
      "Rogue Wi-Fi",
      "Security Risk"
    ]
  },
  {
    "id": "mpls",
    "term": "MPLS",
    "full": "Multi-Protocol Label Switching",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Imagine boarding a high-speed express train. Instead of the train conductor inspecting your passport, visa, and luggage at every single intermediate train station (which is what normal routers do by reading the full IP header at every hop), the check-in agent slaps a color-coded barcode sticker on your shirt at the entrance. Every intermediate station just glances at the barcode, swaps it for the next station's sticker in a microsecond, and flings you forward.",
    "technical": "A packet-forwarding mechanism inserting a 32-bit shim label between Layer 2 and Layer 3 headers. Core Label Switch Routers (LSRs) forward packets strictly by fast 20-bit label swapping (Push, Swap, Pop) rather than performing complex Layer 3 routing table lookups, enabling high-performance carrier backbones, traffic engineering, and multi-tenant L2/L3 VPNs.",
    "whyItMatters": "MPLS powers telecommunication backbones and bank enterprise WANs, allowing telecom carriers to run thousands of completely separated private corporate networks across the exact same physical fiber infrastructure.",
    "tags": [
      "Carrier Core",
      "Label Swapping",
      "LDP",
      "L3VPN",
      "Traffic Engineering"
    ]
  },
  {
    "id": "mtu-mss",
    "term": "MTU & MSS",
    "full": "Maximum Transmission Unit & Maximum Segment Size",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of MTU like the maximum vehicle height bar hanging under a low highway bridge. If a delivery truck (data packet) is taller than 1,500 millimeters, it cannot pass! It either has to stop, unpack its cargo into two smaller trucks (packet fragmentation), or crash into the barrier and be rejected (packet drop). MSS is the actual payload inside the truck, minus the truck cabin and wheels.",
    "technical": "MTU is the largest Layer 3 packet size (in bytes) that can traverse a physical link without fragmentation (standard Ethernet MTU is 1,500 bytes). MSS is the maximum Layer 4 TCP payload (MTU minus 20 bytes IP header and 20 bytes TCP header = 1,460 bytes).",
    "whyItMatters": "Tunnel protocols like PPPoE (8 bytes overhead), IPsec, and VXLAN steal header room. If MTU isn't adjusted (e.g. PPPoE MTU 1492 / MSS 1452) or Path MTU Discovery is blocked by firewalls, web pages will inexplicably freeze or hang forever during TLS handshakes (Black Hole MTU).",
    "tags": [
      "1500 Bytes",
      "Fragmentation",
      "PMTUD",
      "PPPoE",
      "Headers"
    ]
  },
  {
    "id": "namespaces-cgroups",
    "term": "Namespaces & cgroups",
    "full": "Linux Kernel Namespaces & Control Groups",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "Namespaces are blinders placed on a horse: they control what a program CAN SEE (it thinks it has its own private network, its own hard drive, and is the only program running). Control Groups (cgroups) are a strict financial budget manager: they control how much a program CAN USE (e.g. 'You are allowed a maximum of 2GB of RAM and 50% of CPU #1, and not a drop more'). Together, they are the secret sauce that makes Docker containers possible.",
    "technical": "The foundational Linux kernel primitives of containerization. Namespaces (pid, net, mnt, ipc, uts, user) isolate system resources so a process views an independent instance of the OS. cgroups (v1/v2) meter, throttle, and enforce hard limits on physical resources (CPU shares, memory caps, block I/O throughput).",
    "whyItMatters": "cgroups prevent a runaway memory leak or crypto-mining bug in one container from exhausting all server resources and starving other applications on the same node.",
    "tags": [
      "Linux Primitives",
      "Resource Limiting",
      "Container Core",
      "cgroups v2"
    ]
  },
  {
    "id": "nat-cgnat",
    "term": "NAT & CGNAT",
    "full": "Network Address Translation & Carrier-Grade NAT",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of a large apartment high-rise with 500 tenants, but only ONE street mailbox outside on the sidewalk. When tenants send letters out, the building doorman (the NAT router) stamps the building's public street address on every envelope, but jots down a secret notebook tracking who sent what. When the reply arrives, the doorman slips it into the correct tenant's apartment.",
    "technical": "Modifies IP header source/destination addresses in transit. SNAT/PAT (Port Address Translation) maps multiple private RFC 1918 addresses (192.168.x.x) to a single public IP using distinct source Layer 4 port numbers. CGNAT (RFC 6598, 100.64.0.0/10) does this at massive ISP carrier scale.",
    "whyItMatters": "NAT saved IPv4 from running out of addresses in the late 1990s. However, CGNAT breaks incoming port forwarding, making home hosting, direct P2P multiplayer gaming, and CCTV remote access difficult without IPv6 or VPN tunnels.",
    "tags": [
      "PAT",
      "RFC 1918",
      "RFC 6598",
      "Port Forwarding",
      "IPv4 Conservation"
    ]
  },
  {
    "id": "olt-ont",
    "term": "OLT & ONT / ONU",
    "full": "Optical Line Terminal & Optical Network Terminal / Unit",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "The OLT is the giant master brain sitting in the Internet Service Provider's central office. The ONT (also called ONU) is the small white Wi-Fi fiber router sitting on your desk at home. A single laser from the ISP's OLT shines down a single glass strand, gets split among 64 or 128 neighborhood homes, and each home's ONT listens only to its own encrypted time slot.",
    "technical": "The two primary endpoints of a Passive Optical Network (PON). The OLT coordinates downstream broadcast transmission (1490nm) and manages upstream Time-Division Multiple Access (TDMA at 1310nm). The ONT converts optical pulses into standard copper Ethernet and Wi-Fi frames for consumer devices.",
    "whyItMatters": "If a rogue or corrupted ONT home box malfunctions and starts shooting laser light continuously upstream out of turn (a 'Rogue ONT'), it blinds the OLT port and disconnects all 64 neighboring homes on that fiber branch.",
    "tags": [
      "FTTH",
      "PON",
      "Central Office",
      "TDMA",
      "Rogue ONT",
      "1490nm/1310nm"
    ]
  },
  {
    "id": "oom-killer",
    "term": "OOM Killer",
    "full": "Out-Of-Memory Killer (Linux Kernel Mechanism)",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Imagine a ship taking on water during a storm because someone loaded too much heavy cargo. If the captain does nothing, the entire ship will sink, drowning all 100 passengers. To save the ship, the security officer (the OOM Killer) walks on deck, picks the single heaviest passenger hogging all the space, and tosses them overboard. The ship survives, but that one passenger is gone.",
    "technical": "A kernel safeguard triggered when physical RAM and Swap are completely exhausted and memory allocation fails. The kernel reviews the `oom_score` of every running process (factoring in RSS memory consumption and CPU priority) and forcibly sends `SIGKILL` (signal 9) to the highest-scoring offender to prevent a complete system lockup.",
    "whyItMatters": "Databases and memory-hungry Java/Node applications often get silently assassinated in production by the OOM killer. Engineers must inspect `/var/log/messages` or `dmesg -T` to see if OOM struck.",
    "tags": [
      "Memory",
      "SIGKILL",
      "oom_score",
      "dmesg",
      "Kernel Safeguard"
    ]
  },
  {
    "id": "ospf",
    "term": "OSPF",
    "full": "Open Shortest Path First",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Imagine a delivery company operating 50 vans inside a single bustling city. Every van driver carries a complete live road map showing every street, traffic light, and bridge. Whenever a bridge collapses or opens up, every driver immediately radios everyone else, updates their map, and recalculates the fastest shortcut using Dijkstra's shortest path math. That is OSPF inside an enterprise network.",
    "technical": "An Interior Gateway Protocol (IGP) link-state routing protocol operating directly over IP protocol 89. Routers exchange Link-State Advertisements (LSAs) to build an identical Link-State Database (LSDB) of the network topology, then execute Dijkstra's Shortest Path First (SPF) algorithm to calculate the lowest cost loop-free paths, structured hierarchically around a central Area 0 (Backbone).",
    "whyItMatters": "OSPF converges in sub-seconds when links fail, keeping corporate offices and campus networks connected without manual administrator intervention.",
    "tags": [
      "Interior Routing",
      "Link-State",
      "Dijkstra SPF",
      "Area 0",
      "LSA"
    ]
  },
  {
    "id": "otdr",
    "term": "OTDR",
    "full": "Optical Time-Domain Reflectometer",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Imagine standing at the opening of a dark mountain tunnel and shouting 'ECHO!'. By measuring exactly how many milliseconds it takes for the echo to bounce back and how muffled it sounds, you can calculate that there is a rockslide exactly 4.2 kilometers down the tracks without walking inside. An OTDR does the exact same thing: it fires high-speed laser pulses down a fiber cable and listens for Rayleigh backscatter and Fresnel reflections to locate cuts down to the exact meter.",
    "technical": "An optoelectronic diagnostic instrument that injects high-power optical pulses (typically at 1310nm, 1550nm, or filtered 1625nm/1650nm) into an optical fiber and analyzes the returning backscattered light over time. It produces a graphical trace depicting fiber attenuation (dB/km), fusion splice losses, connector reflectance, macrobends, and fiber breaks.",
    "whyItMatters": "When a backhoe cuts an underground fiber cable along a highway, field teams don't dig up 50 kilometers of asphalt. An OTDR reading tells them: 'The cable is severed at exactly 14,320 meters from the central office.'",
    "tags": [
      "Fiber Testing",
      "Rayleigh Backscatter",
      "Fresnel Reflection",
      "Dead Zone",
      "Splice Loss"
    ]
  },
  {
    "id": "pdu",
    "term": "PDU",
    "full": "Protocol Data Unit (Bits, Frames, Packets, Segments)",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of writing a letter. At your desk, it's a sheet of paper (Data). You fold it into an envelope with an address stamp (Packet). You place that envelope inside a postal delivery truck with license plates (Frame). And the truck drives down the road over the asphalt (Bits of electricity or light). At each stage of the journey, the cargo gets wrapped in a new layer of wrapping paper.",
    "technical": "The unit of data specified in an OSI layer protocol: Layer 1 PDU is Bits/Signals; Layer 2 PDU is an Ethernet Frame (MAC headers); Layer 3 PDU is an IP Packet (IP headers); Layer 4 PDU is a TCP Segment or UDP Datagram (Port headers); Layers 5-7 PDU is Application Data/Payload.",
    "whyItMatters": "Precision terminology matters when troubleshooting: saying 'I dropped a frame' tells a network engineer to check Layer 2 switch ports and cables, while 'I dropped a packet' points to Layer 3 routing tables or firewall rules.",
    "tags": [
      "OSI Model",
      "Encapsulation",
      "Headers",
      "Frames",
      "Packets"
    ]
  },
  {
    "id": "pki-ca",
    "term": "PKI & CA",
    "full": "Public Key Infrastructure & Certificate Authority",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "If someone walks up to you on the street and says 'Trust me, I am the President of the Bank!', you wouldn't believe them. But if they pull out a government passport with a holographic seal stamped by the National Passport Office, you can verify their identity. A Certificate Authority (CA, like Let's Encrypt or DigiCert) is the Internet's trusted passport office: they digitally sign a website's cryptographic passport so your browser displays the trusted green padlock.",
    "technical": "A framework managing digital X.509 certificates and public-key encryption. Trusted Root Certificate Authorities (CAs) embed their public keys into major operating systems and web browsers. When a server presents an SSL certificate, the client verifies the cryptographic signature chain back to a trusted root in its local trust store.",
    "whyItMatters": "If an attacker tries to intercept your traffic, they cannot forge a valid cryptographic signature from a trusted CA, causing your browser to immediately flash a loud warning: 'Your connection is not private!'",
    "tags": [
      "X.509",
      "Let's Encrypt",
      "Trust Store",
      "Digital Signatures",
      "Root CA"
    ]
  },
  {
    "id": "plc-splitter",
    "term": "PLC Splitter",
    "full": "Planar Lightwave Circuit Optical Splitter",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Think of a PLC splitter like a plumbing water pipe manifold that takes one main water pipe from the city and divides it evenly into 8 or 16 small garden hoses. Inside a tiny silica glass chip, incoming light is divided evenly among multiple output fiber strands with zero moving parts or electricity required.",
    "technical": "A passive optical branching device manufactured using silica glass photolithography. Splits input optical power uniformly across 1:4, 1:8, 1:16, 1:32, or 1:64 outputs with theoretical insertion losses governed by $10 \\log_{10}(N)$ (e.g. 1:2 = ~3.5 dB, 1:8 = ~10.5 dB, 1:64 = ~20.5 dB loss).",
    "whyItMatters": "PLC splitters allow a single feeder fiber from a central office OLT to serve an entire 64-home apartment complex or residential neighborhood without active street electronics.",
    "tags": [
      "Passive",
      "1:8 / 1:16 / 1:64",
      "Insertion Loss",
      "Silica Photolithography"
    ]
  },
  {
    "id": "poe",
    "term": "PoE",
    "full": "Power over Ethernet (802.3af / 802.3at / 802.3bt)",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Imagine mounting a security camera or Wi-Fi access point high up on a 15-meter outdoor pole. Hiring an electrician to install a high-voltage 220V electrical wall outlet up on the pole costs hundreds of dollars. With PoE, the network switch injects safe low-voltage electricity directly down the same Cat6 network cable that carries the data, powering the camera through a single cord.",
    "technical": "IEEE standards delivering 48V DC power alongside Ethernet data over twisted-pair copper cabling. 802.3af (PoE) provides up to 15.4W; 802.3at (PoE+) provides up to 30W; 802.3bt (PoE++ / 4PPoE) uses all 4 pairs to deliver up to 60W (Type 3) or 90W (Type 4) for PTZ cameras and digital signage.",
    "whyItMatters": "Simplifies enterprise deployments for VoIP phones, security cameras, and Wi-Fi access points, allowing the entire building's peripheral devices to stay online during power cuts via a central server room UPS battery.",
    "tags": [
      "802.3at",
      "802.3bt",
      "48V DC",
      "VoIP",
      "Cat6 Power"
    ]
  },
  {
    "id": "port-socket",
    "term": "Port & Socket",
    "full": "Network Port & Transport Socket Endpoint",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "If your IP address is the street address of a large corporate skyscraper, the Port Number is the internal office room number on the 4th floor. Room 80 is the Web Reception desk, Room 443 is the Encrypted Vault, and Room 22 is the Server Room backdoor. A Socket is the combination of the building address + room number (e.g. 192.168.1.10:443) representing the exact phone cord plugged into that desk.",
    "technical": "A 16-bit integer (range 0 to 65535) in the TCP/UDP header identifying which application process receives network traffic. Ports 0-1023 are Well-Known (HTTP 80, HTTPS 443, SSH 22, DNS 53); 1024-49151 are Registered; 49152-65535 are Dynamic/Ephemeral. A socket is an OS file-like abstraction defined by `{Source IP, Source Port, Destination IP, Destination Port, Protocol}`.",
    "whyItMatters": "Ports allow your computer to simultaneously run Spotify, browse 20 browser tabs, game on Steam, and download files over a single physical Wi-Fi connection without data getting mixed up.",
    "tags": [
      "Layer 4",
      "Endpoints",
      "Well-Known Ports",
      "Ephemeral",
      "Sockets"
    ]
  },
  {
    "id": "posix",
    "term": "POSIX",
    "full": "Portable Operating System Interface",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Think of POSIX like the international standard shape of electrical power plugs or shipping containers. Because all shipping containers are identical in size, a crane in Japan, Germany, or the US can load them onto any ship without redesigning the machinery. POSIX ensures that a C program or shell script written for Linux will compile and run on macOS, BSD, or Unix with minimal changes.",
    "technical": "A family of IEEE standards (IEEE 1003) specifying APIs, shell command utilities (`sh`, `awk`, `grep`), and interface conventions for software compatibility across Unix-like operating systems.",
    "whyItMatters": "Ensures software portability and vendor independence across operating systems and enterprise servers.",
    "tags": [
      "Standards",
      "IEEE",
      "Unix Compatibility",
      "Shell Portability"
    ]
  },
  {
    "id": "qos",
    "term": "QoS",
    "full": "Quality of Service",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of a highway during bumper-to-bumper rush hour. Ordinary passenger cars and delivery vans are stuck waiting in traffic. But in the emergency shoulder lane, an ambulance with sirens blaring (your live Zoom video call or VoIP phone call) is allowed to zoom past everyone with zero delay. QoS is the traffic priority system that puts VIP real-time data ahead of bulk downloads.",
    "technical": "Mechanisms that manage network resource allocation and prioritize latency-sensitive traffic during link congestion. Utilizes DSCP (Differentiated Services Code Point) in the IP header, Class of Service (CoS) in 802.1Q tags, and queuing algorithms (Priority Queuing, Weighted Fair Queuing, Police/Shape) to bound jitter, packet loss, and latency.",
    "whyItMatters": "Without QoS, a single user in an office starting a 50GB game update would cause everyone else's Microsoft Teams, Zoom calls, and VoIP desk phones to roboticize, stutter, or drop entirely.",
    "tags": [
      "DSCP",
      "Traffic Shaping",
      "Priority Queuing",
      "Jitter",
      "VoIP Priority"
    ]
  },
  {
    "id": "radius-aaa",
    "term": "RADIUS & AAA",
    "full": "Remote Authentication Dial-In User Service & Authentication, Authorization, Accounting",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "Think of going to an airport: (1) Authentication is showing your passport to prove WHO you are. (2) Authorization is checking your boarding pass to confirm WHAT seat class you are allowed to sit in (Economy vs First Class). (3) Accounting is the airline logging the exact timestamp your flight departed and how much extra luggage you paid for. RADIUS is the centralized server that handles this AAA security check for thousands of Wi-Fi routers and VPN logins.",
    "technical": "A networking client/server protocol (UDP ports 1812/1813) running AAA management. Network Access Servers (switches, VPN gateways, WPA2/WPA3-Enterprise 802.1X access points) forward client credentials to a central RADIUS server (FreeRADIUS, Cisco ISE) which queries backend identity directories (LDAP, Active Directory).",
    "whyItMatters": "Allows enterprises and universities (e.g. Eduroam) to manage Wi-Fi logins for 50,000 students and staff from a central directory: when an employee leaves the company, revoking their account in Active Directory instantly locks them out of all 200 Wi-Fi access points and VPNs.",
    "tags": [
      "802.1X",
      "WPA3-Enterprise",
      "FreeRADIUS",
      "Active Directory",
      "AAA"
    ]
  },
  {
    "id": "rest-api-webhook",
    "term": "REST API vs Webhook",
    "full": "Request-Response (Polling) vs Event-Driven (Push)",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "A REST API is like repeatedly calling a pizza restaurant on the phone every 30 seconds: 'Is my pizza ready yet? How about now? Now?'. A Webhook is ordering pizza online, writing your phone number down, and hanging up. The pizza restaurant texts you a single notification the moment the pizza comes out of the oven: 'Your pizza is ready for pickup!'. APIs pull; Webhooks push.",
    "technical": "REST APIs follow a client-driven synchronous HTTP request/response model (GET, POST, PUT, DELETE) where the client must initiate communication. Webhooks are asynchronous, server-to-server HTTP POST callbacks triggered immediately when a specific business event occurs in the provider system.",
    "whyItMatters": "Webhooks eliminate wasteful polling loops that consume bandwidth and API rate limits, allowing instant notifications for Stripe payments, GitHub git pushes, and Slack alerts.",
    "tags": [
      "HTTP POST",
      "Event-Driven",
      "Callbacks",
      "Asynchronous",
      "Polling"
    ]
  },
  {
    "id": "reverse-proxy",
    "term": "Reverse Proxy",
    "full": "Inbound Server-Side Proxy (Nginx, Envoy, Traefik)",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "A forward proxy (like corporate web filters) protects the CLIENT by hiding who is making the request. A Reverse Proxy protects the SERVER: think of it like the front desk receptionist at a corporate skyscraper. Visitors from the street are not allowed to wander through employee offices. Everyone speaks to the receptionist, who verifies their ID, strips away dangerous bags, and calls the internal extension.",
    "technical": "An intermediate server deployed in front of web applications that intercepts client requests. It handles SSL/TLS termination, HTTP response caching, gzip/brotli compression, rate limiting, and web application firewalling (WAF) before forwarding clean traffic to internal backend application servers.",
    "whyItMatters": "Backend microservices written in Python, Node, or Go don't need to implement complex SSL handshakes or DDoS protection; the reverse proxy handles encryption and security at the edge.",
    "tags": [
      "TLS Termination",
      "Nginx",
      "Caching",
      "Compression",
      "WAF",
      "Gateway"
    ]
  },
  {
    "id": "sd-wan",
    "term": "SD-WAN",
    "full": "Software-Defined Wide Area Network",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "In the old days, connecting 100 bank branches required expensive, dedicated private telecom fiber lines (MPLS) costing thousands of dollars a month. SD-WAN is like having a smart autopilot box at each branch that plugs into cheap broadband, 4G/5G mobile data, and fiber simultaneously. The autopilot constantly tests all connections and silently moves critical bank transactions to whichever line has zero packet loss.",
    "technical": "Decouples network hardware from control mechanisms using a centralized orchestrator. Creates secure virtual overlay tunnels (IPsec/WireGuard) over diverse physical underlays (Broadband, LTE, Dedicated Fiber), dynamically steering traffic per-application based on real-time jitter, loss, and latency metrics.",
    "whyItMatters": "SD-WAN cuts enterprise telecom expenses by 40-70% while improving cloud SaaS reliability and allowing central IT teams to deploy a new branch in minutes instead of waiting months for carrier telecom provisioning.",
    "tags": [
      "Overlay",
      "Underlay",
      "Centralized Controller",
      "IPsec",
      "Zero Touch"
    ]
  },
  {
    "id": "sfp-transceiver",
    "term": "SFP / SFP+ / QSFP",
    "full": "Small Form-Factor Pluggable Optical Transceiver",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Think of an SFP module like a universal game cartridge slot on a retro Nintendo console. Instead of soldering a permanent 10km fiber laser or copper cable port onto an expensive $10,000 network switch, the switch has empty rectangular slots. You snap in whatever cartridge you need for that specific port: a 50-meter copper wire, a 2km office fiber, or a 40km carrier laser. SFP+ gives 10 Gbps, and QSFP packs 4 lanes into 40/100 Gbps.",
    "technical": "Hot-swappable modular I/O transceivers converting electrical router signals into optical laser pulses (and vice-versa). Standards: SFP (1 Gbps), SFP+ (10 Gbps), SFP28 (25 Gbps), QSFP+ (4x10 = 40 Gbps), and QSFP28 (4x25 = 100 Gbps). Uses LC duplex, SC, or MPO multi-fiber connectors.",
    "whyItMatters": "Mismatched transceiver wavelengths (e.g. attempting to link an 850nm SX optic to a 1310nm LX optic) will never negotiate a physical link, leaving the port in a permanent 'down/down' state.",
    "tags": [
      "Transceiver",
      "1G / 10G / 100G",
      "LC Connector",
      "Hot-Pluggable"
    ]
  },
  {
    "id": "smf-vs-mmf",
    "term": "SMF vs MMF",
    "full": "Single-Mode Fiber (9\u00b5m) vs Multi-Mode Fiber (50\u00b5m)",
    "category": "fiber",
    "categoryLabel": "Fiber Optics & Hardware",
    "categoryColor": "#f59e0b",
    "layman": "Single-Mode Fiber is like a rifle shooting a razor-sharp laser beam straight down a long, narrow tunnel (9 microns wide\u2014thinner than a human hair); the light travels 40 to 80 kilometers without bouncing off the walls. Multi-Mode Fiber is like a wider hallway (50 microns wide) where an LED light beam bounces back and forth against the mirrors like a pinball; it is cheaper to build, but the bouncing causes the light pulses to blur out after just 300 to 500 meters.",
    "technical": "SMF (OS1/OS2, yellow jacket) has an ultra-narrow core (~9\u00b5m) transmitting a single transverse optical mode via 1310nm/1550nm lasers, eliminating modal dispersion. MMF (OM1/OM2/OM3/OM4, aqua/magenta jacket) has a 50\u00b5m or 62.5\u00b5m core transmitting multiple light modes via 850nm VCSELs, limited by modal dispersion to short datacenter runs.",
    "whyItMatters": "Plugging a Multi-Mode fiber patch cord into a long-distance Single-Mode SFP transceiver causes severe optical mismatch, massive attenuation loss (20dB+), and completely drops the link.",
    "tags": [
      "9 Micron",
      "50 Micron",
      "Modal Dispersion",
      "OS2 vs OM4",
      "Cores"
    ]
  },
  {
    "id": "ssh-keys",
    "term": "SSH & Asymmetric Keys",
    "full": "Secure Shell & Public/Private Key Cryptography",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Instead of using a typed password that someone could peek at over your shoulder, think of SSH Keys like an unbreakable padlock and a physical key. You take copies of the padlock (your Public Key) and install them on every server door you own. You keep the physical metal key (your Private Key) locked in your pocket and never give it to anyone. When you knock on the server door, the padlock checks your private key and opens instantly without asking for a password.",
    "technical": "An encrypted network protocol (TCP port 22) for remote command-line login. Key-based authentication relies on asymmetric mathematics (RSA, Ed25519). The client proves possession of the private key by signing a challenge message issued by the server, which validates it against `~/.ssh/authorized_keys`.",
    "whyItMatters": "Disabling password login and enforcing Ed25519 SSH keys completely eliminates 99.9% of automated Internet brute-force dictionary attacks against servers.",
    "tags": [
      "TCP 22",
      "Ed25519",
      "Public Key",
      "authorized_keys",
      "Remote Access"
    ]
  },
  {
    "id": "stp",
    "term": "STP",
    "full": "Spanning Tree Protocol (IEEE 802.1D / 802.1w RSTP)",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Imagine connecting three network switches together in a triangle using three cables to provide a backup path in case one cable snaps. Because Ethernet switches blindly broadcast unknown messages out of every port, an endless storm of packets would swirl around the triangle in microseconds, overwhelming the switches until they smoke. STP is the referee that automatically turns OFF one cable, keeping it in standby until another cable is cut.",
    "technical": "A Layer 2 link-management protocol that prevents bridge loops by exchanging Bridge Protocol Data Units (BPDUs), electing a Root Bridge, and placing redundant switch ports into a Blocking/Discarding state, maintaining a loop-free logical tree topology. Modern RSTP (802.1w) achieves sub-second convergence.",
    "whyItMatters": "A single accidental loop created by a user plugging both ends of an Ethernet cable into two wall jacks can bring down an entire enterprise hospital or university network within 5 seconds without STP.",
    "tags": [
      "Layer 2",
      "Loop Prevention",
      "BPDU",
      "RSTP",
      "Root Bridge"
    ]
  },
  {
    "id": "subnet-mask-cidr",
    "term": "Subnet Mask & CIDR",
    "full": "Classless Inter-Domain Routing & Masking",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Think of a phone number like +977-1-4200000. The '+977-1' part tells the telephone exchange which country and city the call belongs to (the Network portion), and '4200000' is the specific house phone (the Host portion). A subnet mask is the divider line that tells the computer: 'Everything to the left is the neighborhood name; everything to the right is the specific house door.'",
    "technical": "A 32-bit bitmask dividing an IP into Network bits (1s) and Host bits (0s). Expressed in dotted decimal (255.255.255.0) or CIDR notation (/24, representing twenty-four leading 1s). It determines whether a destination IP is inside the local LAN or must be forwarded to the Default Gateway.",
    "whyItMatters": "Calculating subnet masks correctly prevents massive broadcast storms, ensures efficient IP address conservation, and avoids overlapping network conflicts that disconnect branch offices.",
    "tags": [
      "CIDR",
      "Bitmask",
      "Slash Notation",
      "Host Capacity",
      "Network ID"
    ]
  },
  {
    "id": "swap-paging",
    "term": "Swap Space & Paging",
    "full": "Virtual Memory Disk Overflow & Page Swapping",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Think of physical RAM like your physical desk surface where you do your active work. If your desk gets completely covered in papers and you need to open a new book, you scoop up the papers you haven't touched in an hour and stash them in the desk drawer below (the hard drive Swap space). When you need them again, you pull them back onto the desk. Moving papers takes a few seconds, but your desk never overflows.",
    "technical": "A designated partition or swapfile on secondary storage (NVMe/SSD/HDD) used by virtual memory management. Inactive physical 4KB memory pages are paged out to disk via kernel algorithms governed by the `vm.swappiness` parameter, freeing high-speed physical RAM for active CPU workloads and file system caches.",
    "whyItMatters": "While Swap prevents instant OOM crashes, excessive swapping (called 'Thrashing') slows a server down to a crawl because disks are 1,000x slower than RAM.",
    "tags": [
      "Virtual Memory",
      "vm.swappiness",
      "Paging",
      "Thrashing",
      "RAM Overflow"
    ]
  },
  {
    "id": "syscall",
    "term": "Syscall",
    "full": "System Call (read, write, open, socket, fork)",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Imagine ordering food at a restaurant. You are not allowed to march into the kitchen, grab raw meat, and light the commercial stove yourself. Instead, you call the waiter, point to the menu, and place a formal request. A Syscall is that formal request slip an application hands to the operating system kernel when it needs to read a file, send network data, or allocate memory.",
    "technical": "The programmatic interface through which a user space program requests a service from the kernel. Triggers a CPU context switch via software interrupt or dedicated instructions (`syscall` on x86_64). Common Linux syscalls include `sys_read()`, `sys_write()`, `sys_open()`, `sys_fork()`, and `sys_socket()`.",
    "whyItMatters": "Tools like `strace` allow systems engineers to monitor every single syscall made by a misbehaving binary, revealing exactly why a program is failing (e.g. searching for a missing config file or blocked network port).",
    "tags": [
      "Kernel Boundary",
      "strace",
      "Context Switch",
      "POSIX",
      "x86_64"
    ]
  },
  {
    "id": "tcp-udp",
    "term": "TCP vs UDP",
    "full": "Transmission Control Protocol vs User Datagram Protocol",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "TCP is like sending a Registered Legal Letter via Courier: you require a signed delivery receipt, if a page is dropped the courier goes back and fetches it, and every page is numbered in exact order. UDP is like throwing a Frisbee or shouting through a megaphone: you launch it into the air as fast as possible; if someone blinks and misses it, you don't stop the game to re-throw it.",
    "technical": "TCP is connection-oriented, stateful, and guarantees delivery and in-order sequencing using a 3-Way Handshake (SYN, SYN-ACK, ACK), sliding windows, and retransmissions. UDP is connectionless, stateless, and has zero handshake overhead (8-byte header vs 20-60 bytes in TCP), making it ideal for live VoIP, gaming, DNS, and video streaming.",
    "whyItMatters": "Choosing the wrong transport kills performance: using TCP for real-time video games creates lag spikes during packet loss, while using UDP for bank transfers or file downloads would cause corrupted, missing data.",
    "tags": [
      "Transport",
      "Layer 4",
      "3-Way Handshake",
      "SYN/ACK",
      "Low Latency"
    ]
  },
  {
    "id": "tls-ssl",
    "term": "TLS / SSL",
    "full": "Transport Layer Security (TLS 1.2 & TLS 1.3)",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "Imagine writing a secret note to a friend, locking it inside a heavy steel lockbox, handing the locked box to a total stranger on the street, and having them carry it across town. Even if the stranger (or a spy at a coffee shop Wi-Fi) peeks at the box, they can only see cold steel. Only your friend has the matching key to open it. That is TLS: encrypting every password and credit card number passing across the Internet.",
    "technical": "Cryptographic protocol providing data confidentiality, integrity, and server authentication over TCP port 443. Modern TLS 1.3 optimizes the connection handshake down to a single round-trip (1-RTT) using Diffie-Hellman ephemeral key exchanges and authenticated symmetric encryption (AES-GCM, ChaCha20-Poly1305).",
    "whyItMatters": "Without TLS/HTTPS, anyone sitting on the same coffee shop Wi-Fi or rogue ISP router could read your plain-text passwords and banking data in real-time with packet sniffers like Wireshark.",
    "tags": [
      "HTTPS",
      "Encryption",
      "Certificates",
      "TLS 1.3",
      "Diffie-Hellman"
    ]
  },
  {
    "id": "ttl-hop-limit",
    "term": "TTL / Hop Limit",
    "full": "Time to Live (IPv4) & Hop Limit (IPv6)",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Imagine giving an envelope to a messenger with a stamp that says '64'. Every time the messenger passes through a city checkpoint, the guard scratches out the number and writes '63', then '62', down to '0'. If the number hits zero before finding the recipient, the guard shreds the envelope. This prevents a lost letter from wandering between two confused cities forever in an infinite loop.",
    "technical": "An 8-bit field in the IPv4 header (Hop Limit in IPv6) initialized by the sending OS (typically 64 in Linux, 128 in Windows) and decremented by 1 at every Layer 3 router hop. When it decrements to 0, the router drops the packet and transmits an ICMP Type 11 (Time to Live exceeded in transit) back to the sender.",
    "whyItMatters": "Without TTL, a single routing loop between two misconfigured routers would cause millions of packets to circulate endlessly, consuming 100% of link bandwidth until the routers freeze or crash.",
    "tags": [
      "Loop Prevention",
      "IPv4 TTL",
      "IPv6 Hop Limit",
      "Traceroute"
    ]
  },
  {
    "id": "unicast-multicast-broadcast",
    "term": "Unicast vs Multicast vs Broadcast",
    "full": "Network Transmission Paradigms",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Unicast is a private phone call between two people (1-to-1). Broadcast is shouting through a giant megaphone in a crowded cafeteria so every single person is forced to listen whether they care or not (1-to-All). Multicast is a private radio frequency or podcast subscription: only the people who tuned in receive the music (1-to-Many).",
    "technical": "Unicast delivers packets to a single destination host interface. Broadcast (IPv4 255.255.255.255, MAC FF:FF:FF:FF:FF:FF) sends frames to every host on a Layer 2 domain (removed in IPv6). Multicast (IPv4 224.0.0.0/4, IPv6 ff00::/8) delivers a single stream to subscribed group members via IGMP/MLD and PIM routing.",
    "whyItMatters": "IPTV television channels in fiber networks use multicast. Without multicast, an ISP streaming the World Cup to 100,000 subscribers would have to transmit 100,000 separate video streams, destroying their backbone bandwidth.",
    "tags": [
      "Transmission",
      "1-to-1",
      "1-to-Many",
      "1-to-All",
      "IGMP",
      "IPTV"
    ]
  },
  {
    "id": "user-vs-kernel-space",
    "term": "User Space vs Kernel Space",
    "full": "Privileged Execution Rings (Ring 3 vs Ring 0)",
    "category": "systems",
    "categoryLabel": "Systems & Linux OS",
    "categoryColor": "#10b981",
    "layman": "Kernel Space is the sterile, locked bank vault where the bank manager operates the heavy machinery (Ring 0). User Space is the bank lobby where customers fill out deposit slips (Ring 3). If a customer drops their coffee in the lobby (app crash), the bank vault remains 100% secure and untouched. To deposit money, the customer must walk to the teller window and request service.",
    "technical": "CPU hardware execution modes enforcing memory isolation. User Space (Ring 3) is unprivileged; applications execute with virtualized memory and cannot directly execute I/O or manipulate memory mapped to other processes. Kernel Space (Ring 0) executes privileged CPU instructions with raw access to physical memory and hardware registers.",
    "whyItMatters": "This boundary protects modern operating systems: even if a malicious script or bugged web browser tries to corrupt memory, the CPU's memory management unit intercepts it and terminates only that process with a segmentation fault.",
    "tags": [
      "Ring 0",
      "Ring 3",
      "Isolation",
      "Segfault",
      "Memory Protection"
    ]
  },
  {
    "id": "vip-vrrp",
    "term": "VIP / VRRP / CARP",
    "full": "Virtual IP & Virtual Router Redundancy Protocol",
    "category": "cloud",
    "categoryLabel": "Cloud & Architecture",
    "categoryColor": "#38bdf8",
    "layman": "Imagine two doctors sharing one emergency phone number. Doctor A keeps the phone in their pocket while Doctor B sleeps. Every 1 second, Doctor A sends a silent text message to Doctor B: 'I am alive!'. If Doctor A faints or runs out of battery, Doctor B notices the missing text message within 3 seconds, grabs a backup phone, takes over the exact same emergency phone number, and answers incoming calls without patients having to dial a different number.",
    "technical": "A floating IP address shared between two or more redundant servers. VRRP (RFC 5798, protocol 112) or CARP sends periodic multicasts between a Master and Backup node. If the Master fails to send heartbeats within the Dead Interval (typically 3 seconds), the Backup issues a Gratuitous ARP to claim the Virtual MAC address and takes over the VIP.",
    "whyItMatters": "Default gateways and firewall clusters rely on VIPs (Keepalived / pfSense CARP) so an entire office of 1,000 employees keeps browsing the web uninterrupted if the primary firewall hardware is rebooted.",
    "tags": [
      "Floating IP",
      "Keepalived",
      "Gratuitous ARP",
      "Failover",
      "CARP"
    ]
  },
  {
    "id": "vlan-8021q",
    "term": "VLAN & 802.1Q",
    "full": "Virtual Local Area Network & IEEE 802.1Q Tagging",
    "category": "networking",
    "categoryLabel": "Networking & Protocols",
    "categoryColor": "#06b6d4",
    "layman": "Imagine two completely different college classrooms sharing the same big auditorium, but students in Class A wear blue headsets and students in Class B wear red headsets. Even though they sit on the same chairs and walk down the same corridor, students in Class A can never hear or snoop on Class B. That's a VLAN: slicing one physical switch into multiple isolated virtual networks.",
    "technical": "Logically isolates Layer 2 broadcast domains on physical Ethernet switches. IEEE 802.1Q inserts a 4-byte tag into the Ethernet frame header containing a 12-bit VLAN Identifier (VID, values 1 to 4094) allowing trunk links to carry dozens of isolated networks across a single physical fiber or copper cable.",
    "whyItMatters": "VLANs prevent security breaches (e.g. keeping untrusted guest Wi-Fi and IoT smart bulbs isolated from sensitive corporate databases) and stop broadcast storms from choking network switches.",
    "tags": [
      "Layer 2",
      "Trunking",
      "802.1Q",
      "Tagging",
      "Isolation"
    ]
  },
  {
    "id": "vpn",
    "term": "VPN",
    "full": "Virtual Private Network (IPsec, OpenVPN, WireGuard)",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "Imagine having to walk through a dangerous, crowded public market to deliver sensitive company files. Instead of walking exposed on the open sidewalk, a company digs a private underground concrete tunnel directly from your living room into the corporate office basement. Even though the tunnel passes underneath the public street, people above cannot see you or touch your papers. That is a VPN.",
    "technical": "An encrypted network overlay established across an untrusted public network. It encapsulates and encrypts payload packets inside an outer transport packet (tunnel mode) using cryptographic suites (IPsec IKEv2, WireGuard, OpenVPN), assigning the client an internal private IP within the remote network.",
    "whyItMatters": "Allows remote employees working from home to securely access internal company servers, printers, and source code repositories without exposing those servers directly to the public Internet.",
    "tags": [
      "WireGuard",
      "IPsec",
      "Tunneling",
      "Remote Work",
      "Encryption"
    ]
  },
  {
    "id": "zero-trust",
    "term": "Zero-Trust",
    "full": "Zero-Trust Network Architecture (ZTNA)",
    "category": "security",
    "categoryLabel": "Security & Access",
    "categoryColor": "#f43f5e",
    "layman": "In the old security model (Castle-and-Moat), once a worker crossed the drawbridge and entered the castle walls, everyone assumed they were trustworthy and let them enter every room. If a spy snuck past the moat, they had free run of the castle! In Zero-Trust, there is NO castle and no moat: every single room door has a fingerprint scanner and facial recognition, and guards inspect your badge continuously at every step.",
    "technical": "A cybersecurity paradigm based on the principle 'Never Trust, Always Verify'. Eliminates implicit trust based on network location (LAN vs Internet). Requires strict identity authentication, device posture verification, least-privilege microsegmentation, and continuous authorization for every transaction.",
    "whyItMatters": "If a hacker compromises a single marketing laptop via a phishing email, Zero-Trust prevents the hacker from moving laterally across the network to steal database backups or domain controller credentials.",
    "tags": [
      "ZTNA",
      "Least Privilege",
      "Microsegmentation",
      "Identity-First",
      "BeyondCorp"
    ]
  }
];

(function() {
  'use strict';

  let currentCategory = 'all';
  let currentLetter = 'all';
  let searchQuery = '';

  // DOM Elements cache
  let gridContainer = null;
  let searchInput = null;
  let clearSearchBtn = null;
  let countIndicator = null;
  let emptyState = null;
  let alphabetBar = null;

  function initLexicon() {
    gridContainer = document.getElementById('lexicon-grid');
    if (!gridContainer) return; // Not on a page with lexicon grid

    searchInput = document.getElementById('lexicon-search-input');
    clearSearchBtn = document.getElementById('lexicon-clear-search');
    countIndicator = document.getElementById('lexicon-count-indicator');
    emptyState = document.getElementById('lexicon-empty-state');
    alphabetBar = document.getElementById('lexicon-alphabet-bar');

    setupCategoryFilters();
    setupAlphabetBar();
    setupSearchListeners();
    renderCards();
    checkHashPermalink();

    window.addEventListener('hashchange', checkHashPermalink);
  }

  function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.lexicon-cat-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderCards();
      });
    });
  }

  function setupAlphabetBar() {
    if (!alphabetBar) return;
    
    // Compute available first letters
    const letters = new Set();
    LEXICON_DATA.forEach(t => {
      const firstChar = t.term.charAt(0).toUpperCase();
      if (firstChar >= 'A' && firstChar <= 'Z') {
        letters.add(firstChar);
      }
    });

    let html = `<button type="button" class="alphabet-jump-btn active" data-letter="all">ALL</button>`;
    for (let c = 65; c <= 90; c++) {
      const letter = String.fromCharCode(c);
      const isAvailable = letters.has(letter);
      html += `<button type="button" class="alphabet-jump-btn ${isAvailable ? '' : 'disabled'}" data-letter="${letter}" ${isAvailable ? '' : 'disabled'}>${letter}</button>`;
    }
    alphabetBar.innerHTML = html;

    alphabetBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.alphabet-jump-btn');
      if (!btn || btn.classList.contains('disabled')) return;
      
      alphabetBar.querySelectorAll('.alphabet-jump-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLetter = btn.getAttribute('data-letter');
      renderCards();
    });
  }

  function setupSearchListeners() {
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchQuery.length > 0 ? 'inline-flex' : 'none';
        }
        renderCards();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          clearSearchBtn.style.display = 'none';
          searchInput.focus();
          renderCards();
        }
      });
    }

    const resetBtn = document.getElementById('lexicon-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }
  }

  function resetAllFilters() {
    currentCategory = 'all';
    currentLetter = 'all';
    searchQuery = '';
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';

    document.querySelectorAll('.lexicon-cat-btn').forEach(b => {
      if (b.getAttribute('data-category') === 'all') b.classList.add('active');
      else b.classList.remove('active');
    });

    if (alphabetBar) {
      alphabetBar.querySelectorAll('.alphabet-jump-btn').forEach(b => {
        if (b.getAttribute('data-letter') === 'all') b.classList.add('active');
        else b.classList.remove('active');
      });
    }

    renderCards();
  }

  function getFilteredTerms() {
    return LEXICON_DATA.filter(item => {
      // Category match
      if (currentCategory !== 'all' && item.category !== currentCategory) {
        return false;
      }

      // Alphabet match
      if (currentLetter !== 'all') {
        const first = item.term.charAt(0).toUpperCase();
        if (first !== currentLetter) return false;
      }

      // Search query match
      if (searchQuery) {
        const inTerm = item.term.toLowerCase().includes(searchQuery);
        const inFull = item.full.toLowerCase().includes(searchQuery);
        const inLayman = item.layman.toLowerCase().includes(searchQuery);
        const inTech = item.technical.toLowerCase().includes(searchQuery);
        const inWhy = item.whyItMatters.toLowerCase().includes(searchQuery);
        const inTags = item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery));
        if (!inTerm && !inFull && !inLayman && !inTech && !inWhy && !inTags) {
          return false;
        }
      }

      return true;
    });
  }

  function renderCards() {
    if (!gridContainer) return;

    const filtered = getFilteredTerms();

    // Update count indicator
    if (countIndicator) {
      const total = LEXICON_DATA.length;
      if (filtered.length === total) {
        countIndicator.textContent = `Showing all ${total} technical terms`;
      } else {
        countIndicator.textContent = `Showing ${filtered.length} of ${total} technical terms`;
      }
    }

    // Handle Empty State
    if (filtered.length === 0) {
      gridContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    // Build Cards HTML
    const cardsHtml = filtered.map(item => {
      const categoryIcon = getCategoryIcon(item.category);
      const categoryBorderColor = item.categoryColor || 'var(--accent-secondary)';

      return `
      <article id="term-${item.id}" class="card lexicon-card" style="border-top: 3px solid ${categoryBorderColor};">
        <div class="lexicon-card-header">
          <div class="lexicon-term-group">
            <span class="lexicon-term-badge">${escapeHtml(item.term)}</span>
            <h3 class="lexicon-term-full">${escapeHtml(item.full)}</h3>
          </div>
          <div class="lexicon-card-actions">
            <span class="tag" style="background: rgba(255, 255, 255, 0.05); color: ${categoryBorderColor}; border-color: ${categoryBorderColor}40; font-size: 0.72rem;">
              ${categoryIcon} ${escapeHtml(item.categoryLabel)}
            </span>
            <button type="button" class="lexicon-anchor-btn" data-anchor="term-${item.id}" title="Copy direct link to this term" aria-label="Copy permalink to ${item.term}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- The Layman / Beginner Analogy Callout -->
        <div class="lexicon-layman-box">
          <div class="lexicon-box-title">
            <span class="lexicon-bulb-icon">💡</span>
            <strong>In Plain English (The 10-Second Layman Analogy):</strong>
          </div>
          <p class="lexicon-layman-text">${escapeHtml(item.layman)}</p>
        </div>

        <!-- The Precise Engineering Breakdown -->
        <div class="lexicon-technical-box">
          <div class="lexicon-box-title">
            <span class="lexicon-gear-icon">⚙️</span>
            <strong>How It Works Technically:</strong>
          </div>
          <p class="lexicon-tech-text">${escapeHtml(item.technical)}</p>
        </div>

        <!-- Why It Matters / Field Gotcha -->
        <div class="lexicon-field-impact">
          <div class="lexicon-box-title">
            <span class="lexicon-target-icon">🎯</span>
            <strong>Why It Matters in the Field:</strong>
          </div>
          <p class="lexicon-impact-text">${escapeHtml(item.whyItMatters)}</p>
        </div>

        <!-- Tags footer -->
        ${item.tags && item.tags.length ? `
        <div class="lexicon-tags-footer">
          ${item.tags.map(tag => `<span class="lexicon-mini-tag">#${escapeHtml(tag)}</span>`).join('')}
        </div>
        ` : ''}
      </article>
      `;
    }).join('');

    gridContainer.innerHTML = cardsHtml;
    attachCardListeners();
  }

  function getCategoryIcon(cat) {
    switch (cat) {
      case 'networking': return '🌐';
      case 'systems': return '🐧';
      case 'fiber': return '⚡';
      case 'cloud': return '☁️';
      case 'security': return '🛡️';
      default: return '◈';
    }
  }

  function attachCardListeners() {
    const copyBtns = gridContainer.querySelectorAll('.lexicon-anchor-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const anchor = btn.getAttribute('data-anchor');
        const url = window.location.origin + window.location.pathname + '#' + anchor;
        
        navigator.clipboard.writeText(url).then(() => {
          const originalSvg = btn.innerHTML;
          btn.innerHTML = `<span style="font-size: 0.7rem; font-weight: 700; color: #10b981;">✓ COPIED</span>`;
          setTimeout(() => {
            btn.innerHTML = originalSvg;
          }, 1800);
        }).catch(() => {
          window.location.hash = anchor;
        });
      });
    });
  }

  function checkHashPermalink() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#term-')) {
      const targetCard = document.querySelector(hash);
      if (targetCard) {
        // Reset category or search if target card is hidden
        const termId = hash.replace('#term-', '');
        const exists = LEXICON_DATA.find(t => t.id === termId);
        if (exists && currentCategory !== 'all' && exists.category !== currentCategory) {
          resetAllFilters();
        }
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('lexicon-card-highlight');
            setTimeout(() => {
              el.classList.remove('lexicon-card-highlight');
            }, 2500);
          }
        }, 200);
      }
    }
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

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLexicon);
  } else {
    initLexicon();
  }
})();
