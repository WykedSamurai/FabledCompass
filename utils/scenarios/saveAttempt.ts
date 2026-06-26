import { createClient } from "../supabase/client";

export type ScenarioResultRecord = {
  overall: number;
  percentages: number[];
  passed: boolean;
  automaticFail: boolean;
};

export async function saveDifficultCustomerAttempt(result: ScenarioResultRecord) {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { saved: false, message: "Sign in to save this result and earn badges." };
  }

  const [communication, professionalism, empathy, conflictResolution, policyAwareness] = result.percentages;
  const { data: attempt, error: attemptError } = await supabase
    .from("scenario_attempts")
    .insert({
      user_id: authData.user.id,
      scenario_slug: "difficult-customer",
      scenario_version: 1,
      overall_score: result.overall,
      communication_score: communication,
      professionalism_score: professionalism,
      empathy_score: empathy,
      conflict_resolution_score: conflictResolution,
      policy_awareness_score: policyAwareness,
      passed: result.passed,
      automatic_fail: result.automaticFail
    })
    .select("id")
    .single();

  if (attemptError) {
    return { saved: false, message: attemptError.message };
  }

  if (result.passed) {
    const { data: definition, error: definitionError } = await supabase
      .from("scenario_badges")
      .select("id, badge_slug, badge_name, version")
      .eq("scenario_slug", "difficult-customer")
      .eq("version", 1)
      .single();

    if (definitionError || !definition) {
      return {
        saved: true,
        message: "Attempt saved, but the Customer Recovery badge definition is not installed yet."
      };
    }

    const { error: badgeError } = await supabase.from("user_badges").upsert(
      {
        user_id: authData.user.id,
        badge_definition_id: definition.id,
        attempt_id: attempt.id,
        overall_score: result.overall,
        badge_slug: definition.badge_slug,
        badge_name: definition.badge_name,
        source_scenario: "The Difficult Customer",
        badge_version: definition.version
      },
      { onConflict: "user_id,badge_slug,badge_version" }
    );

    if (badgeError) {
      return {
        saved: true,
        message: `Attempt saved, but the badge could not be stored: ${badgeError.message}`
      };
    }
  }

  return {
    saved: true,
    message: result.passed
      ? "Result saved and the Customer Recovery badge was added to your account."
      : "Result saved to your account."
  };
}
