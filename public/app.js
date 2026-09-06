/**
 * PUMO TECHNOVATION SHOWCASE - APPLICATION CONTROLLER & ADMIN PANEL
 * Handles Pumo Technovation branding, Dark/Light mode theme switching,
 * Passcode Authentication, Real-time Cross-System Sync, Student Statistics,
 * Horizontal Progress Bars, 100% Circle Gauges, Dynamic Tab Galleries,
 * Split Lightbox with Individual Photo Info, Skills/Company/Course panels,
 * Photo Hide/View Visibility controls, Static Admin Tabs Navigation,
 * Public Course Curriculum & Syllabus Viewer Tab,
 * and MS Word Style Rich Document Editor (Headings, Paragraphs, Images, Tables, Callouts).
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DARK / LIGHT MODE THEME SYSTEM ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    let currentTheme = localStorage.getItem('pumo_theme') || 'dark';
    applyTheme(currentTheme);

    function applyTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pumo_theme', theme);
        if (theme === 'light') {
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeLabel) themeLabel.textContent = 'Light';
        } else {
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeLabel) themeLabel.textContent = 'Dark';
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            playClickSound(950, 0.08, 'sine');
            applyTheme(nextTheme);
        });
    }

    // --- 2. PASSCODE SECURITY SYSTEM ---
    let adminPasscode = localStorage.getItem('pumo_admin_passcode') || '1234';
    let isAdminAuthenticated = false;
    let globalShowOfferLetter = localStorage.getItem('pumo_show_offer_letter') !== 'false';

    const passcodeModal = document.getElementById('passcode-modal');
    const passcodeCard = document.getElementById('passcode-card');
    const passcodeForm = document.getElementById('passcode-form');
    const passcodeInput = document.getElementById('passcode-input');
    const passcodeErrorMsg = document.getElementById('passcode-error-msg');
    const submitPasscodeBtn = document.getElementById('submit-passcode-btn');
    const closePasscodeBtn = document.getElementById('close-passcode-btn');
    const lockAdminBtn = document.getElementById('lock-admin-btn');
    const changePasscodeSubmitBtn = document.getElementById('change-passcode-submit-btn');

    function openPasscodeModal(pushState = true) {
        playClickSound(700, 0.08);
        passcodeModal.classList.add('active');
        passcodeInput.value = '';
        passcodeErrorMsg.textContent = '';
        setTimeout(() => passcodeInput.focus(), 150);
        if (pushState) history.pushState({ modal: 'passcode' }, '');
    }

    function closePasscodeModal(syncHistory = true) {
        passcodeModal.classList.remove('active');
        passcodeInput.value = '';
        passcodeErrorMsg.textContent = '';
        if (syncHistory && history.state && history.state.modal === 'passcode') history.back();
    }

    if (closePasscodeBtn) closePasscodeBtn.addEventListener('click', () => closePasscodeModal(true));
    if (passcodeModal) passcodeModal.addEventListener('click', (e) => { if (e.target === passcodeModal) closePasscodeModal(true); });

    function handlePasscodeSubmit() {
        const entered = passcodeInput.value.trim();
        if (entered === adminPasscode) {
            isAdminAuthenticated = true;
            playClickSound(1200, 0.12, 'sine');
            closePasscodeModal(false);
            history.replaceState({ modal: 'admin' }, '');
            openAdminModal(false);
        } else {
            playClickSound(250, 0.15, 'sawtooth');
            passcodeErrorMsg.textContent = '❌ Incorrect passcode! Try again.';
            if (passcodeCard) {
                passcodeCard.classList.remove('shake');
                void passcodeCard.offsetWidth;
                passcodeCard.classList.add('shake');
            }
            passcodeInput.value = '';
            passcodeInput.focus();
        }
    }

    if (submitPasscodeBtn) submitPasscodeBtn.addEventListener('click', handlePasscodeSubmit);
    if (passcodeForm) passcodeForm.addEventListener('submit', handlePasscodeSubmit);

    if (lockAdminBtn) {
        lockAdminBtn.addEventListener('click', () => {
            isAdminAuthenticated = false;
            playClickSound(400, 0.08);
            closeAdminModal(true);
            alert('🔒 Admin Panel locked.');
        });
    }

    if (changePasscodeSubmitBtn) {
        changePasscodeSubmitBtn.addEventListener('click', () => {
            const curr = document.getElementById('curr-passcode-input').value.trim();
            const newP = document.getElementById('new-passcode-input').value.trim();
            const confP = document.getElementById('confirm-passcode-input').value.trim();
            if (curr !== adminPasscode) { alert('❌ Current passcode is incorrect!'); return; }
            if (!newP) { alert('❌ Please enter a new passcode!'); return; }
            if (newP !== confP) { alert('❌ New passcode and confirmation do not match!'); return; }
            adminPasscode = newP;
            localStorage.setItem('pumo_admin_passcode', newP);
            playClickSound(1300, 0.12);
            document.getElementById('curr-passcode-input').value = '';
            document.getElementById('new-passcode-input').value = '';
            document.getElementById('confirm-passcode-input').value = '';
            alert('🔑 Admin Passcode successfully updated!');
        });
    }

    const globalOfferLetterToggle = document.getElementById('global-offer-letter-toggle');
    if (globalOfferLetterToggle) {
        globalOfferLetterToggle.checked = globalShowOfferLetter;
        globalOfferLetterToggle.addEventListener('change', (e) => {
            globalShowOfferLetter = e.target.checked;
            localStorage.setItem('pumo_show_offer_letter', globalShowOfferLetter);
            playClickSound(800, 0.08);
            if (document.getElementById('lightbox-modal') && document.getElementById('lightbox-modal').classList.contains('active')) {
                renderLightboxRightPanel();
            }
        });
    }

    // --- 3. DEFAULT PUMO TECHNOVATION TAB DATA ---
    const defaultTabData = {
        "embedded": {
            "id": "embedded",
            "title": "Embedded Systems",
            "tagline": "Hardware Architecture & Firmware Campus",
            "desc": "Microcontrollers, RTOS firmware development, IoT sensors, and ARM Cortex hardware abstraction at Pumo Technovation.",
            "tag": "Hardware & Firmware",
            "color": "cyan",
            "icon": "⚡",
            "totalStudents": 120,
            "ongoingStudents": 35,
            "placedStudents": 85,
            "skills": ["Embedded C", "RTOS", "ARM Cortex", "IoT Sensors", "PCB Design", "UART/SPI/I2C", "Microcontrollers", "FreeRTOS", "FPGA", "Keil MDK"],
            "courseTopic": "Embedded Systems, Firmware & IoT Architecture",
            "courseTopics": ["Microcontrollers", "FreeRTOS", "IoT Protocols", "PCB Design", "FPGA", "AUTOSAR CAN-FD"],
            "courseOverview": "The Masters in PCB course at Pumo Technovation provides comprehensive training in printed circuit board design and hardware development. Students learn schematic design, circuit designing, PCB layout, component selection, multilayer PCB design, routing, and PCB designing using Altium Designer. The course covers PCB design principles, signal integrity, power management, sensor integration, and electronic components. Advanced modules include high-speed PCB design, impedance-controlled routing, automotive PCB development, design for manufacturing (DFM), PCB testing, and hardware debugging.",
            "fullCourseContent": `<h2>⚡ Embedded Systems, Firmware &amp; IoT Architecture</h2>
<p class="lead">A rigorous, industry-grade training program bridging bare-metal hardware engineering, deterministic real-time firmware, and scalable IoT cloud deployments.</p>

<div class="callout-box">
  <h4>🎯 Program Objective &amp; Career Scope</h4>
  <p>To produce high-caliber embedded systems engineers proficient in 32-bit ARM Cortex architecture, FreeRTOS deterministic scheduling, high-speed PCB design, automotive communication buses (CAN-FD, LIN), and IoT telemetry architectures. Targeted roles include Firmware Engineer, Embedded Linux Developer, IoT Systems Architect, and Automotive ECU Specialist.</p>
</div>

<h3>📋 Comprehensive Syllabus &amp; Curriculum Breakdown</h3>
<table class="syllabus-table">
  <thead>
    <tr>
      <th>Module</th>
      <th>Key Topics Covered</th>
      <th>Hands-on Lab Exercises &amp; Tools</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Module 1: Embedded C &amp; Data Structures</strong></td>
      <td>Bitwise operations, memory-mapped I/O, pointers, circular buffers, stack vs heap, finite state machines (FSM), MISRA-C standards.</td>
      <td>Bare-metal peripheral drivers, interrupt service routines (ISR), GCC / Keil MDK.</td>
    </tr>
    <tr>
      <td><strong>Module 2: Microcontroller Architectures</strong></td>
      <td>8051, AVR ATmega, ARM Cortex-M0/M4/M7, clock trees, NVIC nested vector interrupts, DMA controllers, low-power sleep modes.</td>
      <td>STM32 Nucleo &amp; NXP LPC development boards, J-Link debugging, logic analyzers.</td>
    </tr>
    <tr>
      <td><strong>Module 3: Real-Time Operating Systems (RTOS)</strong></td>
      <td>FreeRTOS kernel, preemptive task scheduling, semaphores, mutexes with priority inheritance, message queues, event groups.</td>
      <td>Multi-tasking sensor hub with deterministic latency control and deadline scheduling.</td>
    </tr>
    <tr>
      <td><strong>Module 4: Industrial Protocols</strong></td>
      <td>UART, SPI, I2C, CAN 2.0B, CAN-FD, RS-485, USB device classes, and automotive diagnostic standards.</td>
      <td>Mixed-signal oscilloscopes, Saleae logic analyzer decoding, CAN-FD bus analyzers.</td>
    </tr>
    <tr>
      <td><strong>Module 5: IoT &amp; Cloud Telemetry</strong></td>
      <td>ESP32 Wi-Fi/BLE, MQTT / HTTPS protocols, AWS IoT Core integration, JSON parsing, Over-The-Air (OTA) firmware updates.</td>
      <td>Edge-to-cloud smart energy monitoring station with live telemetry dashboard.</td>
    </tr>
    <tr>
      <td><strong>Module 6: PCB Design &amp; Hardware</strong></td>
      <td>Altium Designer / KiCad, schematic capture, multi-layer routing, decoupling strategies, EMI/EMC compliance, SMD soldering.</td>
      <td>Fabrication of custom 4-layer microcontroller development board with SMD assembly.</td>
    </tr>
  </tbody>
</table>

<h3>🔬 Advanced Hardware Lab Facilities</h3>
<p>Students have full access to dedicated workstations equipped with 100MHz 4-channel mixed-signal oscilloscopes, 16-channel logic analyzers, variable DC regulated power supplies, hot-air SMD rework stations, and FPGA development kits.</p>

<div class="callout-box info">
  <h4>💼 Placement &amp; Hiring Partners</h4>
  <p>Graduates from Pumo Technovation's Embedded Systems track have been recruited by global technology leaders including <strong>Robert Bosch, Qualcomm, Texas Instruments, STMicroelectronics, Tata Elxsi, and NXP Semiconductors</strong>.</p>
</div>`,
            "companyLogos": [
                { "name": "Robert Bosch", "logo": "" },
                { "name": "Tata Elxsi", "logo": "" },
                { "name": "Qualcomm", "logo": "" },
                { "name": "Texas Instruments", "logo": "" },
                { "name": "STMicroelectronics", "logo": "" },
                { "name": "NXP Semiconductors", "logo": "" }
            ],
            "lightboxSettings": { "showSkills": true, "showCompanyBox": true, "showCourseTab": true, "bgImage": "" },
            "images": [

                { "id": "img-emb-1", "url": "assets/Embedded/embedded_1.png", "title": "PCB Design Engineer", "description": "Designing and developing multilayer PCB layouts for embedded hardware systems, including schematic capture, component placement, routing, and design validation.", "skills": ["PCB Design", "KiCad/Altium", "Schematic Design", "PCB Layout"], "company": "Lincstech", "hidden": false },

                { "id": "img-emb-2", "url": "assets/Embedded/embedded_2.png", "title": "PCB Design Engineer", "description": "Developing high-performance PCB designs for microcontroller-based systems with proper component placement, routing, grounding, and signal integrity considerations.", "skills": ["PCB Layout", "Microcontrollers", "Signal Integrity", "Circuit Design"], "company": "HCL", "hidden": false },

                { "id": "img-emb-3", "url": "assets/Embedded/embedded_3.png", "title": "Graduate Engineer Trainee", "description": "Supporting embedded hardware and firmware development activities including circuit testing, microcontroller programming, debugging, and product validation.", "skills": ["Embedded C", "Microcontrollers", "Hardware Testing", "Firmware Debugging"], "company": "Mahindra", "hidden": false },

                { "id": "img-emb-4", "url": "assets/Embedded/embedded_4.png", "title": "Graduate Engineer Trainee", "description": "Assisting in PCB development and prototype testing by performing component verification, soldering, hardware testing, and troubleshooting of electronic circuits.", "skills": ["PCB Design", "Circuit Testing", "Soldering", "Hardware Troubleshooting"], "company": "TVS Eurogrip", "hidden": false },

                { "id": "img-emb-5", "url": "assets/Embedded/embedded_5.png", "title": "PCB Design Engineer", "description": "Designing reliable embedded hardware circuits with focus on power management, communication interfaces, component selection, and PCB layout optimization.", "skills": ["PCB Design", "Power Electronics", "Component Selection", "Hardware Design"], "company": "Tech Solutions LLP", "hidden": false },

                { "id": "img-emb-6", "url": "assets/Embedded/embedded_6.png", "title": "Embedded Software Developer", "description": "Developing and debugging embedded firmware for microcontroller-based products using peripheral interfaces, real-time data processing, and hardware communication protocols.", "skills": ["Embedded C", "STM32", "UART/SPI/I2C", "Firmware Debugging"], "company": "VVDN Technologies", "hidden": false },

                { "id": "img-emb-7", "url": "assets/Embedded/embedded_7.png", "title": "Design Engineer", "description": "Designing and testing electronic control systems for industrial and automation applications, including motor control, sensor interfaces, and embedded controllers.", "skills": ["Motor Control", "Embedded Systems", "PWM", "Control Systems"], "company": "Nibav Homelift", "hidden": false },

                { "id": "img-emb-8", "url": "assets/Embedded/embedded_8.png", "title": "Software Development", "description": "Developing software solutions for embedded applications including firmware implementation, debugging, hardware interfacing, and testing of microcontroller-based systems.", "skills": ["C Programming", "Embedded C", "Firmware Development", "Debugging"], "company": "Inboxist", "hidden": false },

                { "id": "img-emb-9", "url": "assets/Embedded/embedded_9.png", "title": "Embedded Developer", "description": "Developing and debugging embedded applications using microcontrollers, hardware interfaces, debugging tools, and real-time firmware development techniques.", "skills": ["Embedded C", "STM32", "JTAG Debugging", "Microcontrollers"], "company": "Chiptest", "hidden": false },

                { "id": "img-emb-10", "url": "assets/Embedded/embedded_10.png", "title": "R&D Designer", "description": "Researching and developing electronic hardware solutions with focus on digital circuit design, microcontroller-based systems, prototyping, and product improvement.", "skills": ["R&D", "Digital Electronics", "Circuit Design", "Prototyping"], "company": "Lambda Engineering", "hidden": false },

                { "id": "img-emb-11", "url": "assets/Embedded/embedded_11.png", "title": "Jr PCB Design Engineer", "description": "Assisting in PCB schematic and layout development, component placement, routing, design verification, and troubleshooting of embedded electronic hardware.", "skills": ["PCB Design", "KiCad", "Schematic Capture", "PCB Troubleshooting"], "company": "Rantronics Technology", "hidden": false },

                { "id": "img-emb-12", "url": "assets/Embedded/embedded_12.png", "title": "Embedded Engineer", "description": "Developing embedded hardware and firmware solutions using microcontrollers, communication peripherals, real-time operating systems, and hardware debugging tools.", "skills": ["Embedded C", "STM32", "RTOS", "Hardware Debugging"], "company": "Technomed Electronics", "hidden": false },

                { "id": "img-emb-13", "url": "assets/Embedded/embedded_13.png", "title": "PCB Design Engineer", "description": "Designing automotive electronic control hardware with reliable PCB layouts, power management, communication interfaces, and design practices for embedded automotive systems.", "skills": ["PCB Design", "Automotive Electronics", "CAN Bus", "Embedded Hardware"], "company": "Technomed Electronics", "hidden": false }

            ]
        },
        "mechanical": {
            "id": "mechanical",
            "title": "Mechanical Engineering",
            "tagline": "3D CAD Modeling & Kinematics Campus",
            "desc": "Parametric 3D CAD modeling, FEA stress analysis, thermal dynamics, and robotics lab at Pumo Technovation.",
            "tag": "Design & Dynamics",
            "color": "amber",
            "icon": "📐",
            "totalStudents": 150,
            "ongoingStudents": 40,
            "placedStudents": 110,
            "skills": ["SolidWorks", "CATIA", "AutoCAD", "FEA Analysis", "CFD", "3D Printing", "CNC Machining", "Robotics", "Thermodynamics", "Ansys"],
            "courseTopic": "Industrial 3D CAD Modeling, FEA Simulation & Robotics",
            "courseTopics": ["SolidWorks & CATIA", "Ansys FEA", "Aerodynamics CFD", "Industrial Robotics", "CNC & CAM", "3D Printing"],
            "courseOverview": "Pumo Technovation's Mechanical Engineering program provides world-class training in parametric 3D modeling using SolidWorks and CATIA, finite element analysis (FEA) with Ansys, computational fluid dynamics (CFD), CNC programming, and advanced manufacturing techniques.",
            "fullCourseContent": `<h2>📐 Industrial 3D CAD Modeling, FEA Simulation &amp; Robotics</h2>
<p class="lead">An advanced design and manufacturing master curriculum combining parametric solid/surface modeling, computational physics simulations, and automated robotic systems.</p>

<div class="callout-box">
  <h4>🎯 Program Objective &amp; Core Competencies</h4>
  <p>To train industry-ready mechanical design engineers in parametric Class-A surfacing, structural FEA stress validation under dynamic load cases, aerodynamics CFD modeling, automated CAM toolpath generation, and multi-body kinematic robotics simulation. Targeted roles include CAD/CAM Design Engineer, FEA/CFD Simulation Specialist, Robotics Engineer, and Automotive Product Designer.</p>
</div>

<h3>📋 Detailed Syllabus &amp; Technical Curriculum</h3>
<table class="syllabus-table">
  <thead>
    <tr>
      <th>Module</th>
      <th>Key Topics Covered</th>
      <th>Software &amp; Hands-on Laboratory</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Module 1: Parametric 3D CAD Modeling</strong></td>
      <td>Sketch constraints, feature trees, complex sweeps/lofts, sheet metal design, weldments, mold design, Class-A freeform surfacing.</td>
      <td>SolidWorks &amp; Dassault CATIA V5/3DEXPERIENCE modeling workshops.</td>
    </tr>
    <tr>
      <td><strong>Module 2: Finite Element Analysis (FEA)</strong></td>
      <td>Von Mises stress criteria, mesh convergence, modal vibrational analysis, buckling, nonlinear transient dynamics, fatigue life calculation.</td>
      <td>Ansys Mechanical Workbench, structural stress heatmaps &amp; factor of safety verification.</td>
    </tr>
    <tr>
      <td><strong>Module 3: Computational Fluid Dynamics (CFD)</strong></td>
      <td>Navier-Stokes equations, turbulent boundary layer models (k-epsilon / k-omega), supersonic nozzle flow, heat exchangers.</td>
      <td>Ansys Fluent &amp; CFX aerothermal simulation rigs.</td>
    </tr>
    <tr>
      <td><strong>Module 4: Industrial Robotics &amp; Kinematics</strong></td>
      <td>Forward and inverse kinematics, 6-DOF articulated arms, joint velocity profiles, collision-free trajectory planning.</td>
      <td>Robotic welding &amp; pick-and-place simulation cells.</td>
    </tr>
    <tr>
      <td><strong>Module 5: CNC Programming &amp; CAM</strong></td>
      <td>G-code &amp; M-code manual programming, 3-axis/5-axis toolpath strategies, feeds and speeds optimization, surface finish control.</td>
      <td>Mastercam / SolidCAM simulation &amp; CNC machining center execution.</td>
    </tr>
    <tr>
      <td><strong>Module 6: Additive Manufacturing &amp; GD&amp;T</strong></td>
      <td>3D printing (FDM, SLA, SLS), lattice structure optimization, Geometric Dimensioning &amp; Tolerancing (ASME Y14.5), CMM inspection.</td>
      <td>Industrial 3D printers, laser scanners, and sub-micron coordinate measuring machines.</td>
    </tr>
  </tbody>
</table>

<div class="callout-box info">
  <h4>💼 Placement &amp; Hiring Partners</h4>
  <p>Our mechanical engineering alumni are placed at prestigious manufacturing, defense, and automotive giants including <strong>Tata Motors, ISRO, Hindustan Aeronautics Limited (HAL), L&T Engineering, Mahindra &amp; Mahindra, and Ashok Leyland</strong>.</p>
</div>`,
            "companyLogos": [
                { "name": "Tata Motors", "logo": "" },
                { "name": "L&T Engineering", "logo": "" },
                { "name": "Mahindra", "logo": "" },
                { "name": "ISRO", "logo": "" },
                { "name": "HAL", "logo": "" },
                { "name": "Ashok Leyland", "logo": "" }
            ],
            "lightboxSettings": { "showSkills": true, "showCompanyBox": true, "showCourseTab": true, "bgImage": "" },
            "images": [
                { "id": "img-mech-1", "url": "assets/Mechanical/mechanical.png", "title": "Turbine Engine 3D CAD Blueprint", "description": "High-precision 3D CAD aerodynamic profile and rotor blade geometry modeled in CATIA for aerospace propulsion.", "skills": ["CATIA", "Aerospace CAD", "Surface Modeling", "Turbomachinery"], "company": "ISRO", "hidden": false },
                { "id": "img-mech-2", "url": "assets/Mechanical/mechanical_2.png", "title": "Industrial Gears & Power Transmission", "description": "Helical and spur gear train assembly with involute tooth profile calculations for heavy torque reduction units.", "skills": ["SolidWorks", "Gear Design", "Kinematics", "Power Transmission"], "company": "L&T Engineering", "hidden": false },
                { "id": "img-mech-3", "url": "assets/Mechanical/mechanical_3.png", "title": "Industrial Robotic Arm Assembly", "description": "6-DOF industrial articulated robot arm kinematic simulation, joint torque optimization, and reach envelope analysis.", "skills": ["Robotics", "Kinematics", "SolidWorks", "Automation"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-4", "url": "assets/Mechanical/mechanical_4.png", "title": "Precision CNC Machining Center", "description": "Multi-axis CNC milling setup showing tool path generation, G-code simulation, and surface tolerance inspection.", "skills": ["CNC Machining", "G-Code", "Manufacturing", "CAM"], "company": "HAL", "hidden": false },
                { "id": "img-mech-5", "url": "assets/Mechanical/mechanical_5.png", "title": "Heavy Mechanical Gearbox Assembly", "description": "Cast iron heavy industrial transmission casing with internal bearing seats, oil channels, and spline shafts.", "skills": ["SolidWorks", "Casting Design", "FEA Analysis", "Heavy Machinery"], "company": "Mahindra", "hidden": false },
                { "id": "img-mech-6", "url": "assets/Mechanical/mechanical_6.png", "title": "Automotive CAD Chassis Simulation", "description": "Full-body vehicle monocoque structural rigidity, torsional stiffness, and crashworthiness analysis in Ansys.", "skills": ["FEA Analysis", "Ansys", "Automotive CAD", "Crash Simulation"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-7", "url": "assets/Mechanical/mechanical_7.png", "title": "Aerospace Jet Turbine Blade Model", "description": "Internal cooling passage design and thermal barrier coating simulation for high-temperature superalloy blades.", "skills": ["Thermodynamics", "CFD", "CATIA", "Aerospace Engineering"], "company": "HAL", "hidden": false },
                { "id": "img-mech-8", "url": "assets/Mechanical/mechanical_8.png", "title": "Hydraulic Cylinder Actuator System", "description": "High-pressure hydraulic piston and cylinder seal assembly with finite element fluid pressure calculations.", "skills": ["Hydraulics", "Fluid Power", "SolidWorks", "FEA Analysis"], "company": "L&T Engineering", "hidden": false },
                { "id": "img-mech-9", "url": "assets/Mechanical/mechanical_9.png", "title": "Mechanical Metrology & Laser Scanner", "description": "Non-contact 3D optical laser scanning for reverse engineering, GD&T inspection, and deviation heatmaps.", "skills": ["Metrology", "GD&T", "Reverse Engineering", "Laser Scanning"], "company": "Ashok Leyland", "hidden": false },
                { "id": "img-mech-10", "url": "assets/Mechanical/mechanical_10.png", "title": "Robotics Kinematics Joint Mechanism", "description": "Harmonic drive gear reducer and high-torque brushless servo joint module for precision robotic manipulators.", "skills": ["Robotics", "Harmonic Drive", "Mechanism Design", "SolidWorks"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-11", "url": "assets/Mechanical/mechanical_11.png", "title": "3D Printer Industrial Additive Manufacturing", "description": "Selective laser sintering (SLS) additive manufacturing for complex aerospace brackets with lattice infills.", "skills": ["3D Printing", "Additive Manufacturing", "Topology Optimization", "Prototyping"], "company": "ISRO", "hidden": false },
                { "id": "img-mech-12", "url": "assets/Mechanical/mechanical_12.png", "title": "Finite Element Analysis Stress Heatmap", "description": "Von Mises stress distribution and factor of safety calculation on structural cantilever truss members under dynamic loads.", "skills": ["FEA Analysis", "Ansys", "Structural Mechanics", "Stress Analysis"], "company": "L&T Engineering", "hidden": false },
                { "id": "img-mech-13", "url": "assets/Mechanical/mechanical_13.png", "title": "5-Axis CNC Milling Spindle", "description": "High-speed electro-spindle contouring complex freeform surfaces on aerospace grade aluminum block.", "skills": ["CNC Machining", "5-Axis Milling", "CAM Software", "Manufacturing"], "company": "HAL", "hidden": false },
                { "id": "img-mech-14", "url": "assets/Mechanical/mechanical_14.png", "title": "Industrial Pneumatic Valve Manifold", "description": "Multi-port solenoid valve manifold designed for automated packaging machine pneumatic cylinder sequencing.", "skills": ["Pneumatics", "Valve Design", "Automation", "AutoCAD"], "company": "Mahindra", "hidden": false },
                { "id": "img-mech-15", "url": "assets/Mechanical/mechanical_15.png", "title": "SolidWorks Parametric Surface Design", "description": "Curvature continuous Class-A parametric surfacing for ergonomic consumer product exterior enclosures.", "skills": ["SolidWorks", "Class-A Surfacing", "Industrial Design", "CAD Modeling"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-16", "url": "assets/Mechanical/mechanical_16.png", "title": "Automated Factory Conveyor System", "description": "Modular belt conveyor line with optical sorting stations, roller bearings, and pneumatic divert gates.", "skills": ["Plant Layout", "Conveyor Design", "Material Handling", "SolidWorks"], "company": "Ashok Leyland", "hidden": false },
                { "id": "img-mech-17", "url": "assets/Mechanical/mechanical_17.png", "title": "High-Pressure Steam Boiler Pipeline", "description": "Process piping layout adhering to ASME standards with thermal expansion loops and pressure relief manifolds.", "skills": ["Piping Design", "ASME Standards", "Thermodynamics", "AutoCAD Plant"], "company": "L&T Engineering", "hidden": false },
                { "id": "img-mech-18", "url": "assets/Mechanical/mechanical_18.png", "title": "CMM Coordinate Measuring Machine", "description": "Sub-micron tactile touch probe dimensional inspection and automated CMM inspection routines.", "skills": ["CMM", "Quality Control", "Metrology", "GD&T"], "company": "Mahindra", "hidden": false },
                { "id": "img-mech-19", "url": "assets/Mechanical/mechanical_19.png", "title": "Mechatronic Servo Motor Assembly", "description": "Integrated encoder, stator winding, and planetary gearbox CAD model for mechatronic positioning drives.", "skills": ["Mechatronics", "Motor Sizing", "SolidWorks", "Gear Design"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-20", "url": "assets/Mechanical/mechanical_20.png", "title": "Industrial Heat Exchanger Unit", "description": "Shell and tube heat exchanger thermal transfer simulation showing counter-flow temperature gradients.", "skills": ["Thermodynamics", "CFD", "Heat Transfer", "Ansys Fluent"], "company": "L&T Engineering", "hidden": false },
                { "id": "img-mech-21", "url": "assets/Mechanical/mechanical_21.png", "title": "HVAC Air Duct Flow Dynamics Model", "description": "Computational fluid dynamics simulation of airflow velocity profiles and pressure drops across duct bifurcations.", "skills": ["CFD", "HVAC Design", "Ansys Fluent", "Fluid Dynamics"], "company": "Ashok Leyland", "hidden": false },
                { "id": "img-mech-22", "url": "assets/Mechanical/mechanical_22.png", "title": "CATIA Vehicle Suspension Kinematics", "description": "Double wishbone independent suspension multi-body dynamic simulation analyzing camber/caster angle variations.", "skills": ["CATIA", "Multi-Body Dynamics", "Suspension Design", "Kinematics"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-23", "url": "assets/Mechanical/mechanical_23.png", "title": "Automated Robotic Welder Cell", "description": "Robotic MIG/TIG welding torch work cell layout with safety light curtains, jigs, and fixtures.", "skills": ["Robotic Welding", "Fixture Design", "Automation", "SolidWorks"], "company": "Mahindra", "hidden": false },
                { "id": "img-mech-24", "url": "assets/Mechanical/mechanical_24.png", "title": "Electric Vehicle Battery Pack Housing", "description": "Extruded aluminum battery enclosure designed with integrated liquid cooling plates and crash absorption zones.", "skills": ["EV Engineering", "Thermal Management", "FEA Analysis", "SolidWorks"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-25", "url": "assets/Mechanical/mechanical_25.png", "title": "Computational Fluid Dynamics CFD Venturi", "description": "Velocity vector field and pressure drop contour visualization through a convergent-divergent Venturi nozzle.", "skills": ["CFD", "Fluid Mechanics", "Ansys Fluent", "Venturi Design"], "company": "ISRO", "hidden": false },
                { "id": "img-mech-26", "url": "assets/Mechanical/mechanical_26.png", "title": "Precision Roller Bearing Hub", "description": "Tapered roller bearing contact stress distribution and L10 fatigue life prediction under combined radial/axial loads.", "skills": ["Bearing Design", "Fatigue Analysis", "SolidWorks", "FEA"], "company": "L&T Engineering", "hidden": false },
                { "id": "img-mech-27", "url": "assets/Mechanical/mechanical_27.png", "title": "Industrial Steam Turbine Rotor", "description": "Multi-stage steam turbine rotor shaft design with bladed disk vibration resonance and Campbell diagram analysis.", "skills": ["Rotor Dynamics", "Vibration Analysis", "Turbomachinery", "Ansys"], "company": "HAL", "hidden": false },
                { "id": "img-mech-28", "url": "assets/Mechanical/mechanical_28.png", "title": "Laser Cutting Sheet Metal Fabricator", "description": "Fiber laser CNC nesting optimization for complex sheet metal brackets with automated bend allowance calculation.", "skills": ["Sheet Metal", "CNC Laser", "Nesting", "SolidWorks Sheet Metal"], "company": "Mahindra", "hidden": false },
                { "id": "img-mech-29", "url": "assets/Mechanical/mechanical_29.png", "title": "Heavy Equipment Transmission Shaft", "description": "Keyed splined driveshaft torsional stress calculation and heat treatment surface hardness depth specification.", "skills": ["Driveshaft Design", "Torsion Analysis", "Material Selection", "AutoCAD"], "company": "Ashok Leyland", "hidden": false },
                { "id": "img-mech-30", "url": "assets/Mechanical/mechanical_30.png", "title": "Aerospace Fuselage Frame Assembly", "description": "Carbon composite and aluminum lithium alloy bulkhead frame structure modeled for pressurized cabin containment.", "skills": ["Aerospace Structures", "Composites", "CATIA", "FEA"], "company": "ISRO", "hidden": false },
                { "id": "img-mech-31", "url": "assets/Mechanical/mechanical_31.png", "title": "Industrial CAD Robotics Simulation", "description": "Virtual commissioning of dual-robot transfer cell verifying cycle times and collision-free tool trajectories.", "skills": ["Virtual Commissioning", "Robotics", "CATIA", "Process Simulation"], "company": "Tata Motors", "hidden": false },
                { "id": "img-mech-32", "url": "assets/Mechanical/mechanical_32.png", "title": "Pneumatic Robotic Arm Axis", "description": "Guided pneumatic linear slide mechanism with hydraulic shock absorbers for high-speed pick and place tasks.", "skills": ["Pneumatics", "Linear Actuators", "Mechanism Design", "SolidWorks"], "company": "L&T Engineering", "hidden": false },
                { "id": "img-mech-39", "url": "assets/Mechanical/39.png", "title": "Mechanical Prototype Testing", "description": "Universal testing machine (UTM) tensile stress-strain curve measurement on newly developed alloy specimen.", "skills": ["Material Testing", "Tensile Testing", "Metallurgy", "Data Acquisition"], "company": "HAL", "hidden": false },
                { "id": "img-mech-40", "url": "assets/Mechanical/40.png", "title": "High Precision Lathe Spindle", "description": "Direct drive turning spindle cartridge assembly with ceramic hybrid bearings for minimal thermal drift.", "skills": ["Spindle Design", "Machine Tools", "Tolerance Stacks", "Precision Engineering"], "company": "Mahindra", "hidden": false },
                { "id": "img-mech-48", "url": "assets/Mechanical/48.png", "title": "CNC Metal Laser Cutter", "description": "6kW fiber laser cutting head focusing optics and assist gas pressure control for dross-free edge finishes.", "skills": ["Laser Cutting", "CNC Programming", "Manufacturing", "Sheet Metal"], "company": "Ashok Leyland", "hidden": false },
                { "id": "img-mech-50", "url": "assets/Mechanical/50.png", "title": "Aerospace Component Flow Simulation", "description": "Supersonic boundary layer flow separation and shockwave contour mapping over aerodynamic nose cone.", "skills": ["CFD", "Aerodynamics", "Ansys Fluent", "Aerospace Engineering"], "company": "ISRO", "hidden": false }
            ]
        },
        "sap": {
            "id": "sap",
            "title": "SAP Solutions",
            "tagline": "Enterprise Cloud ERP & Core Campus",
            "desc": "S/4HANA enterprise cloud, ABAP development, supply chain orchestration, and FICO analytics at Pumo Technovation.",
            "tag": "Enterprise Cloud ERP",
            "color": "blue",
            "icon": "📊",
            "totalStudents": 90,
            "ongoingStudents": 25,
            "placedStudents": 65,
            "skills": ["SAP S/4HANA", "ABAP", "SAP FICO", "SAP MM", "SAP SD", "SAP Fiori", "SAP BW/BI", "SuccessFactors", "Supply Chain", "SAP BASIS"],
            "courseTopic": "Enterprise SAP S/4HANA Cloud ERP & Core Business Modules",
            "courseTopics": ["S/4HANA Cloud", "ABAP on HANA", "SAP FICO", "SAP MM", "SAP SD", "SAP Fiori"],
            "courseOverview": "The SAP Solutions course at Pumo Technovation offers comprehensive training in SAP S/4HANA enterprise resource planning, ABAP object-oriented programming, financial accounting (FICO), materials management (MM), sales & distribution (SD), and SAP BW/BI analytics.",
            "fullCourseContent": `<h2>📊 Enterprise SAP S/4HANA Cloud ERP &amp; Core Business Modules</h2>
<p class="lead">An elite consulting and implementation curriculum covering in-memory HANA computing, advanced ABAP object-oriented programming, and core functional ERP modules.</p>

<div class="callout-box">
  <h4>🎯 Program Objective &amp; Global Certifications</h4>
  <p>To train industry-ready SAP Functional and Technical Consultants equipped with deep hands-on expertise in S/4HANA Cloud Architecture, Core Data Services (CDS Views), ACDOCA Universal Journal financial ledger balancing, materials sourcing, and SAP Fiori UI5 enterprise apps. Targeted roles include SAP ABAP Consultant, SAP FICO Consultant, SAP MM/SD Consultant, and ERP Integration Architect.</p>
</div>

<h3>📋 Module Syllabus &amp; Business Process Curriculum</h3>
<table class="syllabus-table">
  <thead>
    <tr>
      <th>Module</th>
      <th>Key Functional &amp; Technical Topics</th>
      <th>Live SAP GUI &amp; Fiori Exercises</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Module 1: S/4HANA Architecture &amp; Basis</strong></td>
      <td>In-memory columnar database, S/4HANA migration pathways, simplification list, Fiori Launchpad administration, client landscapes.</td>
      <td>Live SAP system login, transaction navigation, user authorizations &amp; transport organizer.</td>
    </tr>
    <tr>
      <td><strong>Module 2: ABAP on HANA &amp; CDS Views</strong></td>
      <td>Object-Oriented ABAP, Core Data Services (CDS), AMDP (ABAP Managed Database Procedures), BAdI enhancements, OData service creation.</td>
      <td>Eclipse ADT development, custom CDS view modeling, and RESTful Application Programming (RAP).</td>
    </tr>
    <tr>
      <td><strong>Module 3: SAP FICO (Finance &amp; Controlling)</strong></td>
      <td>General Ledger (G/L), Accounts Payable (AP), Accounts Receivable (AR), Asset Accounting (AA), Cost Center &amp; Profit Center Accounting.</td>
      <td>Universal Journal (ACDOCA) configuration, year-end financial closing simulation.</td>
    </tr>
    <tr>
      <td><strong>Module 4: SAP MM (Materials Management)</strong></td>
      <td>Enterprise structure, material master, vendor master, purchase requisitions, RFQ, purchase orders, goods receipt (MIGO), invoice verification (MIRO).</td>
      <td>End-to-end Procure-to-Pay (P2P) live enterprise procurement cycle.</td>
    </tr>
    <tr>
      <td><strong>Module 5: SAP SD (Sales &amp; Distribution)</strong></td>
      <td>Sales enterprise hierarchy, customer master, inquiry, quotation, sales order processing, pricing procedures (Condition Technique), delivery, billing.</td>
      <td>End-to-end Order-to-Cash (O2C) logistics and commercial sales execution.</td>
    </tr>
    <tr>
      <td><strong>Module 6: SAP Fiori &amp; SAPUI5 Apps</strong></td>
      <td>SAP Fiori 3.0 design guidelines, SAPUI5 MVC architecture, OData data binding, custom analytical cards, role-based Launchpad tiles.</td>
      <td>Building and deploying responsive approval apps on SAP Business Technology Platform (BTP).</td>
    </tr>
  </tbody>
</table>

<div class="callout-box info">
  <h4>💼 Placement &amp; Consulting Recruiters</h4>
  <p>Pumo Technovation's SAP graduates are recruited by top global tier-1 IT consulting corporations including <strong>Accenture, Wipro, Infosys, Tata Consultancy Services (TCS), Capgemini, and HCL Technologies</strong>.</p>
</div>`,
            "companyLogos": [
                { "name": "Accenture", "logo": "" },
                { "name": "Wipro", "logo": "" },
                { "name": "Infosys", "logo": "" },
                { "name": "TCS", "logo": "" },
                { "name": "Capgemini", "logo": "" },
                { "name": "HCL Technologies", "logo": "" }
            ],
            "lightboxSettings": { "showSkills": true, "showCompanyBox": true, "showCourseTab": true, "bgImage": "" },
            "images": [

                { "id": "img-sap-1", "url": "assets/SAP/sap.png", "title": "Associate SAP FICO", "description": "Supporting financial accounting and controlling processes in SAP FICO, including general ledger, accounts payable, accounts receivable, cost center accounting, and financial reporting.", "skills": ["SAP FICO", "General Ledger", "Accounts Payable", "Accounts Receivable"], "company": "Dalmia Bharat Group", "hidden": false },

                { "id": "img-sap-2", "url": "assets/SAP/sap_2.png", "title": "SAP MM", "description": "Managing procurement and material management processes including purchase requisitions, purchase orders, goods receipt, invoice verification, and inventory tracking.", "skills": ["SAP MM", "Procurement", "Inventory Management", "Material Management"], "company": "VK Building Services", "hidden": false },

                { "id": "img-sap-3", "url": "assets/SAP/sap_3.png", "title": "SAP MM", "description": "Handling end-to-end material procurement and inventory processes in SAP MM, including vendor management, purchasing, goods movement, and stock monitoring.", "skills": ["SAP MM", "Procurement", "Vendor Management", "Inventory Management"], "company": "Hertz Panels", "hidden": false },

                { "id": "img-sap-4", "url": "assets/SAP/sap_4.png", "title": "SAP FICO", "description": "Supporting SAP FICO financial processes with SAP S/4HANA, including financial postings, reporting, controlling activities, and integration with business operations.", "skills": ["SAP FICO", "SAP S/4HANA", "Financial Accounting", "Controlling"], "company": "Focus", "hidden": false },

                { "id": "img-sap-5", "url": "assets/SAP/sap_5.png", "title": "SAP FICO", "description": "Working with financial accounting and controlling activities including general ledger accounting, cost center management, financial reconciliation, and period-end closing.", "skills": ["SAP FICO", "General Ledger", "Cost Center Accounting", "Financial Reporting"], "company": "Shreyas", "hidden": false },

                { "id": "img-sap-6", "url": "assets/SAP/sap_6.png", "title": "SAP MM", "description": "Supporting SAP MM configuration and business processes for material procurement, purchasing, inventory management, vendor data, and goods movement.", "skills": ["SAP MM", "Procurement", "Purchasing", "Inventory Management"], "company": "Wipro", "hidden": false },

                { "id": "img-sap-7", "url": "assets/SAP/sap_7.png", "title": "SAP MM", "description": "Managing material management workflows through SAP Fiori applications, including purchase requisitions, purchase orders, approvals, goods receipts, and inventory operations.", "skills": ["SAP MM", "SAP Fiori", "Procurement", "Inventory Management"], "company": "TCS", "hidden": false },

                { "id": "img-sap-8", "url": "assets/SAP/sap_8.png", "title": "SAP Consultant", "description": "Supporting SAP implementation and business process activities across procurement, inventory, logistics, and enterprise resource planning operations.", "skills": ["SAP ERP", "SAP MM", "Logistics", "Business Process"], "company": "ABB", "hidden": false },

                { "id": "img-sap-9", "url": "assets/SAP/sap_9.png", "title": "SAP FICO", "description": "Supporting financial management processes in SAP FICO including accounting transactions, financial reporting, cost controlling, reconciliation, and period-end activities.", "skills": ["SAP FICO", "Financial Accounting", "Controlling", "Financial Reporting"], "company": "Focus", "hidden": false },

                { "id": "img-sap-10", "url": "assets/SAP/sap_10.png", "title": "SAP FICO", "description": "Managing financial accounting and controlling processes including journal entries, accounts receivable, accounts payable, cost center accounting, and financial reporting.", "skills": ["SAP FICO", "Accounts Receivable", "Accounts Payable", "Financial Reporting"], "company": "Capgemini", "hidden": false },

                { "id": "img-sap-11", "url": "assets/SAP/sap_11.png", "title": "SAP MM", "description": "Supporting material planning, procurement, inventory control, goods movement, and production-related material processes using SAP MM in an integrated business environment.", "skills": ["SAP MM", "Material Planning", "Procurement", "Inventory Control"], "company": "Cognizant", "hidden": false }

            ]
        },
        "plc": {
            "id": "plc",
            "title": "PLC & Automation",
            "tagline": "Industrial Automation & SCADA Campus",
            "desc": "Programmable Logic Controllers, Ladder Logic programming, SCADA monitoring, HMI design, and industrial IoT automation at Pumo Technovation.",
            "tag": "Industrial Automation",
            "color": "emerald",
            "icon": "🤖",
            "totalStudents": 110,
            "ongoingStudents": 30,
            "placedStudents": 80,
            "skills": ["Ladder Logic", "SCADA", "HMI Design", "Siemens TIA Portal", "Allen-Bradley", "PLC Programming", "VFD", "PROFINET", "Industrial IoT", "Safety Relay"],
            "courseTopic": "Industrial PLC Automation, SCADA Systems & Smart Factory",
            "courseTopics": ["Siemens S7-1500", "Allen-Bradley PAC", "SCADA & HMI", "VFD Motor Control", "PROFINET", "Safety Relays"],
            "courseOverview": "The PLC & Automation program at Pumo Technovation trains students in the complete spectrum of industrial automation — from PLC hardware selection and Ladder Logic programming to SCADA system design, HMI panel development, and industrial networking.",
            "fullCourseContent": `<h2>🤖 Industrial PLC Automation, SCADA Systems &amp; Smart Factory</h2>
<p class="lead">A complete industrial automation masterclass covering hardware wiring, Ladder Logic, multi-platform PLCs, SCADA supervisory control, VFDs, and Industry 4.0 IoT protocols.</p>

<div class="callout-box">
  <h4>🎯 Program Objective &amp; Industrial Roles</h4>
  <p>To train industry-ready Automation Engineers capable of architecting end-to-end factory control systems using Siemens S7-1500, Allen-Bradley ControlLogix, Wonderware/WinCC SCADA, servo motor closed-loop position controls, and PROFINET industrial networking. Targeted roles include PLC Programmer, SCADA Engineer, Industrial Automation Specialist, and Commissioning Engineer.</p>
</div>

<h3>📋 Module Syllabus &amp; Automation Architecture</h3>
<table class="syllabus-table">
  <thead>
    <tr>
      <th>Module</th>
      <th>Key Technical Topics</th>
      <th>Hardware Workbench &amp; Software</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Module 1: Electrical Schematics &amp; Relay Logic</strong></td>
      <td>Control transformers, contactors, overload relays, pushbuttons, pilot lights, emergency stop circuits, ISO 13849 safety categories.</td>
      <td>Hardwired relay logic control panels, digital multimeters, wiring terminals.</td>
    </tr>
    <tr>
      <td><strong>Module 2: Siemens PLC Programming</strong></td>
      <td>Siemens S7-1200 / S7-1500, TIA Portal V18, Ladder (LAD), Function Block Diagram (FBD), Structured Control Language (SCL), DB blocks.</td>
      <td>Siemens S7-1500 hardware trainer racks, analog inputs (4-20mA / 0-10V), high-speed counters.</td>
    </tr>
    <tr>
      <td><strong>Module 3: Allen-Bradley &amp; Rockwell PACs</strong></td>
      <td>ControlLogix, CompactLogix, Studio 5000 / RSLogix 5000, user-defined data types (UDT), Add-On Instructions (AOI), sequential function charts (SFC).</td>
      <td>Allen-Bradley hardware test stations &amp; Studio 5000 Emulate.</td>
    </tr>
    <tr>
      <td><strong>Module 4: SCADA Supervisory Control</strong></td>
      <td>Screen animations, dynamic tag binding, historical trending, real-time alarm logging, recipe management, database SQL logging.</td>
      <td>Siemens WinCC Professional &amp; Wonderware InTouch SCADA workstations.</td>
    </tr>
    <tr>
      <td><strong>Module 5: HMI Touch Panel Development</strong></td>
      <td>Siemens Comfort Panels, FactoryTalk View ME, screen navigation templates, alarm banners, security user groups.</td>
      <td>Multi-touch physical HMI panels connected via industrial Ethernet.</td>
    </tr>
    <tr>
      <td><strong>Module 6: VFD Drives &amp; Industrial Networks</strong></td>
      <td>Variable Frequency Drives (Siemens Sinamics / PowerFlex), closed-loop PID control, PROFINET, Modbus TCP, EtherNet/IP fieldbuses.</td>
      <td>VFD motor test benches with optical encoders and torque dynamometers.</td>
    </tr>
  </tbody>
</table>

<div class="callout-box info">
  <h4>💼 Placement &amp; Core Automation Recruiters</h4>
  <p>Our industrial automation engineers are hired by global robotics and factory automation leaders including <strong>Siemens, ABB India, Rockwell Automation, Schneider Electric, Honeywell, and Mitsubishi Electric</strong>.</p>
</div>`,
            "companyLogos": [
                { "name": "Siemens", "logo": "" },
                { "name": "ABB India", "logo": "" },
                { "name": "Rockwell Automation", "logo": "" },
                { "name": "Schneider Electric", "logo": "" },
                { "name": "Honeywell", "logo": "" },
                { "name": "Mitsubishi Electric", "logo": "" }
            ],
            "lightboxSettings": { "showSkills": true, "showCompanyBox": true, "showCourseTab": true, "bgImage": "" },
            "images": [

                { "id": "img-plc-1", "url": "assets/PLC/plc_1.png", "title": "Wiring Harness Design Engineer", "description": "Designing and developing industrial wiring harnesses for PLC control panels, including wire routing, connector selection, terminal mapping, and electrical documentation.", "skills": ["Wiring Harness Design", "Electrical Schematics", "PLC Systems", "Control Panels", "Wire Routing", "Connector Selection", "Terminal Mapping", "Industrial Automation"], "company": "Safran", "hidden": false },

                { "id": "img-plc-2", "url": "assets/PLC/plc_2.png", "title": "Wiring Harness Design Engineer", "description": "Developing wiring harness layouts for industrial control systems with proper cable routing, labeling, connector identification, and electrical interface documentation.", "skills": ["Wiring Harness Design", "Cable Routing", "Connector Design", "Electrical Documentation", "Control Panel Wiring", "Wire Harness Testing", "AutoCAD Electrical", "Electrical Design"], "company": "Hinduja Tech", "hidden": false },

                { "id": "img-plc-3", "url": "assets/PLC/plc_3.png", "title": "PLC Programmer", "description": "Programming and commissioning PLC-based automation systems using Ladder Logic, timers, counters, analog I/O, industrial communication, and machine control sequences.", "skills": ["PLC Programming", "Ladder Logic", "Allen-Bradley", "Studio 5000", "Timers & Counters", "Analog I/O", "Digital I/O", "PLC Troubleshooting", "Machine Automation"], "company": "Vp Synergic weld solution", "hidden": false },

                { "id": "img-plc-4", "url": "assets/PLC/plc_4.png", "title": "Associate Consultant Wiring Harness", "description": "Designing and documenting electrical wiring harnesses for industrial automation systems, including control circuits, connectors, relays, sensors, and safety devices.", "skills": ["Wiring Harness Design", "Electrical Schematics", "Relay Logic", "Control Circuits", "Safety Circuits", "Connector Selection", "Cable Management", "Electrical Testing", "AutoCAD Electrical"], "company": "Hinduja Tech", "hidden": false },

                { "id": "img-plc-5", "url": "assets/PLC/plc_5.png", "title": "Wiring Harness Design Engineer", "description": "Developing wiring harnesses for electro-pneumatic automation systems with sensor connections, actuator wiring, solenoid valves, connectors, and control panel interfaces.", "skills": ["Wiring Harness Design", "Pneumatics", "Sensor Wiring", "Actuator Wiring", "Solenoid Valves", "Cable Routing", "Connector Selection", "Electrical Schematics", "Automation Systems"], "company": "Renault Nissan Mitsubishi", "hidden": false },

                { "id": "img-plc-6", "url": "assets/PLC/plc_6.png", "title": "Wiring Harness Design Engineer", "description": "Designing and integrating wiring harnesses for motor control systems, including VFD connections, motor power cables, control signals, feedback wiring, and industrial communication interfaces.", "skills": ["Wiring Harness Design", "VFD Wiring", "Motor Control", "PROFINET", "Control Wiring", "Power Wiring", "Signal Wiring", "Industrial Automation", "Electrical Schematics"], "company": "Hinduja Tech", "hidden": false },

                { "id": "img-plc-7", "url": "assets/PLC/plc_7.png", "title": "Wiring Harness Design Engineer", "description": "Designing wiring harnesses for automated conveyor systems with motor connections, sensors, encoders, PLC I/O interfaces, safety circuits, and control panel wiring.", "skills": ["Wiring Harness Design", "PLC I/O Wiring", "Conveyor Automation", "Encoder Wiring", "Sensor Integration", "Motor Wiring", "Control Panel Design", "Cable Routing", "Industrial Automation"], "company": "Switch", "hidden": false },

                { "id": "img-plc-8", "url": "assets/PLC/plc_8.png", "title": "Wiring Harness Design Engineer", "description": "Designing industrial wiring harnesses and electrical interfaces for PLC networks, remote I/O modules, drives, sensors, and industrial Ethernet communication systems.", "skills": ["Wiring Harness Design", "Industrial Networking", "PROFINET", "EtherNet/IP", "Remote I/O", "PLC Wiring", "Industrial Ethernet", "Cable Management", "Network Cabling", "Electrical Documentation"], "company": "Vezewire", "hidden": false },

                { "id": "img-plc-9", "url": "assets/PLC/plc_9.png", "title": "Wiring Harness Design Engineer", "description": "Designing safety-related wiring harnesses for industrial machines, including emergency stops, safety switches, light curtains, interlocks, safety relays, and control circuits.", "skills": ["Wiring Harness Design", "Machine Safety", "Safety Circuits", "Emergency Stop", "Safety Relay", "Light Curtains", "Safety Interlocks", "Electrical Schematics", "Control Panel Wiring", "IEC Standards"], "company": "ABB India", "hidden": false }

            ]
        }
    };

    // --- 4. STATE MANAGEMENT ---
    const DATA_VERSION = 'v10_offer_letters_and_image_content';
    let appData = defaultTabData;

    function sanitizeAppData(data) {
        if (!data || typeof data !== 'object') return defaultTabData;
        for (let cat in data) {
            if (!data[cat].lightboxSettings) {
                data[cat].lightboxSettings = { showSkills: true, showCompanyBox: true, showCourseTab: true, bgImage: '' };
            }
            if (!data[cat].skills) data[cat].skills = [];
            if (!data[cat].companyLogos) data[cat].companyLogos = [];
            if (typeof data[cat].courseTopic !== 'string') {
                data[cat].courseTopic = data[cat].title ? `${data[cat].title} — Comprehensive Curriculum` : '';
            }
            if (typeof data[cat].courseOverview !== 'string') {
                data[cat].courseOverview = '';
            }
            if (typeof data[cat].fullCourseContent !== 'string' || !data[cat].fullCourseContent.trim()) {
                if (defaultTabData[cat] && defaultTabData[cat].fullCourseContent) {
                    data[cat].fullCourseContent = defaultTabData[cat].fullCourseContent;
                } else {
                    data[cat].fullCourseContent = `<h2>📖 ${data[cat].title || 'Course'} — Curriculum</h2><p class="lead">${data[cat].desc || 'Comprehensive professional training curriculum.'}</p>`;
                }
            }
            if (data[cat] && Array.isArray(data[cat].images)) {
                data[cat].images.forEach((img, idx) => {
                    if (typeof img.description !== 'string') img.description = '';
                    if (!Array.isArray(img.skills)) img.skills = [];
                    if (typeof img.company !== 'string') img.company = '';
                    if (typeof img.hidden !== 'boolean') img.hidden = false;
                    if (typeof img.showOfferLetter !== 'boolean') img.showOfferLetter = true;
                    if (typeof img.offerLetter !== 'string' || !img.offerLetter.trim()) {
                        img.offerLetter = `assets/OfferLetters/offer_${cat}_${idx + 1}.svg`;
                    }

                    if (img.url && img.url.startsWith('data:image')) return;
                    if (img.url && (img.url.startsWith('http') || (!img.url.startsWith('assets/') && !img.url.startsWith('data:image')))) {
                        if (defaultTabData[cat] && defaultTabData[cat].images[idx]) {
                            img.url = defaultTabData[cat].images[idx].url;
                        } else {
                            const folderName = cat.charAt(0).toUpperCase() + cat.slice(1);
                            img.url = `assets/${folderName}/${cat}_${idx + 1}.jpg`;
                        }
                    }
                });
            }
        }
        return data;
    }

    function loadInitialState() {
        const savedVersion = localStorage.getItem('pumo_data_version');
        fetch('data.json')
            .then(res => { if (!res.ok) throw new Error('data.json fetch error'); return res.json(); })
            .then(fetchedData => {
                if (fetchedData && typeof fetchedData === 'object' && Object.keys(fetchedData).length > 0) {
                    const saved = localStorage.getItem('nexus_domains_data');
                    if (saved && savedVersion === DATA_VERSION) {
                        try { appData = sanitizeAppData(JSON.parse(saved)); }
                        catch (e) { appData = sanitizeAppData(fetchedData); }
                    } else {
                        appData = sanitizeAppData(fetchedData);
                        localStorage.setItem('nexus_domains_data', JSON.stringify(appData));
                        localStorage.setItem('pumo_data_version', DATA_VERSION);
                    }
                    renderAllViews();
                    handleHashRouting();
                } else throw new Error('Invalid data format');
            })
            .catch(() => {
                const saved = localStorage.getItem('nexus_domains_data');
                if (saved && savedVersion === DATA_VERSION) {
                    try { appData = sanitizeAppData(JSON.parse(saved)); }
                    catch (e) { appData = defaultTabData; }
                } else {
                    appData = defaultTabData;
                    localStorage.setItem('nexus_domains_data', JSON.stringify(appData));
                    localStorage.setItem('pumo_data_version', DATA_VERSION);
                }
                renderAllViews();
                handleHashRouting();
            });
    }

    function saveState() {
        localStorage.setItem('nexus_domains_data', JSON.stringify(appData));
        localStorage.setItem('pumo_data_version', DATA_VERSION);
        fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
        }).catch(() => { });
    }

    function initSSE() {
        if (typeof EventSource !== 'undefined' && window.location.protocol.startsWith('http')) {
            try {
                const evtSource = new EventSource('/api/events');
                evtSource.onmessage = function (event) {
                    try {
                        const updated = JSON.parse(event.data);
                        if (updated && typeof updated === 'object') {
                            appData = sanitizeAppData(updated);
                            localStorage.setItem('nexus_domains_data', JSON.stringify(appData));
                            renderAllViews();
                        }
                    } catch (e) { }
                };
            } catch (e) { }
        }
    }

    // --- 5. AUDIO SYNTHESIZER ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playClickSound(freq = 600, duration = 0.05, type = 'sine') {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + duration);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) { }
    }

    // --- DOM REFERENCES ---
    const hubView = document.getElementById('hub-view');
    const galleryView = document.getElementById('gallery-view');
    const domainCardsContainer = document.getElementById('domain-cards-container');
    const galleryTabSwitcher = document.getElementById('gallery-tab-switcher');
    const galleryImagesContainer = document.getElementById('gallery-images-container');
    const activeTabPill = document.getElementById('active-tab-pill');
    const activeTabTitle = document.getElementById('active-tab-title');
    const activeTabDesc = document.getElementById('active-tab-desc');
    const shuffleBtn = document.getElementById('shuffle-gallery-btn');
    const backToHubBtn = document.getElementById('back-to-hub-btn');
    const brandHome = document.getElementById('brand-home');

    // Gallery View Switcher (Photo Gallery vs Course Details)
    const viewModeGalleryBtn = document.getElementById('view-mode-gallery-btn');
    const viewModeCourseBtn = document.getElementById('view-mode-course-btn');
    const galleryVisiblePhotoCount = document.getElementById('gallery-visible-photo-count');
    const galleryCourseCta = document.getElementById('gallery-course-cta');
    const ctaOpenCourseBtn = document.getElementById('cta-open-course-btn');
    const domainFullCourseView = document.getElementById('domain-full-course-view');
    const courseDocPaperContent = document.getElementById('course-doc-paper-content');

    let currentGalleryViewMode = 'gallery'; // 'gallery' | 'course'

    const openAdminBtn = document.getElementById('open-admin-btn');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const footerCloseAdminBtn = document.getElementById('footer-close-admin-btn');
    const adminModal = document.getElementById('admin-modal');
    const adminNavTabs = document.querySelectorAll('.admin-nav-tab');
    const adminSections = document.querySelectorAll('.admin-section');
    const adminSelectTab = document.getElementById('admin-select-tab');
    const adminStatsSelectTab = document.getElementById('admin-stats-select-tab');
    const statTotalInput = document.getElementById('stat-total-input');
    const statOngoingInput = document.getElementById('stat-ongoing-input');
    const statPlacedInput = document.getElementById('stat-placed-input');
    const saveStatsSubmitBtn = document.getElementById('save-stats-submit-btn');

    // Admin Upload elements
    const adminImageFile = document.getElementById('admin-image-file');
    const adminImageUrl = document.getElementById('admin-image-url');
    const adminImageCaption = document.getElementById('admin-image-caption');
    const adminImageDesc = document.getElementById('admin-image-desc');
    const adminImageSkills = document.getElementById('admin-image-skills');
    const adminImageCompany = document.getElementById('admin-image-company');
    const uploadImageSubmitBtn = document.getElementById('upload-image-submit-btn');
    const adminImagesGrid = document.getElementById('admin-images-grid');
    const tabImageCount = document.getElementById('tab-image-count');
    const createTabSubmitBtn = document.getElementById('create-tab-submit-btn');
    const adminTabsList = document.getElementById('admin-tabs-list');
    const resetDefaultDataBtn = document.getElementById('reset-default-data-btn');

    // Edit Image Modal elements
    const editImageModal = document.getElementById('edit-image-modal');
    const editImageForm = document.getElementById('edit-image-form');
    const editImgPreview = document.getElementById('edit-img-preview');
    const editImgTitleInput = document.getElementById('edit-img-title-input');
    const editImgDescInput = document.getElementById('edit-img-desc-input');
    const editImgSkillsInput = document.getElementById('edit-img-skills-input');
    const editImgCompanyInput = document.getElementById('edit-img-company-input');
    const editImgVisibleToggle = document.getElementById('edit-img-visible-toggle');
    const editImgCourseTopic = document.getElementById('edit-img-course-topic');
    const editImgCourseOverview = document.getElementById('edit-img-course-overview');
    const editImgFileInput = document.getElementById('edit-img-file-input');
    const editImgUrlInput = document.getElementById('edit-img-url-input');
    const closeEditImageBtn = document.getElementById('close-edit-image-btn');
    const cancelEditImageBtn = document.getElementById('cancel-edit-image-btn');

    // Profile & Course admin elements
    const adminProfileSelectTab = document.getElementById('admin-profile-select-tab');
    const toggleShowSkills = document.getElementById('toggle-show-skills');
    const toggleShowCompanies = document.getElementById('toggle-show-companies');
    const toggleShowCourseTab = document.getElementById('toggle-show-course-tab');
    const adminSkillsChips = document.getElementById('admin-skills-chips');
    const newSkillInput = document.getElementById('new-skill-input');
    const addSkillBtn = document.getElementById('add-skill-btn');
    const adminCompanyList = document.getElementById('admin-company-list');
    const newCompanyName = document.getElementById('new-company-name');
    const newCompanyLogoUrl = document.getElementById('new-company-logo-url');
    const newCompanyLogoFile = document.getElementById('new-company-logo-file');
    const addCompanyBtn = document.getElementById('add-company-btn');
    const courseTopicInput = document.getElementById('course-topic-input');
    const courseOverviewTextarea = document.getElementById('course-overview-textarea');
    const saveProfileSettingsBtn = document.getElementById('save-profile-settings-btn');
    const profileBgFile = document.getElementById('profile-bg-file');
    const profileBgUrl = document.getElementById('profile-bg-url');
    const profileBgPreviewWrap = document.getElementById('profile-bg-preview-wrap');
    const profileBgPreview = document.getElementById('profile-bg-preview');
    const clearProfileBgBtn = document.getElementById('clear-profile-bg-btn');

    // MS Word Style Rich Editor elements
    const courseRichToolbar = document.getElementById('course-rich-toolbar');
    const editorFormatBlock = document.getElementById('editor-format-block');
    const courseRichEditor = document.getElementById('course-rich-editor');
    const editorInsertImageBtn = document.getElementById('editor-insert-image-btn');
    const editorInsertTableBtn = document.getElementById('editor-insert-table-btn');
    const editorInsertCalloutBtn = document.getElementById('editor-insert-callout-btn');
    const editorImageFileInput = document.getElementById('editor-image-file-input');
    const insertSampleSyllabusBtn = document.getElementById('insert-sample-syllabus-btn');

    let currentEditTabId = null;
    let currentEditImageIndex = null;
    let currentActiveTabId = null;

    // Lightbox elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxProgressContainer = document.getElementById('lightbox-progress-container');
    const lightboxProgressBar = document.getElementById('lightbox-progress-bar');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxSlideshowBtn = document.getElementById('lightbox-slideshow-btn');
    const slideshowIcon = document.getElementById('slideshow-icon');
    const slideshowLabel = document.getElementById('slideshow-label');
    const lightboxRightPanel = document.getElementById('lightbox-right-panel');
    const rightPanelBg = document.getElementById('right-panel-bg');
    const rightPanelDomainHeader = document.getElementById('right-panel-domain-header');
    const lightboxPhotoDescSection = document.getElementById('lightbox-photo-desc-section');
    const lightboxPhotoDesc = document.getElementById('lightbox-photo-desc');
    const lightboxSkillsSection = document.getElementById('lightbox-skills-section');
    const lightboxSkillsTitle = document.getElementById('lightbox-skills-title');
    const lightboxSkillsChips = document.getElementById('lightbox-skills-chips');
    const lightboxCompaniesSection = document.getElementById('lightbox-companies-section');
    const lightboxCompaniesTitle = document.getElementById('lightbox-companies-title');
    const lightboxCompanyTiles = document.getElementById('lightbox-company-tiles');
    const panelTabInfo = document.getElementById('panel-tab-info');
    const panelTabCourse = document.getElementById('panel-tab-course');
    const panelInfoContent = document.getElementById('panel-info-content');
    const panelCourseContent = document.getElementById('panel-course-content');
    const lightboxCourseOverview = document.getElementById('lightbox-course-overview');

    // --- VISUAL GAUGES ---

    function renderHorizontalBarsHTML(total, ongoing, placed) {
        const totalVal = Math.max(0, parseInt(total) || 0);
        const ongoingVal = Math.max(0, parseInt(ongoing) || 0);
        const placedVal = Math.max(0, parseInt(placed) || 0);
        const ongoingPct = totalVal > 0 ? Math.min(100, Math.round((ongoingVal / totalVal) * 100)) : 0;
        const placedPct = totalVal > 0 ? Math.min(100, Math.round((placedVal / totalVal) * 100)) : 0;
        return `
            <div class="horizontal-bars-container">
                <div class="stat-bar-group">
                    <div class="stat-bar-header">
                        <span class="stat-bar-title">👥 Total Students</span>
                        <span class="stat-bar-count count-total">${totalVal}</span>
                    </div>
                    <div class="stat-bar-track"><div class="stat-bar-fill fill-total" style="width: 100%;"></div></div>
                </div>
                <div class="stat-bar-group">
                    <div class="stat-bar-header">
                        <span class="stat-bar-title">⏳ Ongoing Students (${ongoingPct}%)</span>
                        <span class="stat-bar-count count-ongoing">${ongoingVal}</span>
                    </div>
                    <div class="stat-bar-track"><div class="stat-bar-fill fill-ongoing" style="width: ${ongoingPct}%;"></div></div>
                </div>
                <div class="stat-bar-group">
                    <div class="stat-bar-header">
                        <span class="stat-bar-title">🎓 Placed Students (${placedPct}%)</span>
                        <span class="stat-bar-count count-placed">${placedVal}</span>
                    </div>
                    <div class="stat-bar-track"><div class="stat-bar-fill fill-placed" style="width: ${placedPct}%;"></div></div>
                </div>
            </div>
        `;
    }

    function renderCircleGaugeHTML(placed, total, isMini = false) {
        const totalVal = Math.max(0, parseInt(total) || 0);
        const placedVal = Math.max(0, parseInt(placed) || 0);
        const pct = totalVal > 0 ? Math.min(100, Math.round((placedVal / totalVal) * 100)) : 0;
        const radius = 48;
        const circumference = 2 * Math.PI * radius;
        const dashoffset = circumference - (pct / 100) * circumference;
        if (isMini) {
            return `
                <div class="card-circle-gauge-mini" title="${pct}% Placed (${placedVal}/${totalVal})">
                    <svg viewBox="0 0 110 110">
                        <circle class="gauge-bg-circle" cx="55" cy="55" r="${radius}"></circle>
                        <circle class="gauge-fill-circle" cx="55" cy="55" r="${radius}"
                                style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${dashoffset};"></circle>
                    </svg>
                    <span class="mini-gauge-text">${pct}%</span>
                </div>
            `;
        }
        return `
            <div class="circle-gauge-box">
                <div class="circle-gauge-svg-wrap">
                    <svg class="circle-gauge-svg" viewBox="0 0 110 110">
                        <circle class="gauge-bg-circle" cx="55" cy="55" r="${radius}"></circle>
                        <circle class="gauge-fill-circle" cx="55" cy="55" r="${radius}"
                                style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${dashoffset};"></circle>
                    </svg>
                    <div class="gauge-center-text">
                        <span class="gauge-percent-val">${pct}%</span>
                        <span class="gauge-percent-label">PLACED</span>
                    </div>
                </div>
                <div class="gauge-caption">100% Campus Target</div>
            </div>
        `;
    }

    // --- RENDER FUNCTIONS ---

    function renderAllViews() {
        renderOverallCampusStatus();
        renderHubAndNav();
        if (currentActiveTabId && appData[currentActiveTabId]) {
            renderActiveTabHeaderWidget(currentActiveTabId);
            renderFullCourseDocument(currentActiveTabId);
        }
        populateAdminStatsForm();
        populateAdminProfileForm();
    }

    function renderOverallCampusStatus() {
        const dashboard = document.getElementById('overall-status-dashboard');
        if (!dashboard) return;
        let totalSum = 0, ongoingSum = 0, placedSum = 0;
        Object.keys(appData).forEach(key => {
            const tab = appData[key];
            totalSum += parseInt(tab.totalStudents) || 0;
            ongoingSum += parseInt(tab.ongoingStudents) || 0;
            placedSum += parseInt(tab.placedStudents) || 0;
        });
        dashboard.innerHTML = `
            <div class="overall-dashboard-header">
                <div class="overall-title-group">
                    <div class="overall-icon-badge">🏛️</div>
                    <div>
                        <h2 class="overall-dashboard-title">Thudiyalur Campus — Overall Status</h2>
                        <p class="overall-subtitle">Real-Time Aggregate Metrics Across All Pumo Domains</p>
                    </div>
                </div>
                <span class="sync-live-badge"><span class="pulse-dot"></span> LIVE SYNC ACTIVE</span>
            </div>
            <div class="overall-stats-grid">
                <div>
                    <div class="kpi-cards-row">
                        <div class="kpi-mini-card card-total"><span class="kpi-label">Total Registered</span><span class="kpi-value">${totalSum}</span></div>
                        <div class="kpi-mini-card card-ongoing"><span class="kpi-label">Ongoing Batch</span><span class="kpi-value">${ongoingSum}</span></div>
                        <div class="kpi-mini-card card-placed"><span class="kpi-label">Placed Engineers</span><span class="kpi-value">${placedSum}</span></div>
                    </div>
                    ${renderHorizontalBarsHTML(totalSum, ongoingSum, placedSum)}
                </div>
                ${renderCircleGaugeHTML(placedSum, totalSum, false)}
            </div>
        `;
    }

    function renderHubAndNav() {
        const previousSelectedTabId = adminSelectTab ? adminSelectTab.value : null;
        const previousStatsSelectedTabId = adminStatsSelectTab ? adminStatsSelectTab.value : null;
        const previousProfileSelectedTabId = adminProfileSelectTab ? adminProfileSelectTab.value : null;

        if (domainCardsContainer) domainCardsContainer.innerHTML = '';
        if (adminSelectTab) adminSelectTab.innerHTML = '';
        if (adminStatsSelectTab) adminStatsSelectTab.innerHTML = '';
        if (adminProfileSelectTab) adminProfileSelectTab.innerHTML = '';

        const tabKeys = Object.keys(appData);
        tabKeys.forEach((key, i) => {
            const tab = appData[key];
            const allImages = tab.images || [];
            const visibleCount = allImages.filter(img => !img.hidden).length;

            if (domainCardsContainer) {
                const card = document.createElement('div');
                card.className = `domain-card card-theme-${tab.color}`;
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.style.animationDelay = `${i * 0.08}s`;
                card.innerHTML = `
                    <div class="card-glow"></div>
                    <div class="card-header">
                        <div class="icon-badge badge-${tab.color}">${tab.icon || '⚡'}</div>
                        <span class="domain-tag tag-${tab.color}">${tab.tag || 'Category'}</span>
                    </div>
                    <div class="card-body">
                        <h2 class="card-title">${escapeHtml(tab.title)}</h2>
                        <p class="card-text">${escapeHtml(tab.desc || '')}</p>
                    </div>
                    <div class="card-stats-wrapper">
                        <div class="card-stats-main-row">
                            ${renderHorizontalBarsHTML(tab.totalStudents || 0, tab.ongoingStudents || 0, tab.placedStudents || 0)}
                            ${renderCircleGaugeHTML(tab.placedStudents || 0, tab.totalStudents || 0, true)}
                        </div>
                    </div>
                    <div class="card-footer" style="margin-top: 1rem;">
                        <button class="action-btn btn-${tab.color}">
                            <span>Touch to View (${visibleCount} Photos)</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                `;
                card.addEventListener('click', () => openGalleryTab(tab.id));
                domainCardsContainer.appendChild(card);
            }

            const makeOpt = (val, text) => { const o = document.createElement('option'); o.value = val; o.textContent = text; return o; };
            if (adminSelectTab) adminSelectTab.appendChild(makeOpt(tab.id, `${tab.title} (${allImages.length} images)`));
            if (adminStatsSelectTab) adminStatsSelectTab.appendChild(makeOpt(tab.id, `${tab.icon || ''} ${tab.title}`));
            if (adminProfileSelectTab) adminProfileSelectTab.appendChild(makeOpt(tab.id, `${tab.icon || ''} ${tab.title}`));
        });

        if (adminSelectTab && previousSelectedTabId && appData[previousSelectedTabId]) adminSelectTab.value = previousSelectedTabId;
        if (adminStatsSelectTab && previousStatsSelectedTabId && appData[previousStatsSelectedTabId]) adminStatsSelectTab.value = previousStatsSelectedTabId;
        if (adminProfileSelectTab && previousProfileSelectedTabId && appData[previousProfileSelectedTabId]) adminProfileSelectTab.value = previousProfileSelectedTabId;

        renderAdminTabsList();
        populateAdminStatsForm();
        populateAdminProfileForm();
    }

    function renderActiveTabHeaderWidget(tabId) {
        const tab = appData[tabId];
        const statsWidget = document.getElementById('tab-stats-header-widget');
        if (statsWidget && tab) {
            statsWidget.innerHTML = `
                ${renderHorizontalBarsHTML(tab.totalStudents || 0, tab.ongoingStudents || 0, tab.placedStudents || 0)}
                ${renderCircleGaugeHTML(tab.placedStudents || 0, tab.totalStudents || 0, false)}
            `;
        }
    }

    // --- GALLERY & COURSE DETAILS VIEW SWITCHING ---

    function switchGalleryViewMode(mode) {
        currentGalleryViewMode = mode;
        if (mode === 'gallery') {
            if (viewModeGalleryBtn) viewModeGalleryBtn.classList.add('active');
            if (viewModeCourseBtn) viewModeCourseBtn.classList.remove('active');
            if (galleryImagesContainer) galleryImagesContainer.style.display = '';
            if (galleryCourseCta) galleryCourseCta.style.display = '';
            if (domainFullCourseView) domainFullCourseView.classList.add('hidden');
        } else {
            if (viewModeCourseBtn) viewModeCourseBtn.classList.add('active');
            if (viewModeGalleryBtn) viewModeGalleryBtn.classList.remove('active');
            if (galleryImagesContainer) galleryImagesContainer.style.display = 'none';
            if (galleryCourseCta) galleryCourseCta.style.display = 'none';
            if (domainFullCourseView) domainFullCourseView.classList.remove('hidden');
            if (currentActiveTabId) renderFullCourseDocument(currentActiveTabId);
        }
    }

    if (viewModeGalleryBtn) viewModeGalleryBtn.addEventListener('click', () => { playClickSound(750, 0.05); switchGalleryViewMode('gallery'); });
    if (viewModeCourseBtn) viewModeCourseBtn.addEventListener('click', () => { playClickSound(850, 0.05); switchGalleryViewMode('course'); });
    if (ctaOpenCourseBtn) ctaOpenCourseBtn.addEventListener('click', () => { playClickSound(900, 0.08); switchGalleryViewMode('course'); window.scrollTo({ top: 300, behavior: 'smooth' }); });

    function ensureTabCourses(tab) {
        if (!tab) return [];
        if (!tab.courses || !Array.isArray(tab.courses) || tab.courses.length === 0) {
            tab.courses = [
                {
                    id: 'course-' + tab.id + '-1',
                    title: tab.courseTopic || (tab.title + ' — Comprehensive Curriculum'),
                    buttonTitle: tab.buttonTitle || `📖 View ${tab.title} Full Details`,
                    content: tab.fullCourseContent && tab.fullCourseContent.trim()
                        ? tab.fullCourseContent
                        : `<h2>📖 ${escapeHtml(tab.title)} — Comprehensive Curriculum</h2><p class="lead">${escapeHtml(tab.desc || '')}</p><p>${escapeHtml(tab.courseOverview || '')}</p>`
                }
            ];
        }
        return tab.courses;
    }

    function renderFullCourseDocument(tabId, targetCourseId = null) {
        const tab = appData[tabId];
        if (!courseDocPaperContent || !tab) return;
        const courses = ensureTabCourses(tab);
        let activeCourse = courses.find(c => c.id === targetCourseId) || courses[0];

        const courseMultiTabSwitcher = document.getElementById('course-multi-tab-switcher');
        if (courseMultiTabSwitcher) {
            if (courses.length > 1) {
                courseMultiTabSwitcher.style.display = 'flex';
                courseMultiTabSwitcher.innerHTML = courses.map(c => `
                    <button type="button" class="course-multi-tab-btn ${c.id === activeCourse.id ? 'active' : ''}" data-course-id="${c.id}">
                        ${escapeHtml(c.buttonTitle || c.title)}
                    </button>
                `).join('');
                courseMultiTabSwitcher.querySelectorAll('.course-multi-tab-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        playClickSound(850, 0.05);
                        renderFullCourseDocument(tabId, btn.dataset.courseId);
                    });
                });
            } else {
                courseMultiTabSwitcher.style.display = 'none';
                courseMultiTabSwitcher.innerHTML = '';
            }
        }

        if (ctaOpenCourseBtn && activeCourse) {
            ctaOpenCourseBtn.textContent = activeCourse.buttonTitle || tab.buttonTitle || `📖 View ${tab.title} Full Details`;
        }

        const richContent = activeCourse && activeCourse.content && activeCourse.content.trim()
            ? activeCourse.content
            : `<h2>${escapeHtml(tab.title)} — Comprehensive Curriculum</h2><p class="lead">${escapeHtml(tab.desc || '')}</p>`;

        const pdfDoc = (activeCourse && activeCourse.pdf && activeCourse.pdf.trim())
            ? activeCourse.pdf.trim()
            : ((tab.syllabusPdf && tab.syllabusPdf.trim()) ? tab.syllabusPdf.trim() : '');

        let pdfHeaderHTML = '';
        if (pdfDoc) {
            pdfHeaderHTML = `
                <div class="syllabus-pdf-download-box" style="margin-bottom: 1.25rem; background: linear-gradient(135deg, rgba(245,158,11,0.14), rgba(6,182,212,0.08)); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
                    <div style="display: flex; align-items: center; gap: 0.85rem;">
                        <span style="font-size: 2rem; background: rgba(245,158,11,0.2); width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(245,158,11,0.35); flex-shrink: 0;">📄</span>
                        <div>
                            <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-main);">Official Course Syllabus Document (PDF)</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">Verified curriculum roadmap, module specifications &amp; lab requirements</div>
                        </div>
                    </div>
                    <button type="button" class="admin-btn btn-amber" onclick="window.open('${escapeHtml(pdfDoc)}', '_blank')" style="padding: 0.55rem 1.2rem; font-weight: 700; border-radius: 8px; font-size: 0.82rem; white-space: nowrap; cursor: pointer;">
                        📥 View / Download Syllabus PDF
                    </button>
                </div>
            `;
        }

        courseDocPaperContent.innerHTML = pdfHeaderHTML + richContent;
    }

    function openGalleryTab(tabId, updateHash = true) {
        if (!appData[tabId]) return;
        currentActiveTabId = tabId;
        const tab = appData[tabId];
        playClickSound(800, 0.08, 'triangle');
        hubView.classList.remove('active');
        galleryView.classList.add('active');
        activeTabPill.className = `domain-pill ${tab.color}-pill`;
        activeTabPill.textContent = (tab.tag || 'PUMO GALLERY').toUpperCase();
        activeTabTitle.textContent = `${tab.title} Gallery`;
        activeTabDesc.textContent = tab.desc || `Displaying Pumo Technovation image collection for ${tab.title}.`;
        if (ctaOpenCourseBtn) {
            ctaOpenCourseBtn.textContent = tab.buttonTitle || `📖 View ${tab.title} Full Details`;
        }
        renderActiveTabHeaderWidget(tabId);
        renderFullCourseDocument(tabId);
        switchGalleryViewMode('gallery');

        galleryTabSwitcher.innerHTML = '';
        Object.keys(appData).forEach(key => {
            const t = appData[key];
            const btn = document.createElement('button');
            btn.className = `tab-btn ${key === tabId ? 'active' : ''}`;
            btn.textContent = t.title;
            btn.addEventListener('click', () => { window.location.hash = 'gallery-' + t.id; });
            galleryTabSwitcher.appendChild(btn);
        });
        renderGalleryImages(tab.images || []);
        if (updateHash) window.location.hash = 'gallery-' + tabId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderGalleryImages(images) {
        galleryImagesContainer.innerHTML = '';
        const allImages = appData[currentActiveTabId] ? (appData[currentActiveTabId].images || []) : images;
        const visibleImages = (allImages || []).filter(img => !img.hidden);

        if (galleryVisiblePhotoCount) galleryVisiblePhotoCount.textContent = visibleImages.length.toString();

        if (visibleImages.length > 9) {
            galleryImagesContainer.classList.add('scrollable');
        } else {
            galleryImagesContainer.classList.remove('scrollable');
        }

        if (visibleImages.length === 0) {
            galleryImagesContainer.innerHTML = `
                <div class="no-images-msg">
                    <span style="font-size: 2.5rem;">📷</span>
                    <h3>No Visible Images in this Category</h3>
                    <p style="color: var(--text-muted); margin-top: 0.5rem;">Use the Pumo Admin Panel to upload or unhide images in this domain!</p>
                </div>
            `;
            return;
        }

        visibleImages.forEach((img, i) => {
            const realIndex = allImages.indexOf(img);
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.style.animationDelay = `${i * 0.05}s`;
            card.innerHTML = `
                <div class="gallery-img-wrapper">
                    <img src="${img.url}" alt="${escapeHtml(img.title || 'Pumo Technovation image')}" loading="lazy">
                    <div class="gallery-card-overlay">
                        <span class="zoom-badge">🔍 Click to Enlarge</span>
                    </div>
                </div>
                <div class="gallery-card-caption">
                    ${escapeHtml(img.title || 'Untitled Image')}
                </div>
            `;
            card.addEventListener('click', () => openLightbox(realIndex >= 0 ? realIndex : 0));
            galleryImagesContainer.appendChild(card);
        });
    }

    function returnToHub(updateHash = true) {
        playClickSound(400, 0.06);
        galleryView.classList.remove('active');
        hubView.classList.add('active');
        currentActiveTabId = null;
        if (updateHash) window.location.hash = 'hub';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            if (!currentActiveTabId || !appData[currentActiveTabId]) return;
            playClickSound(900, 0.08, 'square');
            const images = [...(appData[currentActiveTabId].images || [])];
            for (let i = images.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [images[i], images[j]] = [images[j], images[i]];
            }
            appData[currentActiveTabId].images = images;
            renderGalleryImages(images);
        });
    }

    // --- LIGHTBOX MODAL ---
    let lightboxCurrentIndex = 0;
    let isOfferLetterActive = false;
    let slideshowInterval = null;
    let slideshowAnimFrame = null;
    let slideshowStartTime = null;
    const slideshowSpeedMs = 3200;

    function openLightbox(index = 0, pushState = true) {
        if (!currentActiveTabId || !appData[currentActiveTabId]) return;
        const images = appData[currentActiveTabId].images || [];
        if (images.length === 0) return;
        lightboxCurrentIndex = (index >= 0 && index < images.length) ? index : 0;
        isOfferLetterActive = false;
        playClickSound(700, 0.05);
        updateLightboxView();
        lightboxModal.classList.add('active');
        if (pushState) history.pushState({ modal: 'lightbox' }, '');
    }

    function renderLightboxRightPanel() {
        if (!currentActiveTabId || !appData[currentActiveTabId]) return;
        const tab = appData[currentActiveTabId];
        const images = tab.images || [];
        const currentImg = images[lightboxCurrentIndex] || {};
        const settings = tab.lightboxSettings || { showSkills: true, showCompanyBox: true, showCourseTab: true, bgImage: '' };

        // Background: Individual Photo BG image/color fallback to Tab BG Image
        if (rightPanelBg) {
            const photoBg = currentImg.bg || currentImg.bgImage || settings.bgImage;
            if (photoBg) {
                if (photoBg.startsWith('#') || photoBg.startsWith('rgb')) {
                    rightPanelBg.style.backgroundImage = '';
                    rightPanelBg.style.backgroundColor = photoBg;
                    rightPanelBg.style.opacity = '0.3';
                } else {
                    rightPanelBg.style.backgroundImage = `url('${photoBg}')`;
                    rightPanelBg.style.backgroundColor = '';
                    rightPanelBg.style.opacity = '0.2';
                }
            } else {
                rightPanelBg.style.backgroundImage = '';
                rightPanelBg.style.backgroundColor = '';
                rightPanelBg.style.opacity = '0';
            }
        }

        // Domain header + Active Photo Title
        if (rightPanelDomainHeader) {
            rightPanelDomainHeader.innerHTML = `
                <span class="right-panel-domain-icon">${tab.icon || '⚡'}</span>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                        <div class="right-panel-domain-name">${escapeHtml(tab.title)}</div>
                        ${currentImg.hidden ? '<span class="admin-img-mini-tag" style="color:#ef4444;border-color:rgba(239,68,68,0.4);">👁️‍🗨️ Hidden in Public</span>' : ''}
                    </div>
                    <div class="right-panel-domain-tag">${escapeHtml(currentImg.title || tab.tagline || tab.tag || '')}</div>
                </div>
            `;
        }

        // Course Overview Tab button visibility
        if (panelTabCourse) {
            panelTabCourse.style.display = settings.showCourseTab ? '' : 'none';
            if (!settings.showCourseTab) switchPanelTab('info');
        }

        // Individual Photo Description Section
        if (lightboxPhotoDescSection && lightboxPhotoDesc) {
            const photoDescText = (currentImg.description && currentImg.description.trim())
                ? currentImg.description
                : (tab.desc || 'Specialized hands-on technology practical showcase at Pumo Technovation.');
            lightboxPhotoDesc.innerHTML = `<p>${escapeHtml(photoDescText)}</p>`;
            lightboxPhotoDescSection.style.display = '';
        }

        // Skills section
        if (lightboxSkillsSection) {
            const skillsList = (currentImg.skills && currentImg.skills.length > 0)
                ? currentImg.skills
                : (tab.skills || []);
            if (settings.showSkills && skillsList.length > 0) {
                lightboxSkillsSection.style.display = '';
                if (lightboxSkillsTitle) {
                    lightboxSkillsTitle.textContent = (currentImg.skills && currentImg.skills.length > 0)
                        ? 'Photo Key Tech & Skills'
                        : 'Skills Covered';
                }
                if (lightboxSkillsChips) {
                    lightboxSkillsChips.innerHTML = skillsList.map(skill =>
                        `<span class="skill-chip-display">${escapeHtml(skill)}</span>`
                    ).join('');
                }
            } else {
                lightboxSkillsSection.style.display = 'none';
            }
        }

        // Company & Project Affiliations Box (ONLY show photo-specific company affiliation if present, no default tab company logos)
        if (lightboxCompaniesSection) {
            let companyHTML = '';
            if (currentImg.company && currentImg.company.trim()) {
                companyHTML = `
                    <div class="company-tile" style="border-color: var(--cyan-primary); background: rgba(6, 182, 212, 0.08); grid-column: 1 / -1;">
                        <span class="company-tile-letter" style="background: var(--cyan-bg); border-color: var(--cyan-primary); color: var(--cyan-primary);">🏢</span>
                        <div style="min-width:0;">
                            <span class="company-tile-name" style="font-weight: 700; color: var(--cyan-light);">${escapeHtml(currentImg.company)}</span>
                            <span style="display:block; font-size: 0.65rem; color: var(--text-dim);">Photo Affiliation / Lab Project</span>
                        </div>
                    </div>
                `;
            }
            if (companyHTML) {
                lightboxCompaniesSection.style.display = '';
                if (lightboxCompaniesTitle) {
                    lightboxCompaniesTitle.textContent = 'Company & Project Affiliation';
                }
                if (lightboxCompanyTiles) lightboxCompanyTiles.innerHTML = companyHTML;
            } else {
                lightboxCompaniesSection.style.display = 'none';
            }
        }

        // Render Offer Letter HTML Card Helper
        const buildOfferLetterCardHTML = () => {
            if (!globalShowOfferLetter) return '';
            if (currentImg.showOfferLetter === false) return '';

            let offerDoc = (currentImg.offerLetter && currentImg.offerLetter.trim()) ? currentImg.offerLetter.trim() : '';
            if (!offerDoc && currentActiveTabId) {
                offerDoc = `assets/OfferLetters/offer_${currentActiveTabId}_${lightboxCurrentIndex + 1}.svg`;
                currentImg.offerLetter = offerDoc;
            }
            if (offerDoc) {
                return `
                    <div class="offer-letter-section">
                        <div class="offer-letter-card">
                            <div class="offer-letter-card-header">
                                <span class="offer-letter-card-icon">📜</span>
                                <div>
                                    <div class="offer-letter-card-title">Placement Offer Letter</div>
                                    <div class="offer-letter-card-sub">Verified Student Document &amp; Recruitment Offer</div>
                                </div>
                            </div>

                            <div class="offer-letter-preview-box">
                                <img src="${escapeHtml(offerDoc)}" class="offer-letter-thumb-img" alt="Offer Letter Preview" title="Click to view offer letter document in new tab" onclick="window.open('${escapeHtml(offerDoc)}', '_blank')">
                                <div class="offer-letter-doc-info">
                                    <div class="doc-role">🎯 ${escapeHtml(currentImg.title || 'Student Placement')}</div>
                                    <div class="doc-company">🏢 ${escapeHtml(currentImg.company || 'Pumo Hiring Recruiter')}</div>
                                    <div class="doc-status">✔ Verified Offer Letter</div>
                                </div>
                            </div>

                            <button type="button" class="admin-btn ${isOfferLetterActive ? 'btn-amber active' : 'btn-cyan'} offer-letter-toggle-btn">
                                ${isOfferLetterActive ? '📸 View Main Photo (Hide Offer Letter)' : '📜 View Offer Letter Document (Left Stage)'}
                            </button>
                            ${isOfferLetterActive ? `
                            <div class="offer-letter-photo-side-box">
                                <img src="${escapeHtml(currentImg.url)}" class="offer-letter-photo-thumb" alt="Main Student Photo">
                                <div>
                                    <div style="font-size:0.78rem; font-weight:700; color:var(--cyan-light);">📸 Main Student Photo (Active)</div>
                                    <div style="font-size:0.68rem; color:var(--text-dim);">${escapeHtml(currentImg.title || 'Student Project Photo')}</div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="offer-letter-section">
                        <div class="offer-letter-card" style="border-style: dashed; opacity: 0.85;">
                            <div class="offer-letter-card-header">
                                <span class="offer-letter-card-icon" style="background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);">📜</span>
                                <div>
                                    <div class="offer-letter-card-title" style="color: var(--text-muted);">Placement Offer Letter</div>
                                    <div class="offer-letter-card-sub">Verification Pending / Admin Upload Available</div>
                                </div>
                            </div>
                            <div style="font-size: 0.76rem; color: var(--text-dim); line-height: 1.4; margin-top: 0.2rem;">
                                No offer letter document attached yet. Upload file or URL in the Admin Panel.
                            </div>
                        </div>
                    </div>
                `;
            }
        };

        // Render Course Selected in Gallery Info
        const lightboxCourseTopic = document.getElementById('lightbox-course-topic');
        if (lightboxCourseTopic) {
            const courseTopicText = (currentImg.courseTopic && currentImg.courseTopic.trim())
                ? currentImg.courseTopic.trim()
                : ((currentImg.courseStudied && currentImg.courseStudied.trim())
                    ? currentImg.courseStudied.trim()
                    : (tab.title || 'Embedded Systems'));
            lightboxCourseTopic.innerHTML = `
                <div class="course-selected-pill">
                    <span class="course-icon">🎓</span>
                    <div style="min-width:0;">
                        <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:var(--cyan-light);">Course Selected</div>
                        <div style="font-size:0.92rem; font-weight:700; color:var(--text-main); line-height:1.3;">${escapeHtml(courseTopicText)}</div>
                    </div>
                </div>
            `;
        }

        // Attach Offer Letter / Resume Section to Gallery Info container
        let infoOfferContainer = document.getElementById('info-offer-letter-container');
        if (!infoOfferContainer) {
            infoOfferContainer = document.createElement('div');
            infoOfferContainer.id = 'info-offer-letter-container';
            if (panelInfoContent) panelInfoContent.appendChild(infoOfferContainer);
        }
        if (infoOfferContainer) {
            infoOfferContainer.innerHTML = buildOfferLetterCardHTML();
        }

        // Attach Click Listeners to all Offer Letter toggle buttons
        document.querySelectorAll('.offer-letter-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                isOfferLetterActive = !isOfferLetterActive;
                updateLightboxView();
                renderLightboxRightPanel();
                playClickSound(850, 0.08, 'triangle');
            });
        });
    }

    // Panel tab switching (Gallery Info / Course Overview)
    function switchPanelTab(which) {
        if (which === 'info') {
            panelTabInfo.classList.add('active');
            panelTabCourse.classList.remove('active');
            panelInfoContent.classList.remove('hidden');
            panelCourseContent.classList.add('hidden');
        } else {
            panelTabCourse.classList.add('active');
            panelTabInfo.classList.remove('active');
            panelCourseContent.classList.remove('hidden');
            panelInfoContent.classList.add('hidden');
        }
    }

    if (panelTabInfo) panelTabInfo.addEventListener('click', () => { playClickSound(700, 0.04); switchPanelTab('info'); });
    if (panelTabCourse) panelTabCourse.addEventListener('click', () => { playClickSound(700, 0.04); switchPanelTab('course'); });

    function updateLightboxView() {
        if (!currentActiveTabId || !appData[currentActiveTabId]) return;
        const images = appData[currentActiveTabId].images || [];
        if (images.length === 0) return;
        if (lightboxCurrentIndex < 0) lightboxCurrentIndex = images.length - 1;
        if (lightboxCurrentIndex >= images.length) lightboxCurrentIndex = 0;
        const currentImg = images[lightboxCurrentIndex];
        lightboxImg.classList.remove('fade-in');
        lightboxImg.classList.add('fade-out');
        setTimeout(() => {
            let offerDoc = (currentImg.offerLetter && currentImg.offerLetter.trim()) ? currentImg.offerLetter.trim() : '';
            if (!offerDoc && currentActiveTabId) {
                offerDoc = `assets/OfferLetters/offer_${currentActiveTabId}_${lightboxCurrentIndex + 1}.svg`;
                currentImg.offerLetter = offerDoc;
            }

            if (isOfferLetterActive && currentImg.showOfferLetter !== false && offerDoc) {
                lightboxImg.src = offerDoc;
                lightboxCaption.textContent = `📜 Offer Letter Document — ${currentImg.title || 'Student Document'}`;
                let badge = document.getElementById('lightbox-frame-badge-offer');
                if (!badge && lightboxImgFrame) {
                    badge = document.createElement('div');
                    badge.id = 'lightbox-frame-badge-offer';
                    badge.className = 'lightbox-frame-badge-offer';
                    badge.innerHTML = '📜 Official Offer Letter Document';
                    lightboxImgFrame.appendChild(badge);
                }
                if (badge) badge.style.display = '';
            } else {
                lightboxImg.src = currentImg.url;
                lightboxCaption.textContent = currentImg.title || `Image ${lightboxCurrentIndex + 1}`;
                let badge = document.getElementById('lightbox-frame-badge-offer');
                if (badge) badge.style.display = 'none';
            }
            if (lightboxCounter) lightboxCounter.textContent = `Image ${lightboxCurrentIndex + 1} of ${images.length}`;
            lightboxImg.classList.remove('fade-out');
            lightboxImg.classList.add('fade-in');
            renderLightboxRightPanel();
        }, 180);
    }

    function nextLightboxImage() { isOfferLetterActive = false; playClickSound(900, 0.04, 'sine'); lightboxCurrentIndex++; updateLightboxView(); }
    function prevLightboxImage() { isOfferLetterActive = false; playClickSound(800, 0.04, 'sine'); lightboxCurrentIndex--; updateLightboxView(); }

    function toggleSlideshow() {
        if (slideshowAnimFrame || slideshowInterval) stopSlideshow();
        else startSlideshow();
    }

    function startSlideshow() {
        stopSlideshow();
        playClickSound(1000, 0.08, 'triangle');
        if (lightboxSlideshowBtn) lightboxSlideshowBtn.classList.add('playing');
        if (slideshowIcon) slideshowIcon.textContent = '⏸';
        if (slideshowLabel) slideshowLabel.textContent = 'Pause Slideshow';
        if (lightboxProgressContainer) lightboxProgressContainer.classList.add('active');
        slideshowStartTime = performance.now();
        if (lightboxProgressBar) lightboxProgressBar.style.width = '0%';
        function animateProgress(timestamp) {
            if (!slideshowStartTime) return;
            const elapsed = timestamp - slideshowStartTime;
            const progress = Math.min((elapsed / slideshowSpeedMs) * 100, 100);
            if (lightboxProgressBar) lightboxProgressBar.style.width = `${progress}%`;
            if (elapsed >= slideshowSpeedMs) {
                nextLightboxImage();
                slideshowStartTime = performance.now();
                if (lightboxProgressBar) lightboxProgressBar.style.width = '0%';
                slideshowAnimFrame = requestAnimationFrame(animateProgress);
            } else {
                slideshowAnimFrame = requestAnimationFrame(animateProgress);
            }
        }
        slideshowAnimFrame = requestAnimationFrame(animateProgress);
    }

    function stopSlideshow() {
        if (slideshowAnimFrame) { cancelAnimationFrame(slideshowAnimFrame); slideshowAnimFrame = null; }
        slideshowStartTime = null;
        if (slideshowInterval) { clearInterval(slideshowInterval); slideshowInterval = null; }
        if (lightboxProgressContainer) lightboxProgressContainer.classList.remove('active');
        if (lightboxProgressBar) lightboxProgressBar.style.width = '0%';
        if (lightboxSlideshowBtn) lightboxSlideshowBtn.classList.remove('playing');
        if (slideshowIcon) slideshowIcon.textContent = '▶';
        if (slideshowLabel) slideshowLabel.textContent = 'Play Slideshow';
    }

    function closeLightbox(syncHistory = true) {
        stopSlideshow();
        lightboxModal.classList.remove('active');
        lightboxImg.src = '';
        switchPanelTab('info');
        if (syncHistory && history.state && history.state.modal === 'lightbox') history.back();
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => { stopSlideshow(); prevLightboxImage(); });
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => { stopSlideshow(); nextLightboxImage(); });
    if (lightboxSlideshowBtn) lightboxSlideshowBtn.addEventListener('click', toggleSlideshow);
    if (lightboxModal) lightboxModal.addEventListener('click', (e) => { if (e.target === lightboxModal) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'ArrowRight') { stopSlideshow(); nextLightboxImage(); }
        else if (e.key === 'ArrowLeft') { stopSlideshow(); prevLightboxImage(); }
        else if (e.key === 'Space' || e.key === ' ') { e.preventDefault(); toggleSlideshow(); }
        else if (e.key === 'Escape') closeLightbox();
    });

    // --- ADMIN PANEL ---
    function handleOpenAdminClick() {
        if (isAdminAuthenticated) openAdminModal();
        else openPasscodeModal();
    }

    if (openAdminBtn) openAdminBtn.addEventListener('click', handleOpenAdminClick);

    function openAdminModal(pushState = true) {
        playClickSound(700, 0.08);
        adminModal.classList.add('active');
        renderAdminImagesGrid();
        renderAdminTabsList();
        populateAdminStatsForm();
        populateAdminProfileForm();
        if (pushState) history.pushState({ modal: 'admin' }, '');
    }

    function closeAdminModal(syncHistory = true) {
        adminModal.classList.remove('active');
        if (syncHistory && history.state && history.state.modal === 'admin') history.back();
    }

    if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => closeAdminModal(true));
    if (footerCloseAdminBtn) footerCloseAdminBtn.addEventListener('click', () => closeAdminModal(true));

    adminNavTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.tab;
            adminNavTabs.forEach(t => t.classList.remove('active'));
            adminSections.forEach(s => s.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const targetSec = document.getElementById(targetId);
            if (targetSec) targetSec.classList.add('active');
        });
    });

    if (adminSelectTab) adminSelectTab.addEventListener('change', renderAdminImagesGrid);

    // Student Stats
    function populateAdminStatsForm() {
        if (!adminStatsSelectTab) return;
        const selectedId = adminStatsSelectTab.value;
        if (selectedId && appData[selectedId]) {
            const tab = appData[selectedId];
            if (statTotalInput) statTotalInput.value = tab.totalStudents || 0;
            if (statOngoingInput) statOngoingInput.value = tab.ongoingStudents || 0;
            if (statPlacedInput) statPlacedInput.value = tab.placedStudents || 0;
        }
    }

    if (adminStatsSelectTab) adminStatsSelectTab.addEventListener('change', populateAdminStatsForm);

    if (saveStatsSubmitBtn) {
        saveStatsSubmitBtn.addEventListener('click', () => {
            const selectedId = adminStatsSelectTab ? adminStatsSelectTab.value : null;
            if (!selectedId || !appData[selectedId]) return;
            const tot = parseInt(statTotalInput.value) || 0;
            const ong = parseInt(statOngoingInput.value) || 0;
            const plc = parseInt(statPlacedInput.value) || 0;
            if (tot < 0 || ong < 0 || plc < 0) { alert('❌ Student counts cannot be negative!'); return; }
            appData[selectedId].totalStudents = tot;
            appData[selectedId].ongoingStudents = ong;
            appData[selectedId].placedStudents = plc;
            saveState();
            playClickSound(1200, 0.12);
            renderAllViews();
            alert(`✔ Student statistics for "${appData[selectedId].title}" successfully updated!`);
        });
    }

    // --- PROFILE & COURSE ADMIN SECTION (MULTI-COURSE PER DOMAIN TAB) ---
    const adminProfileSelectCourse = document.getElementById('admin-profile-select-course');
    const profileCourseTitleInput = document.getElementById('profile-course-title-input');
    const profileCourseButtonNameInput = document.getElementById('profile-course-button-name-input');
    const profileAddCourseBtn = document.getElementById('profile-add-course-btn');
    const profileDeleteCourseBtn = document.getElementById('profile-delete-course-btn');
    const saveTabSettingsBtn = document.getElementById('save-tab-settings-btn');

    // Edit Photo Details Modal Elements
    const editPhotoModal = document.getElementById('edit-photo-modal');
    const closeEditPhotoBtn = document.getElementById('close-edit-photo-btn');
    const cancelEditPhotoBtn = document.getElementById('cancel-edit-photo-btn');
    const saveEditPhotoBtn = document.getElementById('save-edit-photo-btn');
    const editPhotoCaption = document.getElementById('edit-photo-caption');
    const editPhotoDesc = document.getElementById('edit-photo-desc');
    const editPhotoSkills = document.getElementById('edit-photo-skills');
    const editPhotoCompany = document.getElementById('edit-photo-company');
    const editPhotoCustomTag = document.getElementById('edit-photo-custom-tag');
    const editPhotoCourseTopic = document.getElementById('edit-photo-course-topic');
    const editPhotoRelevantCompanies = document.getElementById('edit-photo-relevant-companies');
    const editPhotoBg = document.getElementById('edit-photo-bg');
    const editPhotoTabId = document.getElementById('edit-photo-tab-id');
    const editPhotoId = document.getElementById('edit-photo-id');

    function populateAdminProfileForm() {
        if (!adminProfileSelectTab) return;
        const selectedTabId = adminProfileSelectTab.value;
        if (!selectedTabId || !appData[selectedTabId]) return;
        const tab = appData[selectedTabId];
        const courses = ensureTabCourses(tab);

        // Populate Courses dropdown under selected domain tab
        if (adminProfileSelectCourse) {
            const previousCourseId = adminProfileSelectCourse.value;
            adminProfileSelectCourse.innerHTML = courses.map(c =>
                `<option value="${c.id}">${escapeHtml(c.title)}</option>`
            ).join('');
            if (previousCourseId && courses.some(c => c.id === previousCourseId)) {
                adminProfileSelectCourse.value = previousCourseId;
            } else {
                adminProfileSelectCourse.value = courses[0].id;
            }
        }

        populateSelectedCourseForm();
    }

    function updateCoursePdfStatus(urlOrData) {
        const statusBox = document.getElementById('profile-course-pdf-status-box');
        const statusName = document.getElementById('profile-course-pdf-status-name');
        const viewBtn = document.getElementById('profile-course-pdf-view-btn');
        if (!statusBox || !statusName) return;

        if (urlOrData && urlOrData.trim()) {
            const trimmed = urlOrData.trim();
            statusName.textContent = trimmed.startsWith('data:application/pdf')
                ? 'Uploaded PDF File'
                : (trimmed.length > 40 ? trimmed.slice(0, 37) + '...' : trimmed);
            statusBox.style.display = 'flex';

            if (viewBtn) {
                viewBtn.onclick = () => window.open(trimmed, '_blank');
            }
        } else {
            statusBox.style.display = 'none';
            statusName.textContent = '';
        }
    }

    function populateSelectedCourseForm() {
        if (!adminProfileSelectTab || !adminProfileSelectCourse) return;
        const selectedTabId = adminProfileSelectTab.value;
        const selectedCourseId = adminProfileSelectCourse.value;
        if (!selectedTabId || !appData[selectedTabId]) return;
        const tab = appData[selectedTabId];
        const courses = ensureTabCourses(tab);
        const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

        if (activeCourse) {
            if (profileCourseTitleInput) profileCourseTitleInput.value = activeCourse.title || '';
            if (profileCourseButtonNameInput) profileCourseButtonNameInput.value = activeCourse.buttonTitle || `📖 View ${activeCourse.title} Details`;
            if (courseRichEditor) courseRichEditor.innerHTML = activeCourse.content || '';

            const profileCoursePdfUrl = document.getElementById('profile-course-pdf-url');
            const pdfDoc = activeCourse.pdf || tab.syllabusPdf || '';
            if (profileCoursePdfUrl) profileCoursePdfUrl.value = pdfDoc;
            updateCoursePdfStatus(pdfDoc);
        }
    }

    // PDF Upload & Clear Handlers
    const profileCoursePdfFile = document.getElementById('profile-course-pdf-file');
    const profileCoursePdfUrl = document.getElementById('profile-course-pdf-url');
    const profileCoursePdfClearBtn = document.getElementById('profile-course-pdf-clear-btn');

    if (profileCoursePdfClearBtn) {
        profileCoursePdfClearBtn.addEventListener('click', () => {
            if (profileCoursePdfFile) profileCoursePdfFile.value = '';
            if (profileCoursePdfUrl) profileCoursePdfUrl.value = '';
            updateCoursePdfStatus('');
            playClickSound(900, 0.05);
        });
    }

    if (profileCoursePdfUrl) {
        profileCoursePdfUrl.addEventListener('input', () => updateCoursePdfStatus(profileCoursePdfUrl.value));
    }

    if (profileCoursePdfFile) {
        profileCoursePdfFile.addEventListener('change', () => {
            const file = profileCoursePdfFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => updateCoursePdfStatus(e.target.result);
                reader.readAsDataURL(file);
            } else {
                updateCoursePdfStatus(profileCoursePdfUrl ? profileCoursePdfUrl.value : '');
            }
        });
    }

    function populateUploadTabGlobalSettings(selectedId) {
        if (!selectedId || !appData[selectedId]) return;
        if (!toggleShowSkills && !toggleShowCompanies && !toggleShowCourseTab) return;
        const tab = appData[selectedId];
        const settings = tab.lightboxSettings || { showSkills: true, showCompanyBox: true, showCourseTab: true, bgImage: '' };

        if (toggleShowSkills) toggleShowSkills.checked = settings.showSkills !== false;
        if (toggleShowCompanies) toggleShowCompanies.checked = settings.showCompanyBox !== false;
        if (toggleShowCourseTab) toggleShowCourseTab.checked = settings.showCourseTab !== false;

        if (settings.bgImage && profileBgPreviewWrap && profileBgPreview) {
            profileBgPreview.src = settings.bgImage;
            profileBgPreviewWrap.style.display = 'flex';
            profileBgPreviewWrap.style.alignItems = 'center';
        } else if (profileBgPreviewWrap) {
            profileBgPreviewWrap.style.display = 'none';
        }
        if (profileBgUrl) profileBgUrl.value = settings.bgImage || '';

        renderAdminSkillsChips(selectedId);
        renderAdminCompanyList(selectedId);
    }

    if (adminProfileSelectTab) adminProfileSelectTab.addEventListener('change', populateAdminProfileForm);
    if (adminProfileSelectCourse) adminProfileSelectCourse.addEventListener('change', populateSelectedCourseForm);

    // Add New Course under Selected Domain Tab
    if (profileAddCourseBtn) {
        profileAddCourseBtn.addEventListener('click', () => {
            const selectedTabId = adminProfileSelectTab ? adminProfileSelectTab.value : null;
            if (!selectedTabId || !appData[selectedTabId]) { alert('Please select a domain tab first!'); return; }
            const tab = appData[selectedTabId];

            const courseTitle = prompt(`Enter New Course Title to add under "${tab.title}" (e.g. ARM Cortex Firmware Mastery, Advanced RTOS Architecture):`);
            if (!courseTitle || !courseTitle.trim()) return;
            const cleanTitle = courseTitle.trim();

            const courses = ensureTabCourses(tab);
            const newCourse = {
                id: 'course-' + tab.id + '-' + Date.now(),
                title: cleanTitle,
                buttonTitle: `📖 View ${cleanTitle} Details`,
                content: `<h2>📖 ${escapeHtml(cleanTitle)} — Comprehensive Syllabus</h2><p class="lead">Compose detailed curriculum modules, lab equipment, and placement tracks here...</p>`
            };

            courses.push(newCourse);
            saveState();
            populateAdminProfileForm();
            if (adminProfileSelectCourse) adminProfileSelectCourse.value = newCourse.id;
            populateSelectedCourseForm();
            playClickSound(1000, 0.1, 'triangle');
            alert(`✔ New course "${cleanTitle}" added under "${tab.title}"! You can now write its syllabus in the editor.`);
        });
    }

    // Delete Selected Course under Domain Tab
    if (profileDeleteCourseBtn) {
        profileDeleteCourseBtn.addEventListener('click', () => {
            const selectedTabId = adminProfileSelectTab ? adminProfileSelectTab.value : null;
            const selectedCourseId = adminProfileSelectCourse ? adminProfileSelectCourse.value : null;
            if (!selectedTabId || !appData[selectedTabId] || !selectedCourseId) return;
            const tab = appData[selectedTabId];
            const courses = ensureTabCourses(tab);

            if (courses.length <= 1) {
                alert(`❌ At least one course must remain under "${tab.title}". Cannot delete the last course.`);
                return;
            }

            const activeCourse = courses.find(c => c.id === selectedCourseId);
            if (confirm(`Are you sure you want to delete the course "${activeCourse ? activeCourse.title : selectedCourseId}"?`)) {
                tab.courses = courses.filter(c => c.id !== selectedCourseId);
                saveState();
                populateAdminProfileForm();
                renderAllViews();
                alert(`✔ Course deleted successfully.`);
            }
        });
    }

    // Save Course Syllabus & Title Settings for Selected Course
    if (saveProfileSettingsBtn) {
        saveProfileSettingsBtn.addEventListener('click', () => {
            const selectedTabId = adminProfileSelectTab ? adminProfileSelectTab.value : null;
            const selectedCourseId = adminProfileSelectCourse ? adminProfileSelectCourse.value : null;
            if (!selectedTabId || !appData[selectedTabId]) return;
            const tab = appData[selectedTabId];
            const courses = ensureTabCourses(tab);
            const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

            const pdfFile = profileCoursePdfFile ? profileCoursePdfFile.files[0] : null;
            const pdfUrlInput = profileCoursePdfUrl ? profileCoursePdfUrl.value.trim() : '';

            const doSaveCourseData = (finalPdf) => {
                if (activeCourse) {
                    if (profileCourseTitleInput && profileCourseTitleInput.value.trim()) {
                        activeCourse.title = profileCourseTitleInput.value.trim();
                    }
                    if (profileCourseButtonNameInput && profileCourseButtonNameInput.value.trim()) {
                        activeCourse.buttonTitle = profileCourseButtonNameInput.value.trim();
                    }
                    if (courseRichEditor) {
                        activeCourse.content = courseRichEditor.innerHTML;
                    }
                    activeCourse.pdf = finalPdf;

                    // Also sync back to tab properties for backward compatibility
                    tab.title = tab.title || activeCourse.title;
                    tab.buttonTitle = activeCourse.buttonTitle;
                    tab.fullCourseContent = activeCourse.content;
                    tab.syllabusPdf = finalPdf;
                }

                if (profileCoursePdfFile) profileCoursePdfFile.value = '';
                saveState();
                playClickSound(1200, 0.12);
                renderAllViews();
                alert(`✔ Course "${activeCourse ? activeCourse.title : ''}" syllabus, title, and PDF document saved successfully!`);
            };

            if (pdfFile) {
                const reader = new FileReader();
                reader.onload = e => doSaveCourseData(e.target.result);
                reader.readAsDataURL(pdfFile);
            } else {
                doSaveCourseData(pdfUrlInput || (activeCourse ? activeCourse.pdf : '') || '');
            }
        });
    }

    // Save Global Tab Settings (in Upload & Manage)
    if (saveTabSettingsBtn) {
        saveTabSettingsBtn.addEventListener('click', () => {
            const tabId = adminSelectTab ? adminSelectTab.value : null;
            if (!tabId || !appData[tabId]) return;

            let finalBgImage = profileBgUrl ? profileBgUrl.value.trim() : '';
            const bgFile = profileBgFile ? profileBgFile.files[0] : null;

            const doSaveGlobal = (bgImg) => {
                if (!appData[tabId].lightboxSettings) {
                    appData[tabId].lightboxSettings = { showSkills: true, showCompanyBox: true, showCourseTab: true, bgImage: '' };
                }
                appData[tabId].lightboxSettings.showSkills = toggleShowSkills ? toggleShowSkills.checked : true;
                appData[tabId].lightboxSettings.showCompanyBox = toggleShowCompanies ? toggleShowCompanies.checked : true;
                appData[tabId].lightboxSettings.showCourseTab = toggleShowCourseTab ? toggleShowCourseTab.checked : true;
                if (bgImg !== null) appData[tabId].lightboxSettings.bgImage = bgImg;

                saveState();
                playClickSound(1200, 0.12);
                renderAllViews();
                alert(`✔ Global Tab Settings for "${appData[tabId].title}" saved successfully!`);
            };

            if (bgFile) {
                const reader = new FileReader();
                reader.onload = e => doSaveGlobal(e.target.result);
                reader.readAsDataURL(bgFile);
            } else {
                doSaveGlobal(finalBgImage || null);
            }
        });
    }

    function renderAdminSkillsChips(tabId) {
        if (!adminSkillsChips) return;
        const tab = appData[tabId];
        if (!tab) return;
        const skills = tab.skills || [];
        adminSkillsChips.innerHTML = skills.length === 0
            ? `<span style="font-size:0.78rem;color:var(--text-dim);padding:0.3rem 0.5rem;">No skills added yet</span>`
            : skills.map((skill, i) => `
                <span class="skill-chip-admin">
                    ${escapeHtml(skill)}
                    <button class="remove-chip" data-index="${i}" title="Remove skill">✕</button>
                </span>
            `).join('');

        adminSkillsChips.querySelectorAll('.remove-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const tid = adminSelectTab ? adminSelectTab.value : adminProfileSelectTab.value;
                if (appData[tid]) {
                    appData[tid].skills.splice(idx, 1);
                    renderAdminSkillsChips(tid);
                    playClickSound(400, 0.05);
                }
            });
        });
    }

    if (addSkillBtn && newSkillInput) {
        const doAddSkill = () => {
            const val = newSkillInput.value.trim();
            if (!val) return;
            const tabId = adminSelectTab ? adminSelectTab.value : adminProfileSelectTab.value;
            if (!tabId || !appData[tabId]) return;
            if (!appData[tabId].skills) appData[tabId].skills = [];
            if (!appData[tabId].skills.includes(val)) {
                appData[tabId].skills.push(val);
                renderAdminSkillsChips(tabId);
                playClickSound(900, 0.05);
            }
            newSkillInput.value = '';
        };
        addSkillBtn.addEventListener('click', doAddSkill);
        newSkillInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doAddSkill(); } });
    }

    function renderAdminCompanyList(tabId) {
        if (!adminCompanyList) return;
        const tab = appData[tabId];
        if (!tab) return;
        const companies = tab.companyLogos || [];
        adminCompanyList.innerHTML = companies.length === 0
            ? `<span style="font-size:0.78rem;color:var(--text-dim);padding:0.3rem 0.5rem;">No companies added yet</span>`
            : companies.map((c, i) => {
                const initial = (c.name || 'C').charAt(0).toUpperCase();
                const logoEl = c.logo
                    ? `<img src="${escapeHtml(c.logo)}" class="company-editor-logo" alt="${escapeHtml(c.name)}">`
                    : `<span class="company-editor-logo" style="display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.85rem;background:var(--amber-bg);color:var(--amber-primary);">${initial}</span>`;
                return `
                    <div class="company-editor-row">
                        ${logoEl}
                        <span class="company-editor-name">${escapeHtml(c.name || '')}</span>
                        <button class="remove-company-btn" data-index="${i}" title="Remove">🗑️</button>
                    </div>
                `;
            }).join('');

        adminCompanyList.querySelectorAll('.remove-company-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const tid = adminSelectTab ? adminSelectTab.value : adminProfileSelectTab.value;
                if (appData[tid]) {
                    appData[tid].companyLogos.splice(idx, 1);
                    renderAdminCompanyList(tid);
                    playClickSound(400, 0.05);
                }
            });
        });
    }

    if (addCompanyBtn) {
        addCompanyBtn.addEventListener('click', () => {
            const name = newCompanyName ? newCompanyName.value.trim() : '';
            if (!name) { alert('Please enter a company name!'); return; }
            const tabId = adminSelectTab ? adminSelectTab.value : adminProfileSelectTab.value;
            if (!tabId || !appData[tabId]) return;
            if (!appData[tabId].companyLogos) appData[tabId].companyLogos = [];
            const logoUrl = newCompanyLogoUrl ? newCompanyLogoUrl.value.trim() : '';
            const logoFile = newCompanyLogoFile ? newCompanyLogoFile.files[0] : null;
            const doAdd = (finalLogo) => {
                appData[tabId].companyLogos.push({ name, logo: finalLogo || '' });
                renderAdminCompanyList(tabId);
                if (newCompanyName) newCompanyName.value = '';
                if (newCompanyLogoUrl) newCompanyLogoUrl.value = '';
                if (newCompanyLogoFile) newCompanyLogoFile.value = '';
                playClickSound(900, 0.05);
            };
            if (logoFile) {
                const reader = new FileReader();
                reader.onload = e => doAdd(e.target.result);
                reader.readAsDataURL(logoFile);
            } else {
                doAdd(logoUrl);
            }
        });
    }

    // Background image for right panel
    if (profileBgUrl) {
        profileBgUrl.addEventListener('input', () => {
            const val = profileBgUrl.value.trim();
            if (val && profileBgPreview && profileBgPreviewWrap) {
                profileBgPreview.src = val;
                profileBgPreviewWrap.style.display = 'flex';
                profileBgPreviewWrap.style.alignItems = 'center';
            } else if (profileBgPreviewWrap) {
                profileBgPreviewWrap.style.display = 'none';
            }
        });
    }

    if (profileBgFile) {
        profileBgFile.addEventListener('change', () => {
            const file = profileBgFile.files[0];
            if (file && profileBgPreview && profileBgPreviewWrap) {
                const reader = new FileReader();
                reader.onload = e => {
                    profileBgPreview.src = e.target.result;
                    profileBgPreviewWrap.style.display = 'flex';
                    profileBgPreviewWrap.style.alignItems = 'center';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (clearProfileBgBtn) {
        clearProfileBgBtn.addEventListener('click', () => {
            if (profileBgUrl) profileBgUrl.value = '';
            if (profileBgPreview) profileBgPreview.src = '';
            if (profileBgPreviewWrap) profileBgPreviewWrap.style.display = 'none';
            if (profileBgFile) profileBgFile.value = '';
        });
    }

    // --- MS WORD STYLE RICH TEXT EDITOR COMMANDS ---
    if (courseRichToolbar) {
        courseRichToolbar.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.dataset.cmd;
                if (cmd) {
                    document.execCommand(cmd, false, null);
                    if (courseRichEditor) courseRichEditor.focus();
                }
            });
        });
    }

    if (editorFormatBlock) {
        editorFormatBlock.addEventListener('change', () => {
            const val = editorFormatBlock.value;
            document.execCommand('formatBlock', false, `<${val}>`);
            if (courseRichEditor) courseRichEditor.focus();
        });
    }

    // Insert Image into Document Canvas
    if (editorInsertImageBtn && editorImageFileInput) {
        editorInsertImageBtn.addEventListener('click', () => {
            const choice = confirm('Press OK to upload an image from your computer, or Cancel to enter an Image URL.');
            if (choice) {
                editorImageFileInput.click();
            } else {
                const url = prompt('Enter Image URL (e.g. assets/Embedded/embedded_1.png):');
                if (url && url.trim()) {
                    document.execCommand('insertImage', false, url.trim());
                    if (courseRichEditor) courseRichEditor.focus();
                }
            }
        });

        editorImageFileInput.addEventListener('change', () => {
            const file = editorImageFileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.execCommand('insertImage', false, e.target.result);
                    if (courseRichEditor) courseRichEditor.focus();
                };
                reader.readAsDataURL(file);
                editorImageFileInput.value = '';
            }
        });
    }

    // Insert Table into Document Canvas
    if (editorInsertTableBtn) {
        editorInsertTableBtn.addEventListener('click', () => {
            const tableHtml = `
                <table class="syllabus-table">
                    <thead>
                        <tr>
                            <th>Module Title</th>
                            <th>Topics &amp; Theoretical Concepts</th>
                            <th>Hands-on Laboratory / Tools</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Module 1: Fundamentals</strong></td>
                            <td>Core principles, design rules, architecture overview.</td>
                            <td>Hands-on lab setup &amp; simulator testing.</td>
                        </tr>
                        <tr>
                            <td><strong>Module 2: Advanced Applications</strong></td>
                            <td>Real-world implementation, protocol design, debugging.</td>
                            <td>Hardware bench testing &amp; project execution.</td>
                        </tr>
                    </tbody>
                </table>
                <p></p>
            `;
            document.execCommand('insertHTML', false, tableHtml);
            if (courseRichEditor) courseRichEditor.focus();
        });
    }

    // Insert Callout Box into Document Canvas
    if (editorInsertCalloutBtn) {
        editorInsertCalloutBtn.addEventListener('click', () => {
            const calloutHtml = `
                <div class="callout-box">
                    <h4>💡 Important Key Information</h4>
                    <p>Enter prerequisites, lab specs, certification details, or placement career paths here...</p>
                </div>
                <p></p>
            `;
            document.execCommand('insertHTML', false, calloutHtml);
            if (courseRichEditor) courseRichEditor.focus();
        });
    }

    // Load Sample Syllabus Template helper
    if (insertSampleSyllabusBtn) {
        insertSampleSyllabusBtn.addEventListener('click', () => {
            const tabId = adminProfileSelectTab ? adminProfileSelectTab.value : null;
            if (!tabId || !appData[tabId]) return;
            const tab = appData[tabId];
            if (defaultTabData[tabId] && defaultTabData[tabId].fullCourseContent) {
                if (confirm(`Load default sample syllabus template for "${tab.title}"? This will replace the editor canvas content.`)) {
                    if (courseRichEditor) courseRichEditor.innerHTML = defaultTabData[tabId].fullCourseContent;
                }
            } else {
                const sampleHtml = `
                    <h2>📖 ${escapeHtml(tab.title)} — Comprehensive Professional Curriculum</h2>
                    <p class="lead">${escapeHtml(tab.desc || 'Hands-on practical industry engineering program at Pumo Technovation.')}</p>
                    <div class="callout-box">
                        <h4>🎯 Program Objective</h4>
                        <p>To train industry-ready professionals with strong domain competencies, hands-on lab training, and project portfolio.</p>
                    </div>
                    <h3>📋 Detailed Module Breakdown</h3>
                    <table class="syllabus-table">
                        <thead>
                            <tr><th>Module</th><th>Key Topics Covered</th><th>Tools &amp; Lab</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Module 1: Foundations</strong></td><td>Core fundamentals and architecture.</td><td>Lab workbench 1</td></tr>
                            <tr><td><strong>Module 2: Advanced Design</strong></td><td>System integration and testing.</td><td>Lab workbench 2</td></tr>
                        </tbody>
                    </table>
                `;
                if (courseRichEditor) courseRichEditor.innerHTML = sampleHtml;
            }
        });
    }

    // --- ADMIN IMAGES GRID (MANAGE PHOTOS PANEL) ---
    function renderAdminImagesGrid() {
        const selectedTabId = adminSelectTab.value;
        adminImagesGrid.innerHTML = '';
        if (!selectedTabId || !appData[selectedTabId]) { tabImageCount.textContent = '0'; return; }
        const tab = appData[selectedTabId];
        const images = tab.images || [];
        tabImageCount.textContent = images.length.toString();
        if (images.length === 0) {
            adminImagesGrid.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.85rem;">No images currently in this tab.</p>`;
            return;
        }

        images.forEach((img, index) => {
            const isHidden = !!img.hidden;
            const card = document.createElement('div');
            card.className = `admin-img-card ${isHidden ? 'is-hidden-card' : ''}`;
            card.setAttribute('draggable', 'true');
            card.dataset.index = index;

            const statusTagHTML = isHidden
                ? `<span class="admin-img-status-tag tag-hidden">👁️‍🗨️ Hidden</span>`
                : `<span class="admin-img-status-tag tag-visible">👁️ Visible</span>`;

            const toggleVisBtnHTML = isHidden
                ? `<button class="toggle-vis-btn is-hidden-btn" data-index="${index}" title="Click to Show in Public Gallery">👁️‍🗨️ View</button>`
                : `<button class="toggle-vis-btn" data-index="${index}" title="Click to Hide from Public Gallery">👁️ Hide</button>`;

            const skillsSnippet = (img.skills && img.skills.length > 0)
                ? img.skills.slice(0, 2).map(s => `<span class="admin-img-mini-tag">${escapeHtml(s)}</span>`).join('')
                : '';
            const companySnippet = img.company
                ? `<span class="admin-img-mini-tag" style="color:var(--amber-light);">${escapeHtml(img.company)}</span>`
                : '';

            card.innerHTML = `
                <div class="admin-img-thumb" style="cursor: pointer;" title="Click to enlarge & view details">
                    <img src="${img.url}" alt="${escapeHtml(img.title || '')}">
                    <div class="admin-img-thumb-overlay">
                        <span>🔍 Click to Enlarge</span>
                    </div>
                    ${statusTagHTML}
                </div>
                <div class="admin-img-body">
                    <div class="admin-img-title">${escapeHtml(img.title || 'Image ' + (index + 1))}</div>
                    <div class="admin-img-desc-snippet">${escapeHtml(img.description || 'No individual description added yet.')}</div>
                    <div class="admin-img-meta-tags">
                        ${skillsSnippet}
                        ${companySnippet}
                    </div>
                </div>
                <div class="admin-img-actions-bar">
                    ${toggleVisBtnHTML}
                    <div style="display: flex; gap: 0.35rem;">
                        <button class="edit-img-btn" data-index="${index}" title="Edit Photo Info & Course Details">✏️ Edit</button>
                        <button class="delete-img-btn" data-index="${index}" title="Delete Image">🗑️</button>
                    </div>
                </div>
            `;

            // Drag and drop sorting
            card.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', index.toString()); card.classList.add('dragging'); playClickSound(500, 0.05, 'sine'); });
            card.addEventListener('dragend', () => { card.classList.remove('dragging'); adminImagesGrid.querySelectorAll('.admin-img-card').forEach(c => c.classList.remove('drag-over')); });
            card.addEventListener('dragover', (e) => e.preventDefault());
            card.addEventListener('dragenter', (e) => { e.preventDefault(); card.classList.add('drag-over'); });
            card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                card.classList.remove('drag-over');
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                if (fromIndex !== toIndex && !isNaN(fromIndex)) {
                    const targetImages = appData[selectedTabId].images;
                    const movedItem = targetImages.splice(fromIndex, 1)[0];
                    targetImages.splice(toIndex, 0, movedItem);
                    saveState();
                    renderAdminImagesGrid();
                    if (currentActiveTabId === selectedTabId) renderGalleryImages(targetImages);
                    playClickSound(1000, 0.08, 'sine');
                }
            });

            // Click thumbnail to open lightbox directly
            const thumb = card.querySelector('.admin-img-thumb');
            if (thumb) thumb.addEventListener('click', () => { currentActiveTabId = selectedTabId; openLightbox(index); });

            // 1-Click Hide/View Toggle button
            const visBtn = card.querySelector('.toggle-vis-btn');
            if (visBtn) visBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleImageVisibility(selectedTabId, index); });

            // Edit button
            const editBtn = card.querySelector('.edit-img-btn');
            if (editBtn) editBtn.addEventListener('click', (e) => { e.stopPropagation(); openEditImageModal(selectedTabId, index); });

            // Delete button
            const delBtn = card.querySelector('.delete-img-btn');
            if (delBtn) delBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteImageFromTab(selectedTabId, index); });

            adminImagesGrid.appendChild(card);
        });
    }

    function toggleImageVisibility(tabId, index) {
        if (!appData[tabId] || !appData[tabId].images || !appData[tabId].images[index]) return;
        const img = appData[tabId].images[index];
        img.hidden = !img.hidden;
        saveState();
        renderAllViews();
        renderAdminImagesGrid();
        if (currentActiveTabId === tabId) renderGalleryImages(appData[tabId].images);
        playClickSound(img.hidden ? 450 : 1150, 0.08, 'triangle');
    }

    // --- EDIT PHOTO & COURSE OVERVIEW DETAILS MODAL ---
    function openEditImageModal(tabId, imageIndex) {
        if (!appData[tabId] || !appData[tabId].images || !appData[tabId].images[imageIndex]) return;
        currentEditTabId = tabId;
        currentEditImageIndex = imageIndex;
        const imgObj = appData[tabId].images[imageIndex];

        if (editPhotoTabId) editPhotoTabId.value = tabId;
        if (editPhotoId) editPhotoId.value = imageIndex.toString();
        if (editPhotoCaption) editPhotoCaption.value = imgObj.title || '';
        if (editPhotoDesc) editPhotoDesc.value = imgObj.description || '';
        if (editPhotoSkills) editPhotoSkills.value = Array.isArray(imgObj.skills) ? imgObj.skills.join(', ') : (imgObj.skills || '');
        if (editPhotoCompany) editPhotoCompany.value = imgObj.company || '';
        if (editPhotoCustomTag) editPhotoCustomTag.value = imgObj.customTag || '';
        const editPhotoCourseTopic = document.getElementById('edit-photo-course-topic');
        if (editPhotoCourseTopic) editPhotoCourseTopic.value = imgObj.courseTopic || imgObj.courseStudied || imgObj.courseOverview || '';
        if (editPhotoRelevantCompanies) editPhotoRelevantCompanies.value = imgObj.relevantCompanies || '';
        if (editOfferLetterUrl) editOfferLetterUrl.value = imgObj.offerLetter || imgObj.resume || '';
        const editPhotoOfferVisibleToggle = document.getElementById('edit-photo-offer-visible-toggle');
        if (editPhotoOfferVisibleToggle) editPhotoOfferVisibleToggle.checked = imgObj.showOfferLetter !== false;
        if (editPhotoBg) editPhotoBg.value = imgObj.bg || imgObj.bgImage || '';

        updateOfferPreview('edit', imgObj.offerLetter || '');

        playClickSound(700, 0.08);
        if (editPhotoModal) editPhotoModal.classList.add('active');
    }

    function closeEditPhotoModal() {
        if (editPhotoModal) editPhotoModal.classList.remove('active');
        currentEditTabId = null;
        currentEditImageIndex = null;
    }

    if (closeEditPhotoBtn) closeEditPhotoBtn.addEventListener('click', closeEditPhotoModal);
    if (cancelEditPhotoBtn) cancelEditPhotoBtn.addEventListener('click', closeEditPhotoModal);
    if (editPhotoModal) editPhotoModal.addEventListener('click', (e) => { if (e.target === editPhotoModal) closeEditPhotoModal(); });

    // Live Offer Letter Preview Manager
    function updateOfferPreview(prefix, urlOrData) {
        const container = document.getElementById(`${prefix}-offer-letter-preview-container`);
        const imgEl = document.getElementById(`${prefix}-offer-letter-preview-img`);
        const pathEl = document.getElementById(`${prefix}-offer-letter-preview-path`);
        if (!container || !imgEl || !pathEl) return;
        if (urlOrData && urlOrData.trim()) {
            imgEl.src = urlOrData.trim();
            pathEl.textContent = urlOrData.trim().length > 40 ? urlOrData.trim().slice(0, 37) + '...' : urlOrData.trim();
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
            imgEl.src = '';
            pathEl.textContent = '';
        }
    }

    // Offer Letter Clear & Live Change Handlers
    const adminOfferLetterFile = document.getElementById('admin-offer-letter-file');
    const adminOfferLetterUrl = document.getElementById('admin-offer-letter-url');
    const adminOfferLetterClearBtn = document.getElementById('admin-offer-letter-clear-btn');
    if (adminOfferLetterClearBtn) {
        adminOfferLetterClearBtn.addEventListener('click', () => {
            if (adminOfferLetterFile) adminOfferLetterFile.value = '';
            if (adminOfferLetterUrl) adminOfferLetterUrl.value = '';
            updateOfferPreview('admin', '');
            playClickSound(900, 0.05);
        });
    }
    if (adminOfferLetterUrl) {
        adminOfferLetterUrl.addEventListener('input', () => updateOfferPreview('admin', adminOfferLetterUrl.value));
    }
    if (adminOfferLetterFile) {
        adminOfferLetterFile.addEventListener('change', () => {
            const file = adminOfferLetterFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => updateOfferPreview('admin', e.target.result);
                reader.readAsDataURL(file);
            } else {
                updateOfferPreview('admin', adminOfferLetterUrl ? adminOfferLetterUrl.value : '');
            }
        });
    }

    const editOfferLetterFile = document.getElementById('edit-offer-letter-file');
    const editOfferLetterUrl = document.getElementById('edit-offer-letter-url');
    const editOfferLetterClearBtn = document.getElementById('edit-offer-letter-clear-btn');
    if (editOfferLetterClearBtn) {
        editOfferLetterClearBtn.addEventListener('click', () => {
            if (editOfferLetterFile) editOfferLetterFile.value = '';
            if (editOfferLetterUrl) editOfferLetterUrl.value = '';
            updateOfferPreview('edit', '');
            playClickSound(900, 0.05);
        });
    }
    if (editOfferLetterUrl) {
        editOfferLetterUrl.addEventListener('input', () => updateOfferPreview('edit', editOfferLetterUrl.value));
    }
    if (editOfferLetterFile) {
        editOfferLetterFile.addEventListener('change', () => {
            const file = editOfferLetterFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => updateOfferPreview('edit', e.target.result);
                reader.readAsDataURL(file);
            } else {
                updateOfferPreview('edit', editOfferLetterUrl ? editOfferLetterUrl.value : '');
            }
        });
    }

    // Background Image Reset Default Pointer Buttons
    const adminImgBgFile = document.getElementById('admin-image-bg-file');
    const adminImgBgDefaultBtn = document.getElementById('admin-image-bg-default-btn');
    if (adminImgBgDefaultBtn) {
        adminImgBgDefaultBtn.addEventListener('click', () => {
            if (adminImgBgFile) adminImgBgFile.value = '';
            const bgEl = document.getElementById('admin-image-bg');
            if (bgEl) bgEl.value = '';
            playClickSound(900, 0.05);
        });
    }

    const editPhotoBgFile = document.getElementById('edit-photo-bg-file');
    const editPhotoBgDefaultBtn = document.getElementById('edit-photo-bg-default-btn');
    if (editPhotoBgDefaultBtn) {
        editPhotoBgDefaultBtn.addEventListener('click', () => {
            if (editPhotoBgFile) editPhotoBgFile.value = '';
            if (editPhotoBg) editPhotoBg.value = '';
            playClickSound(900, 0.05);
        });
    }

    if (saveEditPhotoBtn) {
        saveEditPhotoBtn.addEventListener('click', () => {
            if (!currentEditTabId || currentEditImageIndex === null) return;
            if (!appData[currentEditTabId] || !appData[currentEditTabId].images[currentEditImageIndex]) return;
            const targetImg = appData[currentEditTabId].images[currentEditImageIndex];

            const savePhotoData = (finalBg, finalOfferLetter) => {
                targetImg.title = editPhotoCaption ? editPhotoCaption.value.trim() : targetImg.title;
                targetImg.description = editPhotoDesc ? editPhotoDesc.value.trim() : targetImg.description;
                const skillsRaw = editPhotoSkills ? editPhotoSkills.value.trim() : '';
                targetImg.skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
                targetImg.company = editPhotoCompany ? editPhotoCompany.value.trim() : '';
                targetImg.customTag = editPhotoCustomTag ? editPhotoCustomTag.value.trim() : '';
                const editPhotoCourseTopic = document.getElementById('edit-photo-course-topic');
                if (editPhotoCourseTopic) {
                    targetImg.courseTopic = editPhotoCourseTopic.value.trim();
                    targetImg.courseStudied = editPhotoCourseTopic.value.trim();
                }
                targetImg.relevantCompanies = editPhotoRelevantCompanies ? editPhotoRelevantCompanies.value.trim() : '';
                const editPhotoOfferVisibleToggle = document.getElementById('edit-photo-offer-visible-toggle');
                targetImg.showOfferLetter = editPhotoOfferVisibleToggle ? editPhotoOfferVisibleToggle.checked : true;
                targetImg.showResume = editPhotoOfferVisibleToggle ? editPhotoOfferVisibleToggle.checked : true;
                targetImg.offerLetter = finalOfferLetter;
                targetImg.resume = finalOfferLetter;
                targetImg.bg = finalBg;

                if (editPhotoBgFile) editPhotoBgFile.value = '';
                if (editOfferLetterFile) editOfferLetterFile.value = '';
                saveState();
                renderAllViews();
                renderAdminImagesGrid();
                if (currentActiveTabId === currentEditTabId) renderGalleryImages(appData[currentEditTabId].images);
                playClickSound(1100, 0.1, 'sine');
                closeEditPhotoModal();
                alert('✔ Photo details, course overview, offer letter & background saved!');
            };

            const bgFile = editPhotoBgFile ? editPhotoBgFile.files[0] : null;
            const offerFile = editOfferLetterFile ? editOfferLetterFile.files[0] : null;

            const processSaveStep2 = (finalBg) => {
                if (offerFile) {
                    const reader2 = new FileReader();
                    reader2.onload = e2 => savePhotoData(finalBg, e2.target.result);
                    reader2.readAsDataURL(offerFile);
                } else {
                    savePhotoData(finalBg, editOfferLetterUrl ? editOfferLetterUrl.value.trim() : '');
                }
            };

            if (bgFile) {
                const reader = new FileReader();
                reader.onload = e => processSaveStep2(e.target.result);
                reader.readAsDataURL(bgFile);
            } else {
                processSaveStep2(editPhotoBg ? editPhotoBg.value.trim() : '');
            }
        });
    }

    function deleteImageFromTab(tabId, imageIndex) {
        if (!appData[tabId] || !appData[tabId].images) return;
        playClickSound(300, 0.1, 'sawtooth');
        appData[tabId].images.splice(imageIndex, 1);
        saveState(); renderAllViews(); renderAdminImagesGrid();
        if (currentActiveTabId === tabId) renderGalleryImages(appData[tabId].images);
    }

    if (uploadImageSubmitBtn) {
        uploadImageSubmitBtn.addEventListener('click', () => {
            const selectedTabId = adminSelectTab.value;
            if (!selectedTabId || !appData[selectedTabId]) return;
            const caption = adminImageCaption ? adminImageCaption.value.trim() : '';
            const desc = adminImageDesc ? adminImageDesc.value.trim() : '';
            const skillsRaw = adminImageSkills ? adminImageSkills.value.trim() : '';
            const skillsArr = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
            const company = adminImageCompany ? adminImageCompany.value.trim() : '';

            const customTagEl = document.getElementById('admin-image-custom-tag');
            const customTag = customTagEl ? customTagEl.value.trim() : '';

            const courseTopicEl = document.getElementById('admin-image-course-topic');
            const courseTopic = courseTopicEl ? courseTopicEl.value.trim() : '';

            const relevantCompaniesEl = document.getElementById('admin-image-relevant-companies');
            const relevantCompanies = relevantCompaniesEl ? relevantCompaniesEl.value.trim() : '';

            const bgEl = document.getElementById('admin-image-bg');
            const bgUrl = bgEl ? bgEl.value.trim() : '';
            const bgFile = adminImgBgFile ? adminImgBgFile.files[0] : null;

            const offerLetterUrlEl = document.getElementById('admin-offer-letter-url');
            const offerLetterUrl = offerLetterUrlEl ? offerLetterUrlEl.value.trim() : '';
            const offerLetterFile = adminOfferLetterFile ? adminOfferLetterFile.files[0] : null;

            const urlInput = adminImageUrl.value.trim();
            const fileInput = adminImageFile.files[0];

            const clearUploadForm = () => {
                adminImageFile.value = '';
                adminImageUrl.value = '';
                if (adminImgBgFile) adminImgBgFile.value = '';
                if (adminOfferLetterFile) adminOfferLetterFile.value = '';
                if (adminImageCaption) adminImageCaption.value = '';
                if (adminImageDesc) adminImageDesc.value = '';
                if (adminImageSkills) adminImageSkills.value = '';
                if (adminImageCompany) adminImageCompany.value = '';
                if (customTagEl) customTagEl.value = '';
                if (courseOverviewEl) courseOverviewEl.value = '';
                if (relevantCompaniesEl) relevantCompaniesEl.value = '';
                if (offerLetterUrlEl) offerLetterUrlEl.value = '';
                if (bgEl) bgEl.value = '';
            };

            const processUploadStep3 = (finalBg, finalOfferLetter) => {
                if (fileInput) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        addImageToTab(selectedTabId, e.target.result, caption || fileInput.name, desc, skillsArr, company, fileInput.name, customTag, courseOverview, relevantCompanies, finalBg, finalOfferLetter);
                        clearUploadForm();
                    };
                    reader.readAsDataURL(fileInput);
                } else if (urlInput) {
                    addImageToTab(selectedTabId, urlInput, caption || 'Uploaded Image', desc, skillsArr, company, null, customTag, courseOverview, relevantCompanies, finalBg, finalOfferLetter);
                    clearUploadForm();
                } else {
                    alert('Please select an image file or enter an image URL!');
                }
            };

            const processUploadStep2 = (finalBg) => {
                if (offerLetterFile) {
                    const oReader = new FileReader();
                    oReader.onload = function (e) { processUploadStep3(finalBg, e.target.result); };
                    oReader.readAsDataURL(offerLetterFile);
                } else {
                    processUploadStep3(finalBg, offerLetterUrl);
                }
            };

            if (bgFile) {
                const bgReader = new FileReader();
                bgReader.onload = function (e) { processUploadStep2(e.target.result); };
                bgReader.readAsDataURL(bgFile);
            } else {
                processUploadStep2(bgUrl);
            }
        });
    }

    function addImageToTab(tabId, url, title, description, skills, company, originalFilename, customTag = '', courseTopic = '', relevantCompanies = '', bg = '', offerLetter = '') {
        if (!appData[tabId].images) appData[tabId].images = [];
        playClickSound(1000, 0.1, 'sine');
        const tabTitle = appData[tabId].title || tabId;
        const folderName = tabTitle.split(' ')[0];
        const sanitizeFileName = originalFilename ? originalFilename.replace(/[^a-zA-Z0-9_.-]/g, '_') : `${tabId}_${Date.now()}.jpg`;
        const newImg = {
            id: 'img-custom-' + Date.now(),
            url: url,
            assetPath: `assets/${folderName}/${sanitizeFileName}`,
            title: title || 'Custom Image',
            description: description || '',
            skills: Array.isArray(skills) ? skills : [],
            company: company || '',
            customTag: customTag || '',
            courseTopic: courseTopic || '',
            courseStudied: courseTopic || '',
            relevantCompanies: relevantCompanies || '',
            offerLetter: offerLetter || '',
            resume: offerLetter || '',
            showOfferLetter: true,
            showResume: true,
            bg: bg || '',
            hidden: false
        };
        appData[tabId].images.push(newImg);
        saveState();
        renderAllViews();
        renderAdminImagesGrid();
        if (currentActiveTabId === tabId) renderGalleryImages(appData[tabId].images);
    }

    if (createTabSubmitBtn) {
        createTabSubmitBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('new-tab-name').value.trim();
            const subtitleInput = document.getElementById('new-tab-subtitle').value.trim();
            const colorSelect = document.getElementById('new-tab-color').value;
            const iconSelect = document.getElementById('new-tab-icon').value;
            const totInput = parseInt(document.getElementById('new-tab-total')?.value) || 100;
            const ongInput = parseInt(document.getElementById('new-tab-ongoing')?.value) || 30;
            const plcInput = parseInt(document.getElementById('new-tab-placed')?.value) || 70;
            if (!nameInput) { alert('Please enter a Tab Name!'); return; }
            const tabId = 'tab-' + nameInput.toLowerCase().replace(/[^a-z0-9]/g, '-');
            if (appData[tabId]) { alert('A tab with a similar name already exists!'); return; }
            playClickSound(1100, 0.1, 'triangle');
            appData[tabId] = {
                id: tabId, title: nameInput, tagline: subtitleInput || 'Custom Category',
                desc: subtitleInput || `Dedicated Pumo Technovation gallery section for ${nameInput}.`,
                tag: nameInput, color: colorSelect, icon: iconSelect,
                totalStudents: totInput, ongoingStudents: ongInput, placedStudents: plcInput,
                skills: [], companyLogos: [],
                courseTopic: nameInput + ' — Comprehensive Curriculum',
                courseTopics: [],
                courseOverview: '',
                fullCourseContent: `<h2>📖 ${nameInput} — Comprehensive Syllabus</h2><p class="lead">${subtitleInput || 'Professional engineering curriculum at Pumo Technovation.'}</p>`,
                lightboxSettings: { showSkills: true, showCompanyBox: true, showCourseTab: true, bgImage: '' },
                images: []
            };
            saveState(); renderAllViews();
            document.getElementById('new-tab-name').value = '';
            document.getElementById('new-tab-subtitle').value = '';
            alert(`✔ Tab "${nameInput}" successfully created!`);
        });
    }

    function renderAdminTabsList() {
        adminTabsList.innerHTML = '';
        Object.keys(appData).forEach(key => {
            const tab = appData[key];
            const row = document.createElement('div');
            row.className = 'admin-tab-row';
            const imgCount = tab.images ? tab.images.length : 0;
            row.innerHTML = `
                <div class="tab-info-row">
                    <span style="font-size: 1.3rem;">${tab.icon || '⚡'}</span>
                    <div>
                        <div class="tab-row-title">${escapeHtml(tab.title)}</div>
                        <div class="tab-row-count">${imgCount} images • ${tab.totalStudents || 0} Total / ${tab.placedStudents || 0} Placed</div>
                    </div>
                </div>
                <button class="delete-tab-btn" data-key="${key}">🗑️ Delete Tab</button>
            `;
            row.querySelector('.delete-tab-btn').addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete the tab "${tab.title}" and all its data?`)) {
                    delete appData[key];
                    saveState(); renderAllViews();
                    if (currentActiveTabId === key) returnToHub();
                }
            });
            adminTabsList.appendChild(row);
        });
    }

    if (resetDefaultDataBtn) {
        resetDefaultDataBtn.addEventListener('click', () => {
            if (confirm('Reset all tabs, images, and student statistics back to original default settings?')) {
                localStorage.removeItem('nexus_domains_data');
                appData = JSON.parse(JSON.stringify(defaultTabData));
                saveState(); renderAllViews(); returnToHub();
                alert('✔ Data successfully reset to default settings.');
            }
        });
    }

    // HELPER
    function escapeHtml(str) {
        return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    if (backToHubBtn) backToHubBtn.addEventListener('click', () => { window.location.hash = 'hub'; });
    if (brandHome) brandHome.addEventListener('click', () => { window.location.hash = 'hub'; });

    // HASH ROUTER
    function handleHashRouting() {
        const hash = window.location.hash.slice(1);
        if (hash.startsWith('gallery-')) {
            const tabId = hash.replace('gallery-', '');
            if (appData[tabId]) openGalleryTab(tabId, false);
            else returnToHub(false);
        } else {
            returnToHub(false);
        }
    }

    window.addEventListener('hashchange', handleHashRouting);

    window.addEventListener('popstate', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active') && (!e.state || e.state.modal !== 'lightbox')) closeLightbox(false);
        if (adminModal && adminModal.classList.contains('active') && (!e.state || e.state.modal !== 'admin')) closeAdminModal(false);
        if (passcodeModal && passcodeModal.classList.contains('active') && (!e.state || e.state.modal !== 'passcode')) closePasscodeModal(false);
        handleHashRouting();
    });

    loadInitialState();
    initSSE();
});
