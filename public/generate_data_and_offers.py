import json
import os

offer_dir = r"f:\Final\Webpage\assets\OfferLetters"
os.makedirs(offer_dir, exist_ok=True)

def generate_svg_offer_letter(student_name, role_title, company_name, tab_name, index):
    filename = f"offer_{tab_name}_{index}.svg"
    filepath = os.path.join(offer_dir, filename)
    
    date_str = f"2026-0{min((index % 8) + 1, 9)}-15"
    ctc_val = f"₹{4.5 + (index % 7) * 0.75:.2f} LPA"
    serial_no = f"PUMO-2026-OFFER-{tab_name[:3].upper()}-{100 + index}"

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <defs>
    <linearGradient id="headerGrad_{tab_name}_{index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="accentGrad_{tab_name}_{index}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="1100" fill="#ffffff"/>
  <rect width="760" height="1060" x="20" y="20" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8"/>
  <rect width="740" height="1040" x="30" y="30" fill="none" stroke="#cbd5e1" stroke-width="1" rx="6"/>

  <!-- Top Accent Bar -->
  <rect width="740" height="12" x="30" y="30" fill="url(#accentGrad_{tab_name}_{index})"/>

  <!-- Header Section -->
  <rect width="740" height="130" x="30" y="42" fill="url(#headerGrad_{tab_name}_{index})"/>
  
  <text x="60" y="85" font-family="'Inter', sans-serif" font-weight="800" font-size="26" fill="#ffffff" letter-spacing="1">PUMO TECHNOVATION THUDIYALUR</text>
  <text x="60" y="110" font-family="'Inter', sans-serif" font-weight="600" font-size="13" fill="#fbbf24" letter-spacing="2">OFFICIAL PLACEMENT &amp; CAREER CELL</text>
  <text x="60" y="130" font-family="'Inter', sans-serif" font-weight="400" font-size="11" fill="#94a3b8">India's Advanced AI Integrated Tech Campus — Coimbatore</text>

  <!-- Official Offer Title Banner -->
  <rect width="680" height="45" x="60" y="190" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" rx="6"/>
  <text x="400" y="220" font-family="'Inter', sans-serif" font-weight="800" font-size="18" fill="#0f172a" text-anchor="middle" letter-spacing="1.5">OFFICIAL RECRUITMENT OFFER LETTER</text>

  <!-- Document Metadata Box -->
  <text x="60" y="265" font-family="'Inter', sans-serif" font-weight="600" font-size="13" fill="#64748b">Ref No: <tspan fill="#0f172a" font-weight="700">{serial_no}</tspan></text>
  <text x="740" y="265" font-family="'Inter', sans-serif" font-weight="600" font-size="13" fill="#64748b" text-anchor="end">Date: <tspan fill="#0f172a" font-weight="700">{date_str}</tspan></text>

  <!-- Candidate & Hiring Details -->
  <rect width="680" height="155" x="60" y="290" fill="#f1f5f9" rx="8" stroke="#cbd5e1" stroke-width="1"/>
  
  <text x="85" y="325" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#475569">STUDENT / CANDIDATE NAME:</text>
  <text x="85" y="355" font-family="'Inter', sans-serif" font-weight="800" font-size="20" fill="#0284c7">{student_name}</text>
  <text x="85" y="380" font-family="'Inter', sans-serif" font-weight="600" font-size="14" fill="#334155">Offered Role: <tspan fill="#0f172a" font-weight="700">{role_title}</tspan></text>
  <text x="85" y="405" font-family="'Inter', sans-serif" font-weight="600" font-size="14" fill="#334155">Hiring Recruiter: <tspan fill="#d97706" font-weight="800">{company_name}</tspan></text>
  <text x="85" y="428" font-family="'Inter', sans-serif" font-weight="600" font-size="14" fill="#334155">Offered CTC Package: <tspan fill="#059669" font-weight="800">{ctc_val}</tspan></text>

  <!-- Letter Body Text -->
  <text x="60" y="478" font-family="'Inter', sans-serif" font-weight="700" font-size="15" fill="#0f172a">Dear {student_name},</text>

  <g font-family="'Inter', sans-serif" font-size="13.5" fill="#334155">
    <text x="60" y="508">We are delighted to issue this Placement Offer Letter on behalf of <tspan font-weight="700" fill="#0f172a">{company_name}</tspan></text>
    <text x="60" y="530">following your outstanding technical performance in the campus drive held at</text>
    <text x="60" y="552">Pumo Technovation Thudiyalur Campus.</text>

    <text x="60" y="592">Having successfully completed the rigorous training curriculum in <tspan font-weight="700" fill="#0284c7">{tab_name.upper()}</tspan>,</text>
    <text x="60" y="614">you have demonstrated high competence for the position of <tspan font-weight="700" fill="#0f172a">{role_title}</tspan>.</text>

    <text x="60" y="654">Summary of Placement Offer Terms:</text>
    <text x="85" y="680">• Designation: {role_title}</text>
    <text x="85" y="703">• Recruiter Organization: {company_name}</text>
    <text x="85" y="726">• Annual Compensation: {ctc_val} (Fixed Base + Allowance)</text>
    <text x="85" y="749">• Document Verification Code: {serial_no}</text>

    <text x="60" y="792">Please return a signed copy of this letter to the Placement Officer within 7 working days.</text>
    <text x="60" y="814">We wish you a triumphant engineering career ahead!</text>
  </g>

  <!-- Stamp & Verification Badge -->
  <g transform="translate(540, 825)">
    <circle cx="70" cy="70" r="58" fill="none" stroke="#0284c7" stroke-width="3" stroke-dasharray="8 4"/>
    <circle cx="70" cy="70" r="50" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.5"/>
    <text x="70" y="52" font-family="'Inter', sans-serif" font-weight="800" font-size="10" fill="#0284c7" text-anchor="middle">VERIFIED PLACEMENT</text>
    <text x="70" y="72" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#0f172a" text-anchor="middle">PUMO</text>
    <text x="70" y="86" font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#059669" text-anchor="middle">TECHNOVATION</text>
    <text x="70" y="98" font-family="'Inter', sans-serif" font-weight="600" font-size="8" fill="#64748b" text-anchor="middle">OFFICIAL SEAL</text>
  </g>

  <!-- Signature Section -->
  <line x1="60" y1="950" x2="260" y2="950" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="60" y="970" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#0f172a">Head of Campus Placements</text>
  <text x="60" y="988" font-family="'Inter', sans-serif" font-weight="500" font-size="12" fill="#64748b">Pumo Technovation Thudiyalur</text>

  <line x1="320" y1="950" x2="500" y2="950" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="320" y="970" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#0f172a">Authorized Recruiter</text>
  <text x="320" y="988" font-family="'Inter', sans-serif" font-weight="500" font-size="12" fill="#64748b">{company_name}</text>

  <!-- Footer Security Bar -->
  <rect width="740" height="30" x="30" y="1030" fill="#0f172a"/>
  <text x="400" y="1050" font-family="'Inter', sans-serif" font-weight="600" font-size="11" fill="#94a3b8" text-anchor="middle">VERIFIED STUDENT DOCUMENT — PUMO TECHNOVATION CAREER DIVISION</text>
</svg>'''

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(svg_content)
    
    return f"assets/OfferLetters/{filename}"

data_path = r"f:\Final\Webpage\data.json"
with open(data_path, "r", encoding="utf-8") as f:
    app_data = json.load(f)

# Define full rich dataset
embedded_updates = [
    ("R&D Embedded Systems Engineer", "Hardware-software integration lab session conducting real-time firmware debugging, logic signal capture, and ARM Cortex interrupt handling.", ["Embedded C", "ARM Cortex-M4", "Debugging", "Oscilloscope", "Interrupts"], "Onwards Technologies"),
    ("Junior Embedded Firmware Developer", "Junior Embedded Developer working on deterministic FreeRTOS task scheduling, UART/SPI peripheral driver abstraction, and bare-metal C optimization.", ["Embedded C", "FreeRTOS", "Keil MDK", "Hardware Architecture", "STM32"], "CRISP"),
    ("IoT Wireless Sensor Developer", "Ultra-low power IoT telemetry node interfacing temperature, pressure, and gas sensors over MQTT and Bluetooth Low Energy (BLE) protocols.", ["IoT Sensors", "UART/SPI/I2C", "MQTT Telemetry", "Wireless Protocols", "ESP32"], "EMGLITZ TECHNOLOGIES"),
    ("Graduate Engineer Trainee — Firmware", "Graduate Engineer Trainee role focusing on high-density PCB layout routing, surface mount component assembly, and hardware signal validation.", ["PCB Design", "Circuit Design", "SMD Assembly", "Signal Integrity", "Altium Designer"], "TVS EUROGRIP"),
    ("Embedded Cybersecurity Specialist", "Hardware root of trust, AES cryptographic coprocessors, and secure bootloader firmware development for connected smart industrial devices.", ["Cybersecurity", "Secure Boot", "Embedded C", "Cryptography", "ARM TrustZone"], "CRISP"),
    ("Embedded Systems Hardware Engineer", "Real-time timing signal capture and bus decoding for SPI and I2C industrial sensor networks using mixed-signal oscilloscopes and logic analyzers.", ["UART/SPI/I2C", "Oscilloscope", "Signal Analysis", "Hardware Debugging", "MISRA-C"], "Lakshmi Industrial Automation"),
    ("Mechatronics & Design Engineer", "Multi-axis servo and stepper motor control subsystem driven by RTOS deterministic task scheduling and PWM pulse-width modulation timers.", ["RTOS", "PWM Control", "Motor Drivers", "Robotics", "PID Loops"], "Nibav Home Lifts"),
    ("SMD Hardware Rework Engineer", "Precision surface-mount SMD component soldering, hot-air rework, and prototype board validation in the Pumo hardware fabrication facility.", ["PCB Prototyping", "SMD Soldering", "Hardware Rework", "Testing", "Multimeter"], "Inboxist Happy Inboxing"),
    ("Embedded Debugging Engineer", "Dedicated developer test bench with multi-channel logic analyzers, variable DC power rails, and JTAG hardware debugging probes.", ["JTAG", "Logic Analyzer", "Keil MDK", "Hardware Abstraction", "STM32 Nucleo"], "Technomed Electronics"),
    ("PCB Layout Design Engineer", "Advanced PCB layout design with high-speed signal routing, controlled impedance traces, EMC shielding, and multilayer stackup optimization.", ["PCB Layout", "Altium Designer", "Gerber Files", "Signal Integrity", "KiCad"], "Tech Solutions LLP"),
    ("Bare-Metal Kernel Systems Developer", "Kernel level memory buffer debugging, bare-metal C memory allocation optimization, and stack overflow runtime inspection.", ["Embedded C", "Memory Management", "GDB Debugging", "Bare Metal", "Pointer Arithmetic"], "Tata Elxsi"),
    ("FPGA Digital Logic Engineer", "Hardware description language (Verilog/VHDL) logic synthesis and real-time digital logic simulation on Xilinx/Intel FPGA development boards.", ["FPGA", "VHDL/Verilog", "Logic Synthesis", "Digital Design", "Quartus"], "Qualcomm"),
    ("Automotive ECU Firmware Engineer", "AUTOSAR compliant automotive electronic control unit (ECU) firmware with CAN-FD telemetry and fail-safe watchdog routines.", ["AUTOSAR", "CAN Bus", "Automotive ECU", "RTOS", "CAN-FD"], "Robert Bosch")
]

mechanical_updates = [
    ("Turbine Aerodynamic CAD Specialist", "High-precision 3D CAD aerodynamic profile and rotor blade geometry modeled in CATIA V5 for aerospace propulsion systems.", ["CATIA", "Aerospace CAD", "Surface Modeling", "Turbomachinery"], "ISRO"),
    ("Gearbox Design & Kinematics Trainee", "Helical and spur gear train assembly with involute tooth profile calculations for heavy industrial torque reduction units.", ["SolidWorks", "Gear Design", "Kinematics", "Power Transmission"], "L&T Engineering"),
    ("Robotics Kinematics Engineer", "6-DOF industrial articulated robot arm kinematic simulation, joint torque optimization, and reach envelope collision analysis.", ["Robotics", "Kinematics", "SolidWorks", "Automation"], "Tata Motors"),
    ("CNC Multi-Axis CAM Specialist", "Multi-axis CNC milling setup showing tool path generation, G-code simulation, feeds & speeds optimization, and surface tolerance inspection.", ["CNC Machining", "G-Code", "Manufacturing", "CAM"], "HAL"),
    ("Heavy Gearbox Casting Engineer", "Cast iron heavy industrial transmission casing with internal bearing seats, oil lubrication channels, and spline shafts.", ["SolidWorks", "Casting Design", "FEA Analysis", "Heavy Machinery"], "Mahindra"),
    ("Automotive Crash & FEA Analyst", "Full-body vehicle monocoque structural rigidity, torsional stiffness, and crashworthiness transient stress analysis in Ansys.", ["FEA Analysis", "Ansys", "Automotive CAD", "Crash Simulation"], "Tata Motors"),
    ("Aerothermal Turbine Blade Developer", "Internal cooling passage design and thermal barrier coating simulation for high-temperature jet engine superalloy blades.", ["Thermodynamics", "CFD", "CATIA", "Aerospace Engineering"], "HAL"),
    ("Hydraulic System Design Engineer", "High-pressure hydraulic piston and cylinder seal assembly with finite element fluid pressure and burst calculations.", ["Hydraulics", "Fluid Power", "SolidWorks", "FEA Analysis"], "L&T Engineering"),
    ("Reverse Engineering Metrology Trainee", "Non-contact 3D optical laser scanning for reverse engineering, GD&T inspection, and sub-micron deviation heatmaps.", ["Metrology", "GD&T", "Reverse Engineering", "Laser Scanning"], "Ashok Leyland"),
    ("Harmonic Servo Mechanism Engineer", "Harmonic drive gear reducer and high-torque brushless servo joint module for precision robotic manipulators.", ["Robotics", "Harmonic Drive", "Mechanism Design", "SolidWorks"], "Tata Motors"),
    ("Additive Manufacturing Specialist", "Selective laser sintering (SLS) additive manufacturing for complex aerospace brackets with topology lattice infills.", ["3D Printing", "Additive Manufacturing", "Topology Optimization", "Prototyping"], "ISRO"),
    ("FEA Structural Stress Analyst", "Von Mises stress distribution and factor of safety calculation on structural cantilever truss members under dynamic loads.", ["FEA Analysis", "Ansys", "Structural Mechanics", "Stress Analysis"], "L&T Engineering"),
    ("5-Axis CNC Milling Specialist", "High-speed electro-spindle contouring complex freeform surfaces on aerospace grade aluminum blocks.", ["CNC Machining", "5-Axis Milling", "CAM Software", "Manufacturing"], "HAL"),
    ("Pneumatic Valve Manifold Designer", "Multi-port solenoid valve manifold designed for automated packaging machine pneumatic cylinder sequencing.", ["Pneumatics", "Valve Design", "Automation", "AutoCAD"], "Mahindra"),
    ("Parametric Class-A Surfacing Engineer", "Curvature continuous Class-A parametric surfacing for ergonomic consumer product exterior enclosures.", ["SolidWorks", "Class-A Surfacing", "Industrial Design", "CAD Modeling"], "Tata Motors"),
    ("Factory Automation Systems Engineer", "Modular belt conveyor line with optical sorting stations, roller bearings, and pneumatic divert gates.", ["Plant Layout", "Conveyor Design", "Material Handling", "SolidWorks"], "Ashok Leyland"),
    ("Process Piping & Steam Boiler Trainee", "Process piping layout adhering to ASME standards with thermal expansion loops and pressure relief manifolds.", ["Piping Design", "ASME Standards", "Thermodynamics", "AutoCAD Plant"], "L&T Engineering"),
    ("CMM Quality Inspection Specialist", "Sub-micron tactile touch probe dimensional inspection and automated CMM inspection routines.", ["CMM", "Quality Control", "Metrology", "GD&T"], "Mahindra"),
    ("Mechatronic Servo Motor Developer", "Integrated encoder, stator winding, and planetary gearbox CAD model for mechatronic positioning drives.", ["Mechatronics", "Motor Sizing", "SolidWorks", "Gear Design"], "Tata Motors"),
    ("Thermal Heat Exchanger Analyst", "Shell and tube heat exchanger thermal transfer simulation showing counter-flow temperature gradients.", ["Thermodynamics", "CFD", "Heat Transfer", "Ansys Fluent"], "L&T Engineering"),
    ("HVAC Airflow CFD Simulation Engineer", "Computational fluid dynamics simulation of airflow velocity profiles and pressure drops across duct bifurcations.", ["CFD", "HVAC Design", "Ansys Fluent", "Fluid Dynamics"], "Ashok Leyland"),
    ("Suspension Kinematics Specialist", "Double wishbone independent suspension multi-body dynamic simulation analyzing camber/caster angle variations.", ["CATIA", "Multi-Body Dynamics", "Suspension Design", "Kinematics"], "Tata Motors"),
    ("Robotic Welding Workcell Designer", "Robotic MIG/TIG welding torch work cell layout with safety light curtains, jigs, and fixtures.", ["Robotic Welding", "Fixture Design", "Automation", "SolidWorks"], "Mahindra"),
    ("EV Battery Pack Thermal Engineer", "Extruded aluminum battery enclosure designed with integrated liquid cooling plates and crash absorption zones.", ["EV Engineering", "Thermal Management", "FEA Analysis", "SolidWorks"], "Tata Motors"),
    ("Supersonic Aerodynamics CFD Specialist", "Velocity vector field and pressure drop contour visualization through a convergent-divergent Venturi nozzle.", ["CFD", "Fluid Mechanics", "Ansys Fluent", "Venturi Design"], "ISRO"),
    ("Precision Roller Bearing Developer", "Tapered roller bearing contact stress distribution and L10 fatigue life prediction under combined radial/axial loads.", ["Bearing Design", "Fatigue Analysis", "SolidWorks", "FEA"], "L&T Engineering"),
    ("Rotor Dynamics & Vibration Specialist", "Multi-stage steam turbine rotor shaft design with bladed disk vibration resonance and Campbell diagram analysis.", ["Rotor Dynamics", "Vibration Analysis", "Turbomachinery", "Ansys"], "HAL"),
    ("CNC Fiber Laser Sheet Metal Trainee", "Fiber laser CNC nesting optimization for complex sheet metal brackets with automated bend allowance calculation.", ["Sheet Metal", "CNC Laser", "Nesting", "SolidWorks Sheet Metal"], "Mahindra"),
    ("Driveshaft Torsional Analysis Specialist", "Keyed splined driveshaft torsional stress calculation and heat treatment surface hardness depth specification.", ["Driveshaft Design", "Torsion Analysis", "Material Selection", "AutoCAD"], "Ashok Leyland"),
    ("Aerospace Fuselage Composite Designer", "Carbon composite and aluminum lithium alloy bulkhead frame structure modeled for pressurized cabin containment.", ["Aerospace Structures", "Composites", "CATIA", "FEA"], "ISRO"),
    ("Virtual Commissioning Robotics Engineer", "Virtual commissioning of dual-robot transfer cell verifying cycle times and collision-free tool trajectories.", ["Virtual Commissioning", "Robotics", "CATIA", "Process Simulation"], "Tata Motors"),
    ("Pneumatic Linear Slide Actuator Specialist", "Guided pneumatic linear slide mechanism with hydraulic shock absorbers for high-speed pick and place tasks.", ["Pneumatics", "Linear Actuators", "Mechanism Design", "SolidWorks"], "L&T Engineering"),
    ("Metallurgical Prototype Test Engineer", "Universal testing machine (UTM) tensile stress-strain curve measurement on newly developed alloy specimen.", ["Material Testing", "Tensile Testing", "Metallurgy", "Data Acquisition"], "HAL"),
    ("Precision Turning Spindle Designer", "Direct drive turning spindle cartridge assembly with ceramic hybrid bearings for minimal thermal drift.", ["Spindle Design", "Machine Tools", "Tolerance Stacks", "Precision Engineering"], "Mahindra"),
    ("CNC Laser Cutting Optics Engineer", "6kW fiber laser cutting head focusing optics and assist gas pressure control for dross-free edge finishes.", ["Laser Cutting", "CNC Programming", "Manufacturing", "Sheet Metal"], "Ashok Leyland"),
    ("Supersonic Aerodynamic Nose Cone Specialist", "Supersonic boundary layer flow separation and shockwave contour mapping over aerodynamic nose cone.", ["CFD", "Aerodynamics", "Ansys Fluent", "Aerospace Engineering"], "ISRO")
]

sap_updates = [
    ("SAP Analytics Cloud Executive Specialist", "Executive KPI overview dashboard integrating enterprise financials, supply chain metrics, and procurement analytics in SAP Analytics Cloud.", ["SAP S/4HANA", "SAP BW/BI", "Analytics Cloud", "FICO"], "Accenture"),
    ("Global Enterprise Data Warehousing Consultant", "Core data warehousing models and multi-dimensional calculation views aggregating multi-national transaction records.", ["SAP BW/BI", "HANA Modeling", "Data Warehousing", "SQL"], "Infosys"),
    ("SAP MM Supply Chain & Procurement Specialist", "End-to-end logistics tracking, automated purchase order generation, and inventory replenishment via SAP MM Procure-to-Pay.", ["SAP MM", "Supply Chain", "Procurement", "Inventory Management"], "Wipro"),
    ("SAP HANA In-Memory Database Administrator", "High-throughput in-memory calculation views and columnar database indexing powering sub-second transactional queries.", ["SAP S/4HANA", "HANA DB", "Columnar Storage", "BASIS"], "TCS"),
    ("SAP FICO Financial Accounting Consultant", "Universal Journal (ACDOCA) general ledger balancing, cost center accounting, and automated balance sheet reconciliation.", ["SAP FICO", "General Ledger", "ACDOCA", "Financial Accounting"], "Capgemini"),
    ("SAP Object-Oriented ABAP Developer", "Object-oriented ABAP programming, Core Data Services (CDS) views, and custom BAdI enhancement framework development.", ["ABAP", "CDS Views", "BAdI Enhancements", "OData Services"], "HCL Technologies"),
    ("SAP Fiori / SAPUI5 Enterprise App Developer", "Responsive SAPUI5 user interface customized for C-suite purchase approvals and sales order release workflows.", ["SAP Fiori", "SAPUI5", "OData", "Mobile ERP"], "Accenture"),
    ("SAP EWM Logistics & Warehouse Consultant", "Extended Warehouse Management (EWM) wave picking, bin allocation strategies, and RFID barcode integration.", ["SAP EWM", "Supply Chain", "Logistics", "SAP SD"], "Infosys"),
    ("SAP SuccessFactors Human Capital Specialist", "Employee performance management, payroll processing, and organizational talent succession workflows.", ["SuccessFactors", "HCM", "Cloud ERP", "Employee Central"], "Wipro"),
    ("SAP SD Sales Order & Pricing Consultant", "Sales quotation pricing procedures, credit limit monitoring, and billing document generation in SAP Sales & Distribution.", ["SAP SD", "Sales & Distribution", "Pricing Logic", "Billing"], "TCS"),
    ("SAP Manufacturing Execution (ME) Consultant", "Live production line monitoring and OEE dashboard connected via SAP Manufacturing Execution (ME).", ["SAP Manufacturing", "OEE Tracking", "Analytics", "S/4HANA"], "Capgemini")
]

plc_updates = [
    ("Siemens S7-1500 PLC Automation Engineer", "Siemens S7-1500 modular PLC rack with high-speed digital I/O slices, analog inputs, and 24V redundant DC power supplies.", ["Siemens TIA Portal", "PLC Programming", "Control Cabinet", "Industrial Wiring"], "Siemens"),
    ("SCADA & HMI Touch Interface Specialist", "Interactive multi-touch SCADA operator dashboard displaying real-time tank levels, motor currents, and alarm diagnostics.", ["SCADA", "HMI Design", "Alarm Logging", "Industrial IoT"], "Schneider Electric"),
    ("Allen-Bradley PAC Ladder Logic Engineer", "ControlLogix PAC system executing dual-redundant Ladder Logic programs for chemical batch mixing automation.", ["Allen-Bradley", "Studio 5000", "Ladder Logic", "PAC Control"], "Rockwell Automation"),
    ("Industrial Safety Relay & Wiring Engineer", "Hardwired emergency stop circuits, master control relays, and safety interlock wiring according to ISO 13849 standards.", ["Ladder Logic", "Safety Relay", "Relay Logic", "Electrical Schematic"], "Honeywell"),
    ("Electro-Pneumatic Actuator Automation Specialist", "Electro-pneumatic valve manifold controlling double-acting pneumatic cylinders with magnetic reed switch position feedback.", ["Pneumatics", "Actuators", "Sensors", "Automation"], "ABB India"),
    ("VFD Drive & Motor Control Engineer", "Siemens Sinamics VFD parameterization over PROFINET for closed-loop induction motor speed and torque regulation.", ["VFD", "Motor Control", "PROFINET", "Inverters"], "Siemens"),
    ("Automated Conveyor Indexing PLC Specialist", "Multi-station indexing conveyor synchronized via PLC encoder pulses and optical proximity detection sensors.", ["PLC Programming", "Conveyor Automation", "Encoders", "TIA Portal"], "Mitsubishi Electric"),
    ("PROFINET Industrial Fieldbus Architect", "Deterministic real-time industrial Ethernet fieldbus topology linking remote I/O islands, drives, and master PLCs.", ["PROFINET", "Fieldbus", "Industrial Networking", "EtherNet/IP"], "Schneider Electric"),
    ("Machine Safety & SIL 3 Interlock Engineer", "SIL 3 / PLe certified safety controller integrating laser area scanners, light curtains, and safety gate interlocks.", ["Safety Relay", "SIL 3 / PLe", "Machine Safety", "Interlocks"], "ABB India")
]

def apply_domain_updates(domain_key, updates_list):
    if domain_key not in app_data or "images" not in app_data[domain_key]:
        return
    images = app_data[domain_key]["images"]
    for i, img in enumerate(images):
        title, desc, skills, company = updates_list[i % len(updates_list)]
        img["title"] = title
        img["description"] = desc
        img["skills"] = skills
        img["company"] = company
        student_name = f"Student {i+1} ({domain_key.capitalize()})"
        offer_path = generate_svg_offer_letter(student_name, title, company, domain_key, i + 1)
        img["offerLetter"] = offer_path

apply_domain_updates("embedded", embedded_updates)
apply_domain_updates("mechanical", mechanical_updates)
apply_domain_updates("sap", sap_updates)
apply_domain_updates("plc", plc_updates)

with open(data_path, "w", encoding="utf-8") as f:
    json.dump(app_data, f, indent=2)

print("Data JSON & Offer Letter SVGs updated successfully!")
