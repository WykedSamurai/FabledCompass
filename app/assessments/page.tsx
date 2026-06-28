"use client";

import { useMemo, useState } from "react";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

type Dimension = "energy" | "information" | "decision" | "structure";
type TradeId = "carpenter" | "electrician" | "plumber";

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
  text: string;
  score: number;
  feedback: string;
};

type TradeScene = {
  id: string;
  situation: string;
  prompt: string;
  choices: TradeChoice[];
};

const tradeAssessments: Record<TradeId, { title: string; focus: string; scenes: TradeScene[]; nextActions: string[] }> = {
  carpenter: {
    title: "Carpenter Readiness Check",
    focus: "Foundations, measurement accuracy, and safe tool workflow.",
    scenes: [
      {
        id: "carpenter-1",
        situation: "You are cutting studs for a wall section and two cuts are off by nearly 1/8 inch.",
        prompt: "What do you do first?",
        choices: [
          { text: "Re-measure from reference marks and recut before assembly.", score: 4, feedback: "Strong precision-first response that prevents compounding errors." },
          { text: "Use the current cuts and adjust during framing.", score: 1, feedback: "Fast, but likely increases rework later." },
          { text: "Ask for guidance and verify measuring process with a lead.", score: 3, feedback: "Good quality/safety response with collaborative learning." }
        ]
      },
      {
        id: "carpenter-2",
        situation: "A new teammate reaches for a saw without eye protection.",
        prompt: "What is the right move?",
        choices: [
          { text: "Stop the task and enforce PPE before any cut begins.", score: 4, feedback: "Correct safety-first leadership response." },
          { text: "Let it go this time to keep schedule moving.", score: 0, feedback: "Unsafe decision that creates preventable risk." },
          { text: "Report it later and continue for now.", score: 1, feedback: "Acknowledges risk but delays immediate correction." }
        ]
      },
      {
        id: "carpenter-3",
        situation: "The frame is standing, but one corner appears out of square.",
        prompt: "What do you prioritize?",
        choices: [
          { text: "Check diagonals, correct alignment, then continue.", score: 4, feedback: "Excellent quality control and sequencing." },
          { text: "Proceed and hope finish work hides the issue.", score: 0, feedback: "Quality risk that can affect the full build." },
          { text: "Document the issue and escalate before proceeding.", score: 3, feedback: "Strong accountability and handoff behavior." }
        ]
      }
    ],
    nextActions: [
      "Practice measurement and marking drills daily for one week.",
      "Complete a starter framing and layout module.",
      "Shadow a working carpenter to observe real job-site workflow."
    ]
  },
  electrician: {
    title: "Electrician Readiness Check",
    focus: "Safety discipline, code awareness, and troubleshooting mindset.",
    scenes: [
      {
        id: "electrician-1",
        situation: "You are asked to inspect a panel with unclear labeling and unknown history.",
        prompt: "What is your first step?",
        choices: [
          { text: "Apply lockout/tagout and verify de-energized status before inspection.", score: 4, feedback: "Correct hazard-control procedure before any touchpoint." },
          { text: "Open panel first and evaluate risk visually.", score: 1, feedback: "Too risky without full control verification." },
          { text: "Wait for a supervisor to complete the full inspection.", score: 2, feedback: "Cautious, but misses proactive safety workflow ownership." }
        ]
      },
      {
        id: "electrician-2",
        situation: "A circuit keeps tripping after replacing one device.",
        prompt: "How do you proceed?",
        choices: [
          { text: "Follow a step-by-step diagnostic path and isolate variables.", score: 4, feedback: "Strong troubleshooting discipline and technical process control." },
          { text: "Swap random components until the issue stops.", score: 0, feedback: "Inefficient and unsafe troubleshooting pattern." },
          { text: "Reset breaker and monitor for recurrence.", score: 1, feedback: "Temporary relief without root-cause resolution." }
        ]
      },
      {
        id: "electrician-3",
        situation: "A client asks to bypass a code-required protection to save cost.",
        prompt: "What is the right response?",
        choices: [
          { text: "Decline and explain code/safety requirements with compliant options.", score: 4, feedback: "Excellent professionalism and compliance integrity." },
          { text: "Agree if the client signs a waiver.", score: 0, feedback: "Non-compliant and high-risk approach." },
          { text: "Delay answer and ask another teammate to decide.", score: 2, feedback: "Escalation can help, but ownership and clarity are needed." }
        ]
      }
    ],
    nextActions: [
      "Review core electrical safety standards and PPE expectations.",
      "Complete a beginner circuit and wiring fundamentals course.",
      "Build a study routine for code familiarity and exam prep."
    ]
  },
  plumber: {
    title: "Plumber Readiness Check",
    focus: "Systems thinking, hands-on installation, and service reliability.",
    scenes: [
      {
        id: "plumber-1",
        situation: "A kitchen sink drain repeatedly clogs after prior repairs.",
        prompt: "How do you approach the call?",
        choices: [
          { text: "Run a full diagnostic from fixture to branch line before recommending repair.", score: 4, feedback: "Strong root-cause approach and system-level thinking." },
          { text: "Apply a quick temporary fix to clear the immediate clog.", score: 1, feedback: "Fast, but likely recurrence without full diagnosis." },
          { text: "Suggest full replacement immediately without inspection.", score: 0, feedback: "Premature recommendation with limited evidence." }
        ]
      },
      {
        id: "plumber-2",
        situation: "You discover venting and slope concerns while evaluating an install.",
        prompt: "What do you do next?",
        choices: [
          { text: "Document findings and correct to code before closing work.", score: 4, feedback: "Correct quality and compliance response." },
          { text: "Continue install and let inspection catch issues later.", score: 0, feedback: "Avoidable rework and compliance risk." },
          { text: "Pause and verify code interpretation before proceeding.", score: 3, feedback: "Strong decision quality with controlled escalation." }
        ]
      },
      {
        id: "plumber-3",
        situation: "A frustrated homeowner wants immediate answers during a leak response.",
        prompt: "How do you communicate?",
        choices: [
          { text: "Explain the issue clearly, immediate containment, and next repair steps.", score: 4, feedback: "Excellent service communication under pressure." },
          { text: "Keep details minimal and start work without explanation.", score: 1, feedback: "Low trust and unclear expectation-setting." },
          { text: "Blame prior contractors for the issue.", score: 0, feedback: "Unprofessional framing that hurts client trust." }
        ]
      }
    ],
    nextActions: [
      "Practice pipe layout principles and fitting selection basics.",
      "Study drain/waste/vent fundamentals and code concepts.",
      "Run mock service-call scenarios focused on customer communication."
    ]
  }
};

export default function AssessmentsPage() {
  const [workstyleIndex, setWorkstyleIndex] = useState(0);
  const [workstyleAnswers, setWorkstyleAnswers] = useState<Record<string, "A" | "B">>({});
  const [workstyleFeedback, setWorkstyleFeedback] = useState<string[]>([]);
  const [trade, setTrade] = useState<TradeId>("carpenter");
  const [tradeRuns, setTradeRuns] = useState<Record<TradeId, { index: number; score: number; feedback: string[]; complete: boolean }>>({
    carpenter: { index: 0, score: 0, feedback: [], complete: false },
    electrician: { index: 0, score: 0, feedback: [], complete: false },
    plumber: { index: 0, score: 0, feedback: [], complete: false }
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

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Adventure Journey</p>
        <h1>Personality Style Assessment</h1>
        <p>Roleplay quiz assessments for workstyle insight and trade-readiness coaching.</p>
      </section>

      {!workstyleComplete && (
        <section className="fc-assessment-shell">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <h2>Workstyle Roleplay Quiz</h2>
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
                <button className="fc-button" type="button" onClick={restartWorkstyle}>Retake Assessment</button>
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
              <p className="fc-eyebrow">Basic Assessments</p>
              <h2>Trades Roleplay Quizzes</h2>
            </div>
            <span className="fc-muted">{selectedTradeRun.complete ? "Completed" : `Scene ${selectedTradeRun.index + 1} of ${selectedTrade.scenes.length}`}</span>
          </div>

          <div className="fc-trade-tabs" role="tablist" aria-label="Trade assessment paths">
            <button className={trade === "carpenter" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("carpenter")} type="button">Carpenter</button>
            <button className={trade === "electrician" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("electrician")} type="button">Electrician</button>
            <button className={trade === "plumber" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("plumber")} type="button">Plumber</button>
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
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTradeRun.complete && (
            <div className="fc-trade-list">
              <p className="fc-muted">Quiz complete. Review your feedback and next actions.</p>
              <ul className="fc-guidance-list">
                {selectedTradeRun.feedback.map((item, idx) => <li key={`${idx}-${item}`}>{item}</li>)}
              </ul>
              <div className="fc-action-row">
                <button className="fc-button" type="button" onClick={restartTrade}>Retake {selectedTrade.title}</button>
              </div>
            </div>
          )}
        </article>

        <aside className="fc-card fc-side-card">
          <p className="fc-eyebrow">{selectedTrade.title}</p>
          <h3>{tradeScore}% Readiness</h3>
          <p className="fc-muted">{tradeSummary}</p>
          <ul className="fc-guidance-list">
            {selectedTrade.nextActions.map((action) => <li key={action}>{action}</li>)}
          </ul>
        </aside>
      </section>
    </div>
  );
}
