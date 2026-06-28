"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

type Dimension = "energy" | "information" | "decision" | "structure";
type TradeId = "electrician" | "hvacr" | "facilities" | "maintenance" | "welder";
type ServiceId = "qsr" | "hotel" | "restaurant";

type WorkstyleChoice = {
  id: "A" | "B";
  text: string;
  feedback: string;
};

type WorkstyleScene = {
  id: string;
  dimension: Dimension;
  situation: string;
  prompt: string;
  choices: [WorkstyleChoice, WorkstyleChoice];
};

const dimensions = {
  energy: { a: "E", b: "R", aLabel: "Extraverted", bLabel: "Reflective" },
  information: { a: "P", b: "I", aLabel: "Practical", bLabel: "Imaginative" },
  decision: { a: "A", b: "H", aLabel: "Analytical", bLabel: "Harmonizing" },
  structure: { a: "S", b: "D", aLabel: "Structured", bLabel: "Dynamic" }
} as const;

const workstyleScenes: WorkstyleScene[] = [
  {
    id: "ws1",
    dimension: "energy",
    situation: "Your team is kicking off a new project with an open-ended brief.",
    prompt: "How do you start strongest?",
    choices: [
      { id: "A", text: "Call a fast working session and talk ideas out loud.", feedback: "You gain momentum through immediate collaboration and live discussion." },
      { id: "B", text: "Draft your initial plan solo before joining group discussion.", feedback: "You perform best with reflection time before broader collaboration." }
    ]
  },
  {
    id: "ws2",
    dimension: "energy",
    situation: "A major deadline just wrapped and the team is exhausted.",
    prompt: "What helps you reset?",
    choices: [
      { id: "A", text: "Debrief with teammates and capture lessons together.", feedback: "You recharge by processing experience with people in real time." },
      { id: "B", text: "Step away and review outcomes quietly on your own.", feedback: "You recharge through independent processing and focused reflection." }
    ]
  },
  {
    id: "ws3",
    dimension: "information",
    situation: "You are asked to improve a process that has recurring errors.",
    prompt: "What do you look at first?",
    choices: [
      { id: "A", text: "Current facts, metrics, and steps where errors happen.", feedback: "You prioritize concrete signals and immediate operational detail." },
      { id: "B", text: "Pattern-level causes and what the process could become.", feedback: "You prioritize pattern recognition and future-oriented redesign." }
    ]
  },
  {
    id: "ws4",
    dimension: "information",
    situation: "You need to onboard quickly to a new tool at work.",
    prompt: "Which approach fits you best?",
    choices: [
      { id: "A", text: "Follow practical examples and repeat tested workflows.", feedback: "You absorb information fastest through practical application." },
      { id: "B", text: "Learn the concept model first, then adapt the details.", feedback: "You absorb information by building a conceptual map first." }
    ]
  },
  {
    id: "ws5",
    dimension: "decision",
    situation: "Two strong candidates are tied for a critical role.",
    prompt: "How do you break the tie?",
    choices: [
      { id: "A", text: "Use clear criteria and documented performance evidence.", feedback: "You decide by objective standards and consistency." },
      { id: "B", text: "Choose based on team dynamics and people impact.", feedback: "You decide by human impact and relationship context." }
    ]
  },
  {
    id: "ws6",
    dimension: "decision",
    situation: "A teammate asks for blunt feedback on a poor handoff.",
    prompt: "What do you do?",
    choices: [
      { id: "A", text: "Give direct, specific feedback with measurable fixes.", feedback: "You prioritize clarity and directness in performance conversations." },
      { id: "B", text: "Frame feedback gently to protect trust first.", feedback: "You prioritize relationship safety while guiding improvement." }
    ]
  },
  {
    id: "ws7",
    dimension: "structure",
    situation: "A 3-week project has multiple dependencies and stakeholders.",
    prompt: "How do you manage execution?",
    choices: [
      { id: "A", text: "Set milestones, owners, and scheduled checkpoints.", feedback: "You perform best with structure, sequencing, and clear checkpoints." },
      { id: "B", text: "Keep priorities flexible and adapt as information changes.", feedback: "You perform best with adaptive planning and dynamic response." }
    ]
  },
  {
    id: "ws8",
    dimension: "structure",
    situation: "A client changes requirements two days before delivery.",
    prompt: "What is your default response?",
    choices: [
      { id: "A", text: "Stabilize scope and protect the original delivery plan.", feedback: "You protect execution quality through structured control." },
      { id: "B", text: "Reconfigure quickly and optimize around the new request.", feedback: "You lean into change and adjust rapidly under pressure." }
    ]
  }
];

const typeProfiles: Record<string, { title: string; summary: string; strengths: string[]; growth: string[] }> = {
  EPAS: {
    title: "Catalyst Organizer",
    summary: "You energize teams while staying practical, logical, and plan-driven.",
    strengths: ["Drives execution with momentum", "Keeps standards clear under pressure", "Turns discussions into decisions"],
    growth: ["Leave space for slower voices", "Recheck assumptions before finalizing"]
  },
  EPIH: {
    title: "People-Centered Builder",
    summary: "You combine practical delivery with strong relationship awareness and shared buy-in.",
    strengths: ["Builds trust quickly", "Translates ideas into actionable steps", "Stabilizes team morale"],
    growth: ["Balance harmony with hard trade-offs", "Use clearer decision criteria"]
  },
  RIAH: {
    title: "Insight Mentor",
    summary: "You reflect deeply, spot patterns, and make value-driven decisions with care.",
    strengths: ["Sees emerging opportunities", "Supports thoughtful team alignment", "Connects long-term goals to people impact"],
    growth: ["Share ideas earlier", "Convert insight into measurable milestones"]
  },
  RPAD: {
    title: "Adaptive Strategist",
    summary: "You stay grounded in facts while adapting quickly and making logic-based choices.",
    strengths: ["Strong in changing environments", "Makes clear calls with limited data", "Finds practical paths through ambiguity"],
    growth: ["Document decisions for others", "Pause to assess interpersonal impact"]
  }
};

const defaultProfile = {
  title: "Balanced Navigator",
  summary: "You show a mixed style across dimensions, which can be a major advantage in varied roles.",
  strengths: ["Adapts style to context", "Bridges different working preferences", "Learns quickly across environments"],
  growth: ["Define your default decision process", "Track where your best energy patterns appear"]
};

type TradeChoice = {
  label: "A" | "B" | "C" | "D";
  text: string;
  score: number;
  feedback: string;
};

type TradeScene = {
  id: string;
  situation: string;
  prompt: string;
  correctAnswer: "A" | "B" | "C" | "D";
  competency: string;
  choices: TradeChoice[];
};


const serviceAssessments: Record<ServiceId, { title: string; focus: string; scenes: TradeScene[]; nextActions: string[] }> = {
  qsr: {
    title: "Fast Food / QSR Crew",
    focus: "Drive-thru flow, food safety, allergen control, customer de-escalation, and fryer emergency response.",
    scenes: [
      { id: "qsr-1", situation: "It is the peak Friday lunch rush. The drive-thru timer is in the red, a customer at the window is screaming that their order is wrong, and the kitchen just ran out of crispy chicken tenders.", prompt: "How do you handle this?", correctAnswer: "B", competency: "Speed Optimization, Drive-Thru Dynamics, De-escalation", choices: [
        { label: "A", text: "Argue with the customer to prove the kitchen made what was on the receipt, then stop the drive-thru line until the chicken cooks.", score: 0, feedback: "Escalates conflict and freezes throughput during peak service." },
        { label: "B", text: "Apologize politely to the customer, hand them the correct items available, ask them to pull forward to a designated parking spot to keep the timer moving, and inform the kitchen lead of the exact chicken count needed.", score: 4, feedback: "Correct: de-escalates, protects drive-thru flow, and gives the kitchen an exact recovery count." },
        { label: "C", text: "Shut down the drive-thru window entirely and go help the kitchen drop more chicken into the fryers.", score: 1, feedback: "Under-scoped: kitchen help matters, but abandoning the window worsens the service bottleneck." },
        { label: "D", text: "Give the angry customer a full refund, tell them to leave the line, and ignore the missing food items for the next cars.", score: 0, feedback: "Does not solve the food shortage or protect upcoming orders from repeat failure." }
      ]},
      { id: "qsr-2", situation: "An assembly line worker accidentally drops a pair of regular meat tongs into the designated allergen-free/gluten-free prep station during a rush.", prompt: "What is the mandatory protocol?", correctAnswer: "B", competency: "Food Safety Compliance, Allergen Cross-Contamination", choices: [
        { label: "A", text: "Wipe the tongs quickly with a dry paper towel and put them back in the allergen station to keep speed up.", score: 0, feedback: "Unsafe: dry wiping does not remove allergen cross-contact risk." },
        { label: "B", text: "Stop production at that station immediately, remove the contaminated tongs for full washing/sanitizing, discard any potentially exposed food items, wash hands, and open a fresh, sanitized utensil.", score: 4, feedback: "Correct: stops the contaminated line, removes exposed items, and restarts with clean tools and hands." },
        { label: "C", text: "Ignore it unless a customer explicitly states they have a life-threatening, severe allergy.", score: 0, feedback: "Unsafe: allergen controls must be reliable before a guest discloses severity." },
        { label: "D", text: "Spray the tongs with chemical sanitizer right over the food line to clean them instantly.", score: 0, feedback: "Unsafe: chemicals over food create a new contamination hazard." }
      ]},
      { id: "qsr-3", situation: "While operating the deep fryer, the oil begins to smoke excessively, and a small flame ignites on the surface of the vat.", prompt: "What is your immediate response?", correctAnswer: "B", competency: "Emergency Preparedness, Class B Fire Suppression Protocol", choices: [
        { label: "A", text: "Pour a bucket of cold water directly onto the flaming oil to extinguish it quickly.", score: 0, feedback: "Dangerous: water can violently spread a grease fire." },
        { label: "B", text: "Turn off the fryer's heating element if safe, hit the automated kitchen hood Ansul fire suppression system switch, or smother it with a metal lid/baking soda—never water.", score: 4, feedback: "Correct: removes heat and uses appropriate grease-fire suppression methods." },
        { label: "C", text: "Run out of the store immediately without alerting the rest of the crew or the shift manager.", score: 0, feedback: "Unsafe: evacuation may be necessary, but the crew and manager must be alerted." },
        { label: "D", text: "Fan the flames with a cardboard box to try and blow the fire out before it reaches the filters.", score: 0, feedback: "Dangerous: airflow and cardboard can feed the flame." }
      ]}
    ],
    nextActions: ["Practice rush-hour pull-forward scripts that preserve speed and respect.", "Review allergen station reset steps before peak periods.", "Confirm where fryer shutoffs and hood suppression pulls are located."]
  },
  hotel: {
    title: "Hotel Front Desk / Guest Services",
    focus: "VIP recovery, guest safety, key-control discretion, quiet-hour enforcement, and documentation.",
    scenes: [
      { id: "hotel-1", situation: "An exhausted platinum-tier business traveler arrives at 11:30 PM. Due to a system glitch, the hotel is 100% full, and their reserved executive suite was accidentally given away.", prompt: "How do you de-escalate the situation?", correctAnswer: "B", competency: "VIP Retention, Service Recovery, Brand Protection", choices: [
        { label: "A", text: "Tell the guest there is nothing you can do because the system glitched, and suggest they look for another hotel down the street.", score: 0, feedback: "Fails service recovery and leaves the guest unsupported." },
        { label: "B", text: "Validate their frustration, offer a complimentary drink/snack, secure them a comparable room at a partner property nearby, pay for their Uber there, and assure them their next stay with you is free.", score: 4, feedback: "Correct: acknowledges the failure, solves lodging, covers transport, and protects loyalty." },
        { label: "C", text: "Hide in the back office until the guest gets tired of waiting at the desk and leaves.", score: 0, feedback: "Avoidance escalates the guest impact and brand risk." },
        { label: "D", text: "Offer to let them sleep on a couch in the main lobby at a slightly discounted rate.", score: 0, feedback: "Unprofessional and unsafe for a reserved-room failure." }
      ]},
      { id: "hotel-2", situation: "A well-dressed individual walks up to the front desk, claims they are staying in Room 304, and says they locked their keycard inside. They do not have their ID on them because it is up in the room.", prompt: "How do you proceed?", correctAnswer: "B", competency: "Guest Safety, Liability Prevention, Anti-Theft Protocol", choices: [
        { label: "A", text: "Hand them a new keycard immediately based on their polite demeanor to ensure excellent customer service.", score: 0, feedback: "Unsafe: demeanor is not identity verification." },
        { label: "B", text: "Escort the individual to Room 304 with a security guard or manager, require them to show the ID once the door is opened, and verify the name matches the system before handing over the room keys.", score: 4, feedback: "Correct: balances guest assistance with room-security verification." },
        { label: "C", text: "Tell them to wait in the lobby until the actual guest registered to the room comes back to claim them.", score: 1, feedback: "Safer than handing out keys, but may strand a legitimate guest without using available verification steps." },
        { label: "D", text: "Give them the master key so they can go get their ID and bring the master key back down to you.", score: 0, feedback: "Severe security breach: never release a master key to a guest." }
      ]},
      { id: "hotel-3", situation: "A guest calls down at 1:00 AM complaining bitterly about loud music and partying in the room directly next to theirs.", prompt: "What is the correct multi-step protocol?", correctAnswer: "B", competency: "Conflict Resolution, Asset Management, Operational Quiet Hours", choices: [
        { label: "A", text: "Call the offending room once; if they don't answer, tell the complaining guest to use earplugs or call the local police department yourself.", score: 1, feedback: "Incomplete: the hotel still owns quiet-hour enforcement and follow-up." },
        { label: "B", text: "Dispatch security or go yourself to knock on the loud room's door, issue a polite but firm warning regarding quiet hours, document the interaction, and follow up with the complaining guest to ensure the issue stopped.", score: 4, feedback: "Correct: addresses the source, documents the warning, and verifies recovery." },
        { label: "C", text: "Wait 30 minutes to see if the party winds down naturally before taking any administrative action.", score: 0, feedback: "Poor service recovery: the guest has already reported an active quiet-hours issue." },
        { label: "D", text: "Immediately evict the entire party from the hotel without giving them a warning first.", score: 1, feedback: "May become necessary after escalation, but the first response should warn and document unless immediate danger exists." }
      ]}
    ],
    nextActions: ["Rehearse overbooking recovery language and partner-property workflows.", "Review no-ID key replacement policy with security escalation paths.", "Practice quiet-hours documentation and guest follow-up."]
  },
  restaurant: {
    title: "Restaurant Server",
    focus: "Section triage, delay recovery, responsible alcohol service, and high-risk dietary communication.",
    scenes: [
      { id: "restaurant-1", situation: "You are running a 5-table section. Table 2 has been waiting 35 minutes for their entrees because the kitchen backed up, and they are visibly angry. Table 4 needs their check, and Table 5 just sat down and needs water.", prompt: "How do you prioritize?", correctAnswer: "B", competency: "Multi-Tasking, Section Management, Customer Triage", choices: [
        { label: "A", text: "Hide in the kitchen until Table 2's food is ready so you don't have to face their angry looks.", score: 0, feedback: "Avoidance lets multiple tables decline at once." },
        { label: "B", text: "Greet Table 5 quickly with water, drop Table 4's check on the way past, then stop at Table 2 to apologize sincerely, explain the delay, offer a free appetizer/round of drinks, and involve the manager.", score: 4, feedback: "Correct: batches tasks efficiently while prioritizing the highest-risk recovery table." },
        { label: "C", text: "Serve Table 5 their entire meal first because their food will cook faster than Table 2's delayed order.", score: 0, feedback: "Poor prioritization: it ignores delayed guests and a ready check request." },
        { label: "D", text: "Drop Table 4's check, ignore Table 5, and stand by the kitchen pass yelling at the line cooks to hurry up.", score: 0, feedback: "Escalates kitchen tension and neglects guest needs." }
      ]},
      { id: "restaurant-2", situation: "A customer at a booth has had three double-whiskeys in an hour. They are slurring their words, speaking loudly, and demanding a fourth drink. Their friends are encouraging them to keep going.", prompt: "How do you handle the cutoff?", correctAnswer: "B", competency: "Dram Shop Law Compliance, Professional Boundaries, Team Communication", choices: [
        { label: "A", text: "Serve the fourth drink anyway because their friends are paying for it and you want a good tip.", score: 0, feedback: "Unsafe and potentially illegal: visible intoxication requires cutoff." },
        { label: "B", text: "Politely but firmly inform the guest that you cannot legally serve them more alcohol, offer them water or a soft drink, notify your manager and the bartender immediately, and log the incident.", score: 4, feedback: "Correct: sets the boundary, offers alternatives, aligns the team, and documents the incident." },
        { label: "C", text: "Have another server slip the drink to the table secretly so you don't look like the bad guy.", score: 0, feedback: "Dangerous: evades responsible-service duties and creates liability." },
        { label: "D", text: "Loudly announce to the entire dining room that the customer is cut off for being too drunk.", score: 1, feedback: "The cutoff is right, but public shaming escalates conflict." }
      ]},
      { id: "restaurant-3", situation: "A guest informs you they have a severe, airborne peanut allergy. They want to order a salad that normally does not contain nuts, but is prepped in the same area as the peanut-butter desserts.", prompt: "What is your action?", correctAnswer: "B", competency: "High-Risk Allergen Mitigation, Kitchen-Front Communication", choices: [
        { label: "A", text: "Tell the guest the salad is safe because peanuts aren't listed in the ingredients, ignoring the prep station setup.", score: 0, feedback: "Unsafe: ingredient lists do not eliminate cross-contact risk." },
        { label: "B", text: "Alert the kitchen manager and line cooks immediately, verify if cross-contact can be 100% prevented, ensure fresh gloves and sanitized knives/boards are used, and double-check the plate before running it yourself.", score: 4, feedback: "Correct: escalates the allergy, verifies feasibility, and controls the plate handoff." },
        { label: "C", text: "Tell the guest to leave the restaurant because serving them is too much of a liability for your shift.", score: 0, feedback: "Unprofessional: communicate risk honestly and involve management rather than dismissing the guest." },
        { label: "D", text: "Serve the salad as normal and keep an EpiPen nearby just in case they have a reaction.", score: 0, feedback: "Unsafe: emergency response is not a substitute for prevention." }
      ]}
    ],
    nextActions: ["Practice section walks that batch greetings, checks, and recovery visits.", "Review alcohol cutoff scripts and manager/bartender notification standards.", "Build a kitchen-front allergy communication checklist."]
  }
};

const tradeAssessments: Record<TradeId, { title: string; focus: string; scenes: TradeScene[]; nextActions: string[] }> = {
  electrician: {
    title: "Commercial & Industrial Electrician",
    focus: "Industrial controls, electrical triage, safety integrity, and instrumentation-led troubleshooting.",
    scenes: [
      {
        id: "electrician-1",
        situation: "A manufacturing line is experiencing intermittent \"E-102 Comm Faults\" on an Allen-Bradley PLC system. The line shuts down randomly three to four times a shift, and the plant manager demands that you bypass the enclosure-door safety interlocks to observe the PLC while it runs.",
        prompt: "How do you respond?",
        correctAnswer: "B",
        competency: "Safety Integrity (LOTO), Diagnostic Logic (EMI vs. Component Swapping)",
        choices: [
          { label: "A", text: "Comply with the request but use insulated rubber gloves and standing mats while the enclosure door remains open.", score: 0, feedback: "Unsafe: PPE does not justify bypassing required guarding or interlocks." },
          { label: "B", text: "Refuse to bypass the safety interlocks, initiate a full Lockout/Tagout (LOTO) on the line, and systematically inspect the communication cable shield grounding and nearby VFD cable routing for electromagnetic interference (EMI).", score: 4, feedback: "Correct: protects personnel first, then diagnoses likely PLC communication/EMI causes." },
          { label: "C", text: "Temporarily jump out the safety interlock switch to save time, hook up a laptop to view the live ladder logic, and remove the jumper as soon as the issue occurs.", score: 0, feedback: "Dangerous: bypassing an interlock for speed creates unacceptable life-safety risk." },
          { label: "D", text: "Order a replacement PLC processor immediately, as communication faults always indicate a failing internal logic board.", score: 1, feedback: "Premature: component swapping skips safer, more likely network and EMI diagnostics." }
        ]
      },
      {
        id: "electrician-2",
        situation: "A 480V, 3-phase industrial motor driving a ventilation fan trips its thermal overload relay after 20 minutes of continuous operation. Voltage at the motor terminals is perfectly balanced.",
        prompt: "What is your next diagnostic step?",
        correctAnswer: "C",
        competency: "Electrical Triage (Amperage Balance, Mechanical Load Verification)",
        choices: [
          { label: "A", text: "Increase the dial setting on the thermal overload relay to prevent it from tripping under normal load.", score: 0, feedback: "Dangerous: changing protection before diagnosing load/current can damage equipment or create hazards." },
          { label: "B", text: "Disconnect the motor completely and replace it with a higher-horsepower unit to handle the load.", score: 1, feedback: "Premature: replacement decisions require current and mechanical-load evidence first." },
          { label: "C", text: "Clamp an ammeter onto each of the three phases to check for current imbalance or excessive current draw, and check the temperature of the bearings.", score: 4, feedback: "Correct: verifies electrical load and mechanical drag after balanced voltage is confirmed." },
          { label: "D", text: "Replace the thermal overload relay, as these mechanical devices are prone to losing calibration over time.", score: 1, feedback: "Possible later, but not the next best diagnostic without current/load data." }
        ]
      },
      {
        id: "electrician-3",
        situation: "While troubleshooting a commercial lighting circuit, a disconnected, de-energized wire reads 45 VAC on a standard high-impedance digital multimeter, even though it should read zero.",
        prompt: "What does this indicate and how do you confirm it?",
        correctAnswer: "B",
        competency: "High-Impedance Meter Limitations (Stray Capacitive Coupling vs. Hard Faults)",
        choices: [
          { label: "A", text: "The line has a dangerous short-circuit to a live structural beam; you must evacuate the floor immediately.", score: 1, feedback: "Overreaction: the symptom is more consistent with induced/ghost voltage than a structural short." },
          { label: "B", text: "This is stray ghost voltage caused by capacitive coupling from adjacent energized wires; confirm by testing the line with a low-impedance voltage tester (LoZ).", score: 4, feedback: "Correct: LoZ testing distinguishes induced voltage from a source that can deliver current." },
          { label: "C", text: "The digital multimeter is defective and needs recalibration; switch to a standard analog continuity tester.", score: 1, feedback: "Not the best conclusion: high-impedance meters commonly display ghost voltage." },
          { label: "D", text: "The neutral wire is completely open somewhere upstream, creating a dangerous floating ground circuit.", score: 1, feedback: "Possible in some faults, but this reading pattern first calls for LoZ confirmation." }
        ]
      }
    ],
    nextActions: [
      "Practice LOTO decision points for energized-equipment pressure scenarios.",
      "Review industrial controls troubleshooting for EMI, shielding, VFD routing, and PLC networks.",
      "Build meter-selection habits around current, voltage, and LoZ verification."
    ]
  },
  hvacr: {
    title: "Commercial HVAC/R Technician",
    focus: "Critical cooling response, refrigeration diagnostics, and heat-rejection system failures.",
    scenes: [
      {
        id: "hvacr-1",
        situation: "A healthcare data center is overheating after the primary CRAC compressor fails. The backup unit starts but rapidly cycles on low-pressure cutout while rack temperatures climb.",
        prompt: "What do you do?",
        correctAnswer: "B",
        competency: "Crisis Management, Thermodynamic Diagnostics (Superheat/Subcooling), EPA Compliance",
        choices: [
          { label: "A", text: "Disconnect the low-pressure cutout switch on the backup unit to force the compressor to stay running until the server room cools down.", score: 0, feedback: "Dangerous: bypassing a pressure safety can destroy equipment and violate safe operating practice." },
          { label: "B", text: "Hook up gauges to the backup unit to measure superheat and subcooling to identify a refrigerant leak or restricted expansion valve, while coordinating with facilities to deploy temporary spot-coolers or open exhaust dampeners.", score: 4, feedback: "Correct: pairs emergency temperature mitigation with proper refrigeration diagnostics." },
          { label: "C", text: "Immediately begin recovering the refrigerant from the failed primary unit to pump it directly into the backup unit.", score: 0, feedback: "Unsafe/noncompliant: refrigerant handling must follow proper recovery, diagnosis, and charging procedures." },
          { label: "D", text: "Advise the IT staff to manually shut down all servers immediately while you order a replacement compressor for the primary unit.", score: 1, feedback: "May become a contingency, but it skips backup-unit diagnosis and temporary cooling coordination." }
        ]
      },
      {
        id: "hvacr-2",
        situation: "A commercial walk-in freezer is holding around 40°F instead of 0°F. Manifold gauges show normal suction pressure, but evaporator superheat is exceptionally high at 32°F.",
        prompt: "What is the root cause?",
        correctAnswer: "C",
        competency: "Metering Device Operations (TXV failure modes)",
        choices: [
          { label: "A", text: "The system is heavily overcharged with refrigerant.", score: 1, feedback: "Less likely: high superheat indicates evaporator starvation, not a straightforward overcharge." },
          { label: "B", text: "The evaporator fan motor is running backward, reversing the airflow.", score: 1, feedback: "Airflow problems matter, but the high-superheat clue points more directly to metering/starvation." },
          { label: "C", text: "The thermostatic expansion valve (TXV) sensing bulb has lost its charge or the TXV is restricted, starving the evaporator.", score: 4, feedback: "Correct: excessive superheat with poor cooling indicates a starved evaporator/TXV issue." },
          { label: "D", text: "The condenser coils are severely blocked with dirt and debris, preventing heat rejection.", score: 1, feedback: "Condenser blockage usually drives high head pressure rather than isolated high evaporator superheat." }
        ]
      },
      {
        id: "hvacr-3",
        situation: "A water-cooled chiller trips on High Head Pressure every afternoon around 2:00 PM, but resets and runs normally in the morning and at night.",
        prompt: "Which maintenance failure is the most likely culprit?",
        correctAnswer: "A",
        competency: "Heat Rejection Systems (Condenser fouling and cooling tower dynamics)",
        choices: [
          { label: "A", text: "The cooling tower fan belt is slipping, or the tower water treatment has failed, leading to scale buildup in the condenser tubes.", score: 4, feedback: "Correct: afternoon heat load exposes weak heat rejection or condenser fouling." },
          { label: "B", text: "The main compressor oil level is low, causing internal mechanical friction to spike during the hottest part of the day.", score: 1, feedback: "Possible reliability issue, but not the most likely time-of-day high-head pattern." },
          { label: "C", text: "The evaporator barrel has a localized internal refrigerant leak that only expands under heavy thermal loads.", score: 0, feedback: "Unlikely and speculative compared with cooling tower/condenser heat-rejection faults." },
          { label: "D", text: "The building automation system is sending conflicting 0-10V signals to the electronic expansion valve.", score: 1, feedback: "Controls can cause issues, but high head at peak ambient points first to heat rejection." }
        ]
      }
    ],
    nextActions: ["Drill superheat/subcooling diagnosis with likely-fault mapping.", "Review low-pressure and high-pressure safety switch purpose before field overrides.", "Study cooling tower maintenance, water treatment, and condenser fouling symptoms."]
  },
  facilities: {
    title: "Facilities Manager / Engineer",
    focus: "Building-system triage, BAS network troubleshooting, lifecycle planning, and stakeholder communication.",
    scenes: [
      {
        id: "facilities-1",
        situation: "At 6:00 AM on a freezing morning, a 12-story corporate building loses its main boiler from a cracked heat exchanger. Ten minutes later, a domestic water line bursts on the 4th floor directly above the primary electrical riser room. Tenants arrive in two hours.",
        prompt: "What is your immediate course of action?",
        correctAnswer: "B",
        competency: "Asset Preservation Triage, Life Safety, Stakeholder Communication",
        choices: [
          { label: "A", text: "Call a mechanical contractor to repair the boiler, then head to the 4th floor with a mop bucket to contain the leak.", score: 1, feedback: "Under-scoped: water above an electrical riser requires immediate isolation and coordinated response." },
          { label: "B", text: "Shut off the main water isolation valve to stop the 4th-floor flood and protect the electrical riser room, deploy your maintenance staff to extract water, contact an emergency boiler service, and issue a building-wide advisory delay to tenants.", score: 4, feedback: "Correct: controls the active water/electrical threat while coordinating boiler and tenant response." },
          { label: "C", text: "Focus entirely on the boiler system first, because a building without heat will cause all other pipes to freeze and burst within an hour.", score: 1, feedback: "Heat matters, but ignoring active flooding above electrical infrastructure is poor triage." },
          { label: "D", text: "Evacuate the entire building immediately and call the local fire department to handle the electrical room hazard.", score: 2, feedback: "Escalation may be needed if energized equipment is compromised, but first isolate water and coordinate building response." }
        ]
      },
      {
        id: "facilities-2",
        situation: "The BAS suddenly loses communication with all VAV boxes on the 7th floor, causing dampers to fail-safe open and over-cool the entire floor.",
        prompt: "How do you methodically track down this network fault?",
        correctAnswer: "B",
        competency: "Serial Communication Loops (RS-485 Daisy Chaining / Token Ring troubleshooting)",
        choices: [
          { label: "A", text: "Replace the main BAS server software, as communication drops indicate an operating system corruption.", score: 0, feedback: "Premature: a floor-specific outage points toward field bus wiring/termination first." },
          { label: "B", text: "Walk the 7th-floor ceiling grid and look for physical damage or a loose termination resistor on the RS-485 MS/TP communication loop.", score: 4, feedback: "Correct: checks the shared field communication loop where a single break/termination fault can drop devices." },
          { label: "C", text: "Reset the main electrical breaker for the entire 7th floor to force the local controllers to power cycle.", score: 0, feedback: "Risky and disruptive: power cycling does not methodically isolate a communications fault." },
          { label: "D", text: "Replace the actuator motors on every single VAV box on that floor, as they have likely reached their end-of-life cycle.", score: 0, feedback: "Incorrect: simultaneous communication loss across all VAVs is not an actuator end-of-life pattern." }
        ]
      },
      {
        id: "facilities-3",
        situation: "Your annual capital budget is $150,000. A 25-year-old roof has localized leaks needing $20,000 in annual patch repairs. The main centrifugal chiller is 18 years old, uses obsolete R-22, and operates at 60% efficiency.",
        prompt: "How do you propose your budget to ownership?",
        correctAnswer: "B",
        competency: "Asset Lifecycle Management, ROI modeling, Sustainable Engineering",
        choices: [
          { label: "A", text: "Spend the entire $150,000 on a full roof replacement, because a leaking roof destroys all interior assets.", score: 2, feedback: "Protects the envelope, but ignores a major lifecycle and operating-cost risk in the chiller." },
          { label: "B", text: "Patch the roof for $20,000, allocate the remaining budget to engineer a modern, energy-efficient chiller replacement that will lower operational utility costs, and present an ROI analysis to ownership.", score: 4, feedback: "Correct: balances near-term risk control with lifecycle planning and ownership-ready ROI." },
          { label: "C", text: "Ignore both issues and save the cash in reserve in case an unexpected catastrophic structural failure occurs.", score: 0, feedback: "Poor asset management: known risks need planned mitigation." },
          { label: "D", text: "Retrofit the old chiller with a drop-in refrigerant without changing the oil, and use the rest of the money for aesthetic lobby upgrades to satisfy tenants.", score: 0, feedback: "Technically and strategically weak: cosmetic upgrades do not resolve core system risk." }
        ]
      }
    ],
    nextActions: ["Practice emergency triage maps for water, electrical, HVAC, and occupant communications.", "Review BAS MS/TP wiring, termination, and segmentation basics.", "Build a lifecycle-cost model that compares repair, replacement, energy savings, and risk exposure."]
  },
  maintenance: {
    title: "Industrial Maintenance Mechanic",
    focus: "Hydraulic diagnostics, predictive maintenance, and electro-mechanical isolation.",
    scenes: [
      {
        id: "maintenance-1",
        situation: "An automated pick-and-place robotic arm stops mid-cycle with an HMI Low Hydraulic System Pressure alarm. There are no puddles, drips, or visible external leaks anywhere around the machine.",
        prompt: "What do you investigate next?",
        correctAnswer: "B",
        competency: "Internal Hydraulic Flow Dynamics (Accumulators/Bypass circuits)",
        choices: [
          { label: "A", text: "Add five gallons of hydraulic fluid to the reservoir anyway to see if the pressure sensor resets.", score: 0, feedback: "Guesswork: adding fluid without evidence can overfill the system and misses internal bypass faults." },
          { label: "B", text: "Check for an internal bypass failure, such as a ruptured bladder inside the nitrogen gas accumulator or a stuck-open relief valve routing fluid directly back to the tank.", score: 4, feedback: "Correct: pressure can be lost internally without visible external leaks." },
          { label: "C", text: "Replace the main hydraulic pump, as a lack of external leaks means the pump gears have completely shattered internally.", score: 1, feedback: "Premature: pump failure is possible but internal bypass checks are a better next diagnostic." },
          { label: "D", text: "Swap out the main PLC input card, assuming a digital communication error is generating a fake pressure warning.", score: 1, feedback: "Possible only after verifying the hydraulic and sensor circuit evidence." }
        ]
      },
      {
        id: "maintenance-2",
        situation: "A high-speed CNC milling machine develops high-frequency vibration during cutting, causing poor surface finishes. Operators demand an expensive main spindle motor replacement.",
        prompt: "How do you verify the true cause?",
        correctAnswer: "B",
        competency: "Predictive Maintenance (Vibration Spectrum Analysis vs. Speculative Guesswork)",
        choices: [
          { label: "A", text: "Comply with the operators and order a new spindle motor to minimize machine downtime.", score: 1, feedback: "Premature: costly replacement should be driven by measured fault evidence." },
          { label: "B", text: "Use a vibration analyzer to measure the frequency spectrum, checking for specific bearing defect frequencies or mechanical unbalance, and verify the structural tightness of the machine mountings.", score: 4, feedback: "Correct: vibration analysis separates bearings, imbalance, looseness, and related causes." },
          { label: "C", text: "Pour heavy industrial dampening oil around the machine base to absorb the vibrations during high-speed runs.", score: 0, feedback: "Unsafe/ineffective: this masks symptoms and creates housekeeping hazards." },
          { label: "D", text: "Slow down the feed rate parameters in the CNC program to half-speed to mask the issue until the next scheduled annual shutdown.", score: 1, feedback: "May reduce symptoms but does not identify or correct the mechanical fault." }
        ]
      },
      {
        id: "maintenance-3",
        situation: "An automated press fails to extend its main cylinder. The electronic proportional valve receives a correct 4-20mA control signal from the PLC, but the valve spool refuses to move.",
        prompt: "What is your next technical step?",
        correctAnswer: "B",
        competency: "Proportional Control Loops, Mechanical/Electrical Isolation Diagnostics",
        choices: [
          { label: "A", text: "Hit the valve body with a dead-blow hammer to physically dislodge the internal spool mechanism.", score: 0, feedback: "Unsafe and uncontrolled: mechanical binding should be tested through proper overrides and inspection." },
          { label: "B", text: "Use a manual override pin (if equipped) to test for mechanical binding, check the internal coil resistance for an open circuit, and inspect the pilot-operated oil filtration screen for particulate clogging.", score: 4, feedback: "Correct: isolates mechanical, electrical coil, and contamination causes after command signal is verified." },
          { label: "C", text: "Rewire the PLC output to send 120V AC directly to the proportional valve to force it open.", score: 0, feedback: "Dangerous: incorrect voltage can destroy controls and create motion hazards." },
          { label: "D", text: "Replace the entire PLC chassis, as 4-20mA loop signals cannot be accurately verified without dedicated programming software.", score: 0, feedback: "Incorrect: the verified control signal shifts diagnosis to valve/coil/filtration mechanics." }
        ]
      }
    ],
    nextActions: ["Review hydraulic pressure-loss paths including relief valves, accumulators, pumps, and internal leakage.", "Practice interpreting vibration spectrum clues for bearings, imbalance, looseness, and resonance.", "Build a troubleshooting checklist that separates PLC command, coil health, spool motion, pilot oil, and filtration." ]
  },
  welder: {
    title: "Specialized Welder / Pipefitter",
    focus: "Metallurgy, pipe-welding technique, purge discipline, and code-compliant repair decisions.",
    scenes: [
      {
        id: "welder-1",
        situation: "You must repair a cracked weld on a heavy-wall chrome-moly alloy steam line in a power plant. A supervisor pressures you to skip pre-heating because the facility is losing money while the line is cold.",
        prompt: "What happens if you skip pre-heating?",
        correctAnswer: "B",
        competency: "Metallurgy, Pre-heat/Post-heat parameters, Code Compliance (ASME)",
        choices: [
          { label: "A", text: "The weld will look aesthetically rough but will maintain full structural integrity once it reaches operating steam temperatures.", score: 0, feedback: "Dangerous: appearance does not protect against brittle microstructure and cracking." },
          { label: "B", text: "The rapid cooling of the weld metal against the cold alloy base metal will create brittle martensite, causing the joint to crack instantly or fail the mandatory X-ray inspection.", score: 4, feedback: "Correct: chrome-moly repair requires controlled heat input to prevent brittle cracking and inspection failure." },
          { label: "C", text: "The shielding gas will fail to shield the puddle properly, leading to minor surface porosity that can easily be ground out later.", score: 1, feedback: "Not the key issue: preheat controls cooling rate and metallurgy, not simply shielding." },
          { label: "D", text: "The welding rod will stick to the joint repeatedly, making it impossible to strike or maintain a stable arc.", score: 1, feedback: "Arc starts are not the primary code/metallurgy risk of skipping preheat." }
        ]
      },
      {
        id: "welder-2",
        situation: "During an open-root pipe weld on heavy schedule carbon steel using SMAW with an E6010 electrode, you consistently burn through the edge and create an excessively wide, unmanageable keyhole.",
        prompt: "How do you correct this?",
        correctAnswer: "C",
        competency: "Puddle Manipulation, Heat Input Control, Joint Geometry Management",
        choices: [
          { label: "A", text: "Increase your welding amperage to force the metal to deposit faster across the gap.", score: 0, feedback: "Incorrect: more amperage worsens burn-through and keyhole growth." },
          { label: "B", text: "Switch to a thicker diameter E7018 low-hydrogen electrode and push it deep into the joint.", score: 1, feedback: "Wrong process adjustment for this root-pass issue and likely worsens access/control." },
          { label: "C", text: "Decrease your welding current (amperage), alter your rod angle to direct less heat into the root face, or utilize a whipping technique to allow the puddle to cool slightly between deposits.", score: 4, feedback: "Correct: reduces heat input and restores puddle/keyhole control." },
          { label: "D", text: "Weld over a temporary piece of copper backing material and leave it inside the pipe permanently.", score: 0, feedback: "Unacceptable: leaving backing inside process piping creates quality and service risks." }
        ]
      },
      {
        id: "welder-3",
        situation: "After a TIG (GTAW) weld on thin-wall stainless food-process pipe, the interior side of the joint has a dark, crusty, heavily oxidized texture resembling burnt sugar.",
        prompt: "What caused this failure and how do you prevent it on the next joint?",
        correctAnswer: "C",
        competency: "Exotic Material Purging, Atmospheric Contamination Prevention (Sugaring)",
        choices: [
          { label: "A", text: "The welding current was set too low, causing the filler rod to ball up inside the pipe joint.", score: 1, feedback: "Not the main failure mode: sugaring is oxidation on the backside of stainless welds." },
          { label: "B", text: "The stainless steel filler wire was contaminated with moisture; it must be baked in a rod oven prior to use.", score: 1, feedback: "Moisture control matters in some processes, but TIG stainless sugaring points to lack of purge." },
          { label: "C", text: "The back of the weld joint was exposed to atmospheric oxygen; prevent this by establishing a proper argon gas back-purge inside the pipe before and during welding.", score: 4, feedback: "Correct: stainless pipe welds need backside shielding to prevent oxidation/sugaring." },
          { label: "D", text: "The operator used an incorrect travel speed, dragging the torch away too quickly from the weld puddle.", score: 1, feedback: "Travel speed can affect shielding, but the interior oxidation is best prevented with a proper back purge." }
        ]
      }
    ],
    nextActions: ["Review preheat and post-weld heat-treatment purpose for alloy piping.", "Practice E6010 root-pass heat and keyhole control on coupons.", "Set up purge dams, oxygen control, and argon-flow checks before stainless process-pipe welding."]
  }
};

export default function AssessmentsPage() {
  const [workstyleIndex, setWorkstyleIndex] = useState(0);
  const [workstyleAnswers, setWorkstyleAnswers] = useState<Record<string, "A" | "B">>({});
  const [workstyleFeedback, setWorkstyleFeedback] = useState<string[]>([]);
  const [trade, setTrade] = useState<TradeId>("electrician");
  const [tradeRuns, setTradeRuns] = useState<Record<TradeId, { index: number; score: number; feedback: string[]; complete: boolean }>>({
    electrician: { index: 0, score: 0, feedback: [], complete: false },
    hvacr: { index: 0, score: 0, feedback: [], complete: false },
    facilities: { index: 0, score: 0, feedback: [], complete: false },
    maintenance: { index: 0, score: 0, feedback: [], complete: false },
    welder: { index: 0, score: 0, feedback: [], complete: false }
  });
  const [service, setService] = useState<ServiceId>("qsr");
  const [serviceRuns, setServiceRuns] = useState<Record<ServiceId, { index: number; score: number; feedback: string[]; complete: boolean }>>({
    qsr: { index: 0, score: 0, feedback: [], complete: false },
    hotel: { index: 0, score: 0, feedback: [], complete: false },
    restaurant: { index: 0, score: 0, feedback: [], complete: false }
  });

  const currentWorkstyle = workstyleScenes[workstyleIndex];
  const workstyleComplete = Object.keys(workstyleAnswers).length === workstyleScenes.length;
  const workstyleProgress = Math.round((Object.keys(workstyleAnswers).length / workstyleScenes.length) * 100);

  const workstyleResult = useMemo(() => {
    if (!workstyleComplete) return null;

    const scores: Record<Dimension, number> = {
      energy: 0,
      information: 0,
      decision: 0,
      structure: 0
    };

    workstyleScenes.forEach((scene) => {
      if (workstyleAnswers[scene.id] === "A") scores[scene.dimension] += 1;
      if (workstyleAnswers[scene.id] === "B") scores[scene.dimension] -= 1;
    });

    const letters = (Object.keys(scores) as Dimension[]).map((dimension) => (
      scores[dimension] >= 0 ? dimensions[dimension].a : dimensions[dimension].b
    ));
    const code = letters.join("");
    const profile = typeProfiles[code] ?? defaultProfile;

    const detail = (Object.keys(scores) as Dimension[]).map((dimension) => {
      const positive = scores[dimension] >= 0;
      return {
        dimension,
        label: positive ? dimensions[dimension].aLabel : dimensions[dimension].bLabel,
        strength: Math.min(Math.abs(scores[dimension]), 3),
        letter: positive ? dimensions[dimension].a : dimensions[dimension].b
      };
    });

    return { code, profile, detail };
  }, [workstyleAnswers, workstyleComplete]);

  function answerWorkstyle(choice: WorkstyleChoice) {
      setWorkstyleAnswers((currentAnswers) => ({ ...currentAnswers, [currentWorkstyle.id]: choice.id }));
      setWorkstyleFeedback((currentFeedback) => [...currentFeedback, choice.feedback]);
      if (workstyleIndex < workstyleScenes.length - 1) {
        setWorkstyleIndex((currentIndex) => currentIndex + 1);
      }
  }

  function previousWorkstyle() {
      setWorkstyleIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }

  function restartWorkstyle() {
      setWorkstyleAnswers({});
      setWorkstyleFeedback([]);
      setWorkstyleIndex(0);
  }

  function answerTrade(choice: TradeChoice) {
      setTradeRuns((currentRuns) => {
        const next = { ...currentRuns };
        const run = { ...next[trade] };
        run.score += choice.score;
        run.feedback = [...run.feedback, choice.feedback];

        const sceneCount = tradeAssessments[trade].scenes.length;
        if (run.index >= sceneCount - 1) {
          run.complete = true;
        } else {
          run.index += 1;
        }

        next[trade] = run;
        return next;
      });
  }

  function restartTrade() {
      setTradeRuns((currentRuns) => ({
        ...currentRuns,
        [trade]: { index: 0, score: 0, feedback: [], complete: false }
      }));
  }

  function answerService(choice: TradeChoice) {
      setServiceRuns((currentRuns) => {
        const next = { ...currentRuns };
        const run = { ...next[service] };
        run.score += choice.score;
        run.feedback = [...run.feedback, choice.feedback];

        const sceneCount = serviceAssessments[service].scenes.length;
        if (run.index >= sceneCount - 1) {
          run.complete = true;
        } else {
          run.index += 1;
        }

        next[service] = run;
        return next;
      });
  }

  function restartService() {
      setServiceRuns((currentRuns) => ({
        ...currentRuns,
        [service]: { index: 0, score: 0, feedback: [], complete: false }
      }));
  }

  const selectedTrade = tradeAssessments[trade];
  const selectedTradeRun = tradeRuns[trade];
  const currentTradeScene = selectedTrade.scenes[selectedTradeRun.index];
  const tradeMaxScore = selectedTrade.scenes.length * 4;
  const tradeScore = Math.round((selectedTradeRun.score / tradeMaxScore) * 100);
  const tradeProgress = Math.round(((selectedTradeRun.index + (selectedTradeRun.complete ? 1 : 0)) / selectedTrade.scenes.length) * 100);

  const tradeSummary = tradeScore >= 75
      ? "Strong starting readiness for this pathway."
      : tradeScore >= 55
        ? "Promising baseline with a few key growth areas."
      : "Early-stage readiness. Focus on fundamentals first.";

  const selectedService = serviceAssessments[service];
  const selectedServiceRun = serviceRuns[service];
  const currentServiceScene = selectedService.scenes[selectedServiceRun.index];
  const serviceMaxScore = selectedService.scenes.length * 4;
  const serviceScore = Math.round((selectedServiceRun.score / serviceMaxScore) * 100);
  const serviceProgress = Math.round(((selectedServiceRun.index + (selectedServiceRun.complete ? 1 : 0)) / selectedService.scenes.length) * 100);
  const serviceSummary = serviceScore >= 75
      ? "Strong starting readiness for this service pathway."
      : serviceScore >= 55
        ? "Promising service baseline with a few key growth areas."
      : "Early-stage service readiness. Focus on safety, communication, and escalation fundamentals first.";

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Questline</p>
        <h1>Trial Grounds</h1>
        <p>Roleplay trials for workstyle insight and trade-readiness coaching.</p>
      </section>

      <section className="fc-workspace-grid">
        <article className="fc-card fc-adventure-card">
          <div className="fc-card-header-row">
            <div>
              <p className="fc-eyebrow">Featured Trial</p>
              <h2>Service Recovery Constellation</h2>
            </div>
            <span className="fc-status-pill">Ready</span>
          </div>
          <p className="fc-muted">Navigate a tense client-support moment with empathy, policy accuracy, and clean escalation choices.</p>
          <div className="fc-inline-tags">
            <span>Communication</span>
            <span>Empathy</span>
            <span>Policy Awareness</span>
            <span>5-7 minutes</span>
          </div>
          <div className="fc-action-row">
            <Link className="fc-button" href="/assessments/service-recovery-constellation">Enter Trial</Link>
          </div>
        </article>
      </section>

      {!workstyleComplete && (
        <section className="fc-assessment-shell">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <h2>Workstyle Trial</h2>
              <span className="fc-muted">Scene {workstyleIndex + 1} of {workstyleScenes.length}</span>
            </div>
            <div className="progress"><div className="progress-bar" style={{ width: `${workstyleProgress}%` }} /></div>
            <article className="fc-roleplay-scene">
              <p className="fc-muted">{currentWorkstyle.situation}</p>
              <p className="fc-assessment-question">{currentWorkstyle.prompt}</p>
            </article>
            <div className="fc-assessment-options">
              {currentWorkstyle.choices.map((choice) => (
                <button className="fc-assessment-option" type="button" onClick={() => answerWorkstyle(choice)} key={choice.id}>{choice.text}</button>
              ))}
            </div>
            <div className="fc-action-row">
              <button className="fc-ghost-button" type="button" onClick={previousWorkstyle} disabled={workstyleIndex === 0}>Back</button>
            </div>
          </article>
        </section>
      )}

      {workstyleComplete && workstyleResult && (
        <section className="fc-assessment-shell">
          <div className="fc-assessment-result-grid">
            <article className="fc-card">
              <p className="fc-eyebrow">Assessment Result</p>
              <h2>{workstyleResult.profile.title}</h2>
              <p className="fc-type-pill">{workstyleResult.code}</p>
              <p className="fc-muted">{workstyleResult.profile.summary}</p>

              <h3>Dimension readout</h3>
              <div className="fc-type-detail-list">
                {workstyleResult.detail.map((item) => (
                  <div className="fc-type-detail-row" key={item.dimension}>
                    <span>{item.dimension}</span>
                    <strong>{item.letter} • {item.label}</strong>
                  </div>
                ))}
              </div>

              <h3>What your choices showed</h3>
              <ul className="fc-guidance-list">
                {workstyleFeedback.map((item, idx) => <li key={`${idx}-${item}`}>{item}</li>)}
              </ul>

              <div className="fc-action-row">
                <button className="fc-button" type="button" onClick={restartWorkstyle}>Replay Trial</button>
              </div>
            </article>

            <aside className="fc-card fc-side-card">
              <p className="fc-eyebrow">Strengths</p>
              <ul className="fc-guidance-list">
                {workstyleResult.profile.strengths.map((item) => <li key={item}>{item}</li>)}
              </ul>

              <p className="fc-eyebrow">Growth Suggestions</p>
              <ul className="fc-guidance-list">
                {workstyleResult.profile.growth.map((item) => <li key={item}>{item}</li>)}
                <li>Apply one insight to your Portfolio story and one to your next challenge run.</li>
              </ul>
            </aside>
          </div>
        </section>
      )}

      <section className="fc-trade-shell">
        <article className="fc-card">
          <div className="fc-card-header-row">
            <div>
              <p className="fc-eyebrow">Trade Trials</p>
              <h2>Trades Roleplay Trials</h2>
            </div>
            <span className="fc-muted">{selectedTradeRun.complete ? "Completed" : `Scene ${selectedTradeRun.index + 1} of ${selectedTrade.scenes.length}`}</span>
          </div>

          <div className="fc-trade-tabs" role="tablist" aria-label="Trade assessment paths">
            <button className={trade === "electrician" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("electrician")} type="button">Electrician</button>
            <button className={trade === "hvacr" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("hvacr")} type="button">HVAC/R</button>
            <button className={trade === "facilities" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("facilities")} type="button">Facilities</button>
            <button className={trade === "maintenance" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("maintenance")} type="button">Maintenance</button>
            <button className={trade === "welder" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("welder")} type="button">Welder/Pipefitter</button>
          </div>

          <p className="fc-muted">{selectedTrade.focus}</p>
          <div className="progress"><div className="progress-bar" style={{ width: `${tradeProgress}%` }} /></div>

          {!selectedTradeRun.complete && currentTradeScene && (
            <div className="fc-trade-list">
              <article className="fc-roleplay-scene">
                <p className="fc-muted">{currentTradeScene.situation}</p>
                <p className="fc-assessment-question">{currentTradeScene.prompt}</p>
              </article>
              <div className="fc-assessment-options">
                {currentTradeScene.choices.map((choice) => (
                  <button className="fc-assessment-option" type="button" key={choice.text} onClick={() => answerTrade(choice)}>
                    {choice.label}) {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTradeRun.complete && (
            <div className="fc-trade-list">
              <p className="fc-muted">Quiz complete. Review your score first, then compare against the answer key.</p>
              <h3>{tradeScore}% Readiness</h3>
              <p className="fc-muted">{tradeSummary}</p>
              <h3>What your choices showed</h3>
              <ul className="fc-guidance-list">
                {selectedTradeRun.feedback.map((item, idx) => <li key={`${idx}-${item}`}>{item}</li>)}
              </ul>
              <h3>Answer Key & Vetting Rubric</h3>
              <ul className="fc-guidance-list">
                {selectedTrade.scenes.map((scene, idx) => (
                  <li key={scene.id}>
                    <strong>Question {idx + 1}: {scene.correctAnswer}</strong> — {scene.competency}
                  </li>
                ))}
              </ul>
              <h3>Hiring Manager Grading Signals</h3>
              <ul className="fc-guidance-list">
                <li><strong>A+ candidate:</strong> Selects correct answers, prioritizes safety/code compliance over pressure, and isolates root cause with instrumentation rather than guessing.</li>
                <li><strong>B candidate:</strong> Resolves the technical issue but may miss communication, stakeholder management, or long-term efficiency implications.</li>
                <li><strong>Dangerous candidate:</strong> Chooses shortcuts that bypass safety features, code rules, or diagnostic metrics for a fast temporary fix.</li>
              </ul>
              <div className="fc-action-row">
                <button className="fc-button" type="button" onClick={restartTrade}>Retake {selectedTrade.title}</button>
              </div>
            </div>
          )}
        </article>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">{selectedTrade.title}</p>
          {selectedTradeRun.complete ? (
            <>
              <h3>{tradeScore}% Readiness</h3>
              <p className="fc-muted">{tradeSummary}</p>
            </>
          ) : (
            <>
              <h3>Score hidden until complete</h3>
              <p className="fc-muted">Answer keys and scoring details unlock after the final scenario.</p>
            </>
          )}
          <ul className="fc-guidance-list">
            {selectedTrade.nextActions.map((action) => <li key={action}>{action}</li>)}
          </ul>
        </aside>
      </section>

      <section className="fc-trade-shell">
        <article className="fc-card">
          <div className="fc-card-header-row">
            <div>
              <p className="fc-eyebrow">Service Industry Trials</p>
              <h2>Service Roleplay Trials</h2>
            </div>
            <span className="fc-muted">{selectedServiceRun.complete ? "Completed" : `Scene ${selectedServiceRun.index + 1} of ${selectedService.scenes.length}`}</span>
          </div>

          <div className="fc-trade-tabs" role="tablist" aria-label="Service industry assessment paths">
            <button className={service === "qsr" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setService("qsr")} type="button">Fast Food / QSR</button>
            <button className={service === "hotel" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setService("hotel")} type="button">Hotel Front Desk</button>
            <button className={service === "restaurant" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setService("restaurant")} type="button">Restaurant Server</button>
          </div>

          <p className="fc-muted">{selectedService.focus}</p>
          <div className="progress"><div className="progress-bar" style={{ width: `${serviceProgress}%` }} /></div>

          {!selectedServiceRun.complete && currentServiceScene && (
            <div className="fc-trade-list">
              <article className="fc-roleplay-scene">
                <p className="fc-muted">{currentServiceScene.situation}</p>
                <p className="fc-assessment-question">{currentServiceScene.prompt}</p>
              </article>
              <div className="fc-assessment-options">
                {currentServiceScene.choices.map((choice) => (
                  <button className="fc-assessment-option" type="button" key={choice.text} onClick={() => answerService(choice)}>
                    {choice.label}) {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedServiceRun.complete && (
            <div className="fc-trade-list">
              <p className="fc-muted">Quiz complete. Review your score first, then compare against the answer key.</p>
              <h3>{serviceScore}% Readiness</h3>
              <p className="fc-muted">{serviceSummary}</p>
              <h3>What your choices showed</h3>
              <ul className="fc-guidance-list">
                {selectedServiceRun.feedback.map((item, idx) => <li key={`${idx}-${item}`}>{item}</li>)}
              </ul>
              <h3>Answer Key & Vetting Rubric</h3>
              <ul className="fc-guidance-list">
                {selectedService.scenes.map((scene, idx) => (
                  <li key={scene.id}>
                    <strong>Question {idx + 1}: {scene.correctAnswer}</strong> — {scene.competency}
                  </li>
                ))}
              </ul>
              <h3>Hiring Manager Grading Signals</h3>
              <ul className="fc-guidance-list">
                <li><strong>A+ candidate:</strong> Selects correct answers, protects guest safety, communicates cleanly, and uses escalation or documentation at the right moment.</li>
                <li><strong>B candidate:</strong> Resolves the immediate guest issue but may miss operational flow, documentation, or cross-team communication.</li>
                <li><strong>Dangerous candidate:</strong> Chooses shortcuts that ignore food safety, guest security, responsible alcohol service, or emergency protocols.</li>
              </ul>
              <div className="fc-action-row">
                <button className="fc-button" type="button" onClick={restartService}>Retake {selectedService.title}</button>
              </div>
            </div>
          )}
        </article>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">{selectedService.title}</p>
          {selectedServiceRun.complete ? (
            <>
              <h3>{serviceScore}% Readiness</h3>
              <p className="fc-muted">{serviceSummary}</p>
            </>
          ) : (
            <>
              <h3>Score hidden until complete</h3>
              <p className="fc-muted">Answer keys and scoring details unlock after the final service scenario.</p>
            </>
          )}
          <ul className="fc-guidance-list">
            {selectedService.nextActions.map((action) => <li key={action}>{action}</li>)}
          </ul>
        </aside>
      </section>

    </div>
  );
}
