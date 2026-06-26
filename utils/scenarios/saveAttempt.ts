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
  const { error: attemptError } = await supabase.from("scenario_attempts").insert({
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
  });

  if (attemptError) {
    return { saved: false, message: attemptError.message };
  }

  if (result.passed) {
    const { error: badgeError } = await supabase.from("user_badges").upsert(
      {
        user_id: authData.user.id,
        badge_slug: "customer-service-foundations",
        badge_name: "Customer Service Foundations",
        source_scenario: "The Difficult Customer",
        badge_version: 1
      },
      { onConflict: "user_id,badge_slug,badge_version", ignoreDuplicates: true }
    );

    if (badgeError) {
      return { saved: true, message: `Attempt saved, but the badge could not be stored: ${badgeError.message}` };
    }
  }

  return {
    saved: true,
    message: result.passed ? "Result saved and badge added to your account." : "Result saved to your account."
  };
}
