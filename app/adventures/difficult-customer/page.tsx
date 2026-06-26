"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Skill = "Communication" | "Professionalism" | "Empathy" | "Conflict Resolution" | "Policy Awareness";
type Scores = Record<Skill, number>;
type Choice = {
  text: string;
  feedback: string;
  scores: Partial<Scores>;
  automaticFail?: boolean;
};
type Scene = {
  title: string;
  context: string;
  dialogue: string;
  choices: Choice[];
};

const skills: Skill[] = ["Communication", "Professionalism", "Empathy", "Conflict Resolution", "Policy Awareness"];

const scenes: Scene[] = [
  {
    title: "The Complaint",
    context: "You are working at the service counter. A customer approaches holding a receipt and a damaged appliance.",
    dialogue: "I bought this three days ago and it already stopped working. I have been standing here for ten minutes. I want my money back now.",
    choices: [
      {
        text: "I can see why that would be frustrating. Let me review the receipt and the item so I can find the quickest option available.",
        feedback: "You acknowledged the frustration and moved toward fact-finding without making a promise.",
        scores: { Communication: 4, Professionalism: 4, Empathy: 4, "Conflict Resolution": 3, "Policy Awareness": 3 }
      },
      {
        text: "You will need to calm down before I can help you.",
        feedback: "Setting boundaries can be appropriate, but this wording is likely to increase tension before any abusive behavior has occurred.",
        scores: { Communication: 1, Professionalism: 2, Empathy: 0, "Conflict Resolution": 1 }
      },
      {
        text: "That is not my fault. You should have bought a better model.",
        feedback: "The response is dismissive and insulting rather than solution-focused.",
        scores: { Communication: 0, Professionalism: 0, Empathy: 0, "Conflict Resolution": 0 },
        automaticFail: true
      }
    ]
  },
  {
    title: "Clarifying the Problem",
    context: "The receipt is valid. The customer says the appliance made a loud noise and shut off during normal use.",
    dialogue: "I only used it once. I do not have time to keep coming back here.",
    choices: [
      {
        text: "Thank you for explaining. Before we process anything, was anyone hurt or did the appliance smoke, spark, or damage anything nearby?",
        feedback: "You checked for an immediate safety issue before treating the matter as a routine return.",
        scores: { Communication: 3, Professionalism: 4, Empathy: 3, "Policy Awareness": 4 }
      },
      {
        text: "The receipt is valid, so I will refund it immediately without asking anything else.",
        feedback: "The response is efficient, but it skips a reasonable safety check and assumes authority before reviewing the return conditions.",
        scores: { Communication: 2, Professionalism: 2, Empathy: 2, "Policy Awareness": 1 }
      },
      {
        text: "You probably used it incorrectly. Tell me exactly what you did.",
        feedback: "Fact-finding is necessary, but accusatory wording makes cooperation less likely.",
        scores: { Communication: 1, Professionalism: 1, Empathy: 0, "Conflict Resolution": 1 }
      }
    ]
  },
  {
    title: "The Policy Limit",
    context: "Your store allows exchanges for this product at the service counter, but refunds over $100 require supervisor approval. The item cost $145.",
    dialogue: "I said I want a refund. Do not try to give me another broken one.",
    choices: [
      {
        text: "An exchange is available here, and a refund is possible with supervisor approval because of the purchase amount. I can contact the supervisor now and explain what we found.",
        feedback: "You explained the available paths accurately and offered a concrete next step within your authority.",
        scores: { Communication: 4, Professionalism: 4, Empathy: 3, "Conflict Resolution": 4, "Policy Awareness": 4 }
      },
      {
        text: "Fine. I will refund it even though I am not supposed to.",
        feedback: "Promising action outside your authority creates risk for the customer, employee, and business.",
        scores: { Communication: 1, Professionalism: 0, "Policy Awareness": 0 },
        automaticFail: true
      },
      {
        text: "Store policy says exchange only. There is nothing else I can do.",
        feedback: "This is inaccurate because supervisor review is available, and the response closes off a valid resolution path.",
        scores: { Communication: 1, Professionalism: 2, Empathy: 1, "Conflict Resolution": 0, "Policy Awareness": 0 }
      }
    ]
  },
  {
    title: "Escalation",
    context: "The supervisor is assisting another customer and may take several minutes. The customer raises their voice but does not threaten anyone.",
    dialogue: "This is ridiculous. Are you just trying to make me leave without my money?",
    choices: [
      {
        text: "No. I have documented the problem and requested the approval needed for the refund. The supervisor is occupied, but I will stay with the request and update you as soon as they are available.",
        feedback: "You corrected the misunderstanding, explained the delay, and preserved ownership of the issue.",
        scores: { Communication: 4, Professionalism: 4, Empathy: 3, "Conflict Resolution": 4, "Policy Awareness": 3 }
      },
      {
        text: "You can wait like everyone else, or you can leave.",
        feedback: "The response is needlessly adversarial and does not explain the process or provide reassurance.",
        scores: { Communication: 0, Professionalism: 1, Empathy: 0, "Conflict Resolution": 0 }
      },
      {
        text: "I promise the supervisor will approve it, so there is nothing to worry about.",
        feedback: "Reassurance is helpful, but guaranteeing another person's decision is outside your authority.",
        scores: { Communication: 2, Professionalism: 2, Empathy: 3, "Conflict Resolution": 2, "Policy Awareness": 1 }
      }
    ]
  },
  {
    title: "Resolution",
    context: "The supervisor approves the refund and asks you to finish the interaction. A product safety report also needs to be submitted.",
    dialogue: "Finally. Is that everything?",
    choices: [
      {
        text: "The refund is approved and will return to your original payment method. I am also documenting the product failure for safety review. Here is your confirmation, and I am sorry this took extra time.",
        feedback: "You closed the transaction clearly, explained the safety follow-up, and acknowledged the inconvenience without overpromising.",
        scores: { Communication: 4, Professionalism: 4, Empathy: 4, "Conflict Resolution": 4, "Policy Awareness": 4 }
      },
      {
        text: "Yes. Your refund is done.",
        feedback: "The basic task is complete, but the customer receives little explanation and the safety reporting step is not communicated.",
        scores: { Communication: 2, Professionalism: 3, Empathy: 1, "Conflict Resolution": 2, "Policy Awareness": 2 }
      },
      {
        text: "Yes, and next time you should be more patient.",
        feedback: "The final remark reopens conflict after the issue has been resolved.",
        scores: { Communication: 0, Professionalism: 0, Empathy: 0, "Conflict Resolution": 0 }
      }
    ]
  }
];

const emptyScores: Scores = {
  Communication: 0,
  Professionalism: 0,
  Empathy: 0,
  "Conflict Resolution": 0,
  "Policy Awareness": 0
};

export default function DifficultCustomerPage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [automaticFail, setAutomaticFail] = useState(false);
  const [complete, setComplete] = useState(false);

  const result = useMemo(() => {
    const maximum = scenes.length * 4;
    const percentages = skills.map((skill) => Math.round((scores[skill] / maximum) * 100));
    const overall = Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length);
    const developingInEverySkill = percentages.every((value) => value >= 50);
    return { percentages, overall, passed: !automaticFail && overall >= 70 && developingInEverySkill };
  }, [scores, automaticFail]);

  function choose(choice: Choice) {
    const updated = { ...scores };
    skills.forEach((skill) => {
      updated[skill] += choice.scores[skill] ?? 0;
    });
    setScores(updated);
    setFeedback((current) => [...current, choice.feedback]);
    if (choice.automaticFail) setAutomaticFail(true);

    if (sceneIndex === scenes.length - 1) {
      setComplete(true);
    } else {
      setSceneIndex((current) => current + 1);
    }
  }

  function restart() {
    setSceneIndex(0);
    setScores(emptyScores);
    setFeedback([]);
    setAutomaticFail(false);
    setComplete(false);
  }

  if (complete) {
    return (
      <section className="scenario-shell">
        <p className="eyebrow">Adventure Complete</p>
        <h1>{result.passed ? "Badge earned" : "Journey reviewed"}</h1>
        <div className="result-grid">
          <article className="card badge-preview">
            <div className="badge-seal">✦</div>
            <h3>Customer Service Foundations</h3>
            <div className="score">{result.overall}%</div>
            <p>{result.passed ? "Awarded" : "Not yet awarded"}</p>
            {automaticFail && <p className="muted">A prohibited response prevented badge eligibility.</p>}
          </article>
          <article className="card">
            <h2>Skill results</h2>
            {skills.map((skill, index) => (
              <div className="skill-row" key={skill}>
                <span>{skill}</span>
                <div className="skill-meter"><div className="skill-fill" style={{ width: `${result.percentages[index]}%` }} /></div>
                <strong>{result.percentages[index]}%</strong>
              </div>
            ))}
            <h3>What your choices showed</h3>
            <ul>
              {feedback.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
            </ul>
            <div className="actions">
              <button className="button button-dark" onClick={restart}>Try Again</button>
              <Link className="button" href="/profile">View Profile</Link>
            </div>
          </article>
        </div>
      </section>
    );
  }

  const scene = scenes[sceneIndex];
  const progress = Math.round(((sceneIndex + 1) / scenes.length) * 100);

  return (
    <section className="scenario-shell">
      <p className="eyebrow">The Difficult Customer</p>
      <p className="muted">Scene {sceneIndex + 1} of {scenes.length}</p>
      <div className="progress" aria-label={`${progress}% complete`}><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
      <article className="scene-card">
        <h1>{scene.title}</h1>
        <p>{scene.context}</p>
        <div className="npc">“{scene.dialogue}”</div>
        <h3>How do you respond?</h3>
        <div className="choice-list">
          {scene.choices.map((choice) => (
            <button className="choice" key={choice.text} onClick={() => choose(choice)}>{choice.text}</button>
          ))}
        </div>
      </article>
    </section>
  );
}
