"use client";

import { useMemo, useState } from "react";
import PrototypeWatermark from "../../components/layout/PrototypeWatermark";

type Dimension = "energy" | "information" | "decision" | "structure";
type TradeId = "carpenter" | "electrician" | "plumber";

type Question = {
  id: string;
  dimension: Dimension;
  prompt: string;
  optionA: string;
  optionB: string;
};

const dimensions = {
  energy: { a: "E", b: "R", aLabel: "Extraverted", bLabel: "Reflective" },
  information: { a: "P", b: "I", aLabel: "Practical", bLabel: "Imaginative" },
  decision: { a: "A", b: "H", aLabel: "Analytical", bLabel: "Harmonizing" },
  structure: { a: "S", b: "D", aLabel: "Structured", bLabel: "Dynamic" }
} as const;

const questions: Question[] = [
  { id: "q1", dimension: "energy", prompt: "After a full workday, what restores you faster?", optionA: "Talking through ideas with people", optionB: "Quiet time to reset and reflect" },
  { id: "q2", dimension: "energy", prompt: "In team meetings, you are usually the one who...", optionA: "Starts discussion and speaks early", optionB: "Listens first, then contributes" },
  { id: "q3", dimension: "energy", prompt: "When starting something new, you prefer to...", optionA: "Collaborate live and iterate with others", optionB: "Think it through before sharing" },
  { id: "q4", dimension: "information", prompt: "When learning a new skill, you rely most on...", optionA: "Clear examples and concrete steps", optionB: "Big-picture concepts and patterns" },
  { id: "q5", dimension: "information", prompt: "You are more interested in...", optionA: "What works today", optionB: "What could work tomorrow" },
  { id: "q6", dimension: "information", prompt: "During planning, your first instinct is to...", optionA: "Check available facts and constraints", optionB: "Explore possibilities before narrowing" },
  { id: "q7", dimension: "decision", prompt: "In difficult choices, you lead with...", optionA: "Objective criteria and consistency", optionB: "People impact and values" },
  { id: "q8", dimension: "decision", prompt: "Feedback is strongest when it is...", optionA: "Direct and specific", optionB: "Supportive and relational" },
  { id: "q9", dimension: "decision", prompt: "When mediating conflict, your priority is...", optionA: "Fair process and role clarity", optionB: "Alignment and mutual understanding" },
  { id: "q10", dimension: "structure", prompt: "Your best workflow usually looks like...", optionA: "Planned milestones and checklists", optionB: "Flexible priorities that adapt quickly" },
  { id: "q11", dimension: "structure", prompt: "Deadlines are easiest when you...", optionA: "Finish early with a defined plan", optionB: "Work in bursts closer to delivery" },
  { id: "q12", dimension: "structure", prompt: "Unexpected change at work feels like...", optionA: "Risk to manage through tighter control", optionB: "Opportunity to adjust and improve" }
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

const tradeAssessments: Record<TradeId, { title: string; focus: string; questions: string[]; nextActions: string[] }> = {
  carpenter: {
    title: "Carpenter Readiness Check",
    focus: "Foundations, measurement accuracy, and safe tool workflow.",
    questions: [
      "I can read a tape measure to at least 1/16 inch accurately.",
      "I am comfortable interpreting basic framing or cut-list plans.",
      "I consistently apply PPE and saw safety practices.",
      "I can explain how to square and level a basic structure.",
      "I am prepared for physically demanding, all-weather work."
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
    questions: [
      "I understand lockout/tagout and electrical hazard basics.",
      "I can identify common components in residential circuits.",
      "I am willing to study local code and compliance requirements.",
      "I can follow a multistep diagnostic process calmly.",
      "I am comfortable working in crawlspaces, ladders, or tight areas."
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
    questions: [
      "I can identify basic water supply and drain system components.",
      "I understand why slope and venting matter in drainage systems.",
      "I can follow sanitary and safety procedures on service calls.",
      "I am comfortable diagnosing leaks methodically.",
      "I can communicate clearly with customers during repairs."
    ],
    nextActions: [
      "Practice pipe layout principles and fitting selection basics.",
      "Study drain/waste/vent fundamentals and code concepts.",
      "Run mock service-call scenarios focused on customer communication."
    ]
  }
};

export default function AssessmentsPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B">>({});
  const [trade, setTrade] = useState<TradeId>("carpenter");
  const [tradeAnswers, setTradeAnswers] = useState<Record<TradeId, Array<"yes" | "no" | null>>>({
    carpenter: Array.from({ length: tradeAssessments.carpenter.questions.length }, () => null),
    electrician: Array.from({ length: tradeAssessments.electrician.questions.length }, () => null),
    plumber: Array.from({ length: tradeAssessments.plumber.questions.length }, () => null)
  });

  const current = questions[index];
  const complete = Object.keys(answers).length === questions.length;
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

  const result = useMemo(() => {
    if (!complete) return null;

    const scores: Record<Dimension, number> = {
      energy: 0,
      information: 0,
      decision: 0,
      structure: 0
    };

    questions.forEach((question) => {
      if (answers[question.id] === "A") scores[question.dimension] += 1;
      if (answers[question.id] === "B") scores[question.dimension] -= 1;
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
  }, [answers, complete]);

  function answer(value: "A" | "B") {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: value }));
    if (index < questions.length - 1) {
      setIndex((currentIndex) => currentIndex + 1);
    }
  }

  function previous() {
    setIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }

  function restart() {
    setAnswers({});
    setIndex(0);
  }

  function answerTrade(questionIndex: number, value: "yes" | "no") {
    setTradeAnswers((currentAnswers) => {
      const next = { ...currentAnswers };
      const currentTrade = [...next[trade]];
      currentTrade[questionIndex] = value;
      next[trade] = currentTrade;
      return next;
    });
  }

  const selectedTrade = tradeAssessments[trade];
  const selectedTradeAnswers = tradeAnswers[trade];
  const tradeYesCount = selectedTradeAnswers.filter((value) => value === "yes").length;
  const tradeAnsweredCount = selectedTradeAnswers.filter((value) => value !== null).length;
  const tradeScore = Math.round((tradeYesCount / selectedTrade.questions.length) * 100);

  const tradeSummary = tradeScore >= 80
    ? "Strong starting readiness for this pathway."
    : tradeScore >= 60
      ? "Promising baseline with a few key growth areas."
      : "Early-stage readiness. Focus on fundamentals first.";

  return (
    <div className="fc-page-stack fc-workspace-page fc-prototype-frame">
      <PrototypeWatermark />
      <section className="fc-workspace-hero">
        <p className="fc-eyebrow">Adventure Journey</p>
        <h1>Personality Style Assessment</h1>
        <p>MBTI-style insight for how you work, decide, and collaborate in professional settings.</p>
      </section>

      {!complete && (
        <section className="fc-assessment-shell">
          <article className="fc-card">
            <div className="fc-card-header-row">
              <h2>Question {index + 1} of {questions.length}</h2>
              <span className="fc-muted">{progress}% complete</span>
            </div>
            <div className="progress"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
            <p className="fc-assessment-question">{current.prompt}</p>
            <div className="fc-assessment-options">
              <button className="fc-assessment-option" type="button" onClick={() => answer("A")}>{current.optionA}</button>
              <button className="fc-assessment-option" type="button" onClick={() => answer("B")}>{current.optionB}</button>
            </div>
            <div className="fc-action-row">
              <button className="fc-ghost-button" type="button" onClick={previous} disabled={index === 0}>Back</button>
            </div>
          </article>
        </section>
      )}

      {complete && result && (
        <section className="fc-assessment-shell">
          <div className="fc-assessment-result-grid">
            <article className="fc-card">
              <p className="fc-eyebrow">Assessment Result</p>
              <h2>{result.profile.title}</h2>
              <p className="fc-type-pill">{result.code}</p>
              <p className="fc-muted">{result.profile.summary}</p>

              <h3>Dimension readout</h3>
              <div className="fc-type-detail-list">
                {result.detail.map((item) => (
                  <div className="fc-type-detail-row" key={item.dimension}>
                    <span>{item.dimension}</span>
                    <strong>{item.letter} • {item.label}</strong>
                  </div>
                ))}
              </div>

              <div className="fc-action-row">
                <button className="fc-button" type="button" onClick={restart}>Retake Assessment</button>
              </div>
            </article>

            <aside className="fc-card fc-side-card">
              <p className="fc-eyebrow">Strengths</p>
              <ul className="fc-guidance-list">
                {result.profile.strengths.map((item) => <li key={item}>{item}</li>)}
              </ul>

              <p className="fc-eyebrow">Growth Suggestions</p>
              <ul className="fc-guidance-list">
                {result.profile.growth.map((item) => <li key={item}>{item}</li>)}
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
              <h2>Trades Pathway Checks</h2>
            </div>
            <span className="fc-muted">{tradeAnsweredCount}/{selectedTrade.questions.length} answered</span>
          </div>

          <div className="fc-trade-tabs" role="tablist" aria-label="Trade assessment paths">
            <button className={trade === "carpenter" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("carpenter")} type="button">Carpenter</button>
            <button className={trade === "electrician" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("electrician")} type="button">Electrician</button>
            <button className={trade === "plumber" ? "fc-trade-tab is-active" : "fc-trade-tab"} onClick={() => setTrade("plumber")} type="button">Plumber</button>
          </div>

          <p className="fc-muted">{selectedTrade.focus}</p>

          <div className="fc-trade-list">
            {selectedTrade.questions.map((question, questionIndex) => (
              <div className="fc-trade-item" key={`${trade}-${questionIndex}`}>
                <p>{question}</p>
                <div className="fc-trade-choice-row">
                  <button className={selectedTradeAnswers[questionIndex] === "yes" ? "fc-trade-choice is-active" : "fc-trade-choice"} type="button" onClick={() => answerTrade(questionIndex, "yes")}>Yes</button>
                  <button className={selectedTradeAnswers[questionIndex] === "no" ? "fc-trade-choice is-active" : "fc-trade-choice"} type="button" onClick={() => answerTrade(questionIndex, "no")}>No</button>
                </div>
              </div>
            ))}
          </div>
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
