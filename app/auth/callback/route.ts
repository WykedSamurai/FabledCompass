import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import {
  normalizeAccountType,
  normalizeHumanVerificationStatus,
  normalizeProfileVisibility
} from "../../../utils/account/types";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") || "/dashboard";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const errorUrl = new URL("/login", requestUrl.origin);
      errorUrl.searchParams.set("error", error.message);
      return NextResponse.redirect(errorUrl);
    }

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const currentAccountType = normalizeAccountType(userData.user.user_metadata.account_type);
      const currentVisibility = normalizeProfileVisibility(userData.user.user_metadata.profile_visibility);
      const currentVerification = normalizeHumanVerificationStatus(userData.user.user_metadata.human_verification_status);
      const hasAccountType = typeof userData.user.user_metadata.account_type === "string";
      const hasVisibility = typeof userData.user.user_metadata.profile_visibility === "string";
      const hasVerification = typeof userData.user.user_metadata.human_verification_status === "string";
      const baselineVerification = userData.user.email_confirmed_at ? "email_verified" : "unverified";
      const nextVerification =
        currentVerification === "human_verified"
          ? "human_verified"
          : baselineVerification;

      if (!hasAccountType || !hasVisibility || !hasVerification || currentVerification !== nextVerification) {
        await supabase.auth.updateUser({
          data: {
            ...userData.user.user_metadata,
            account_type: currentAccountType,
            profile_visibility: currentVisibility,
            human_verification_status: nextVerification
          }
        });
      }
    }
  }

  const redirectUrl = new URL(next, requestUrl.origin);
  return NextResponse.redirect(redirectUrl);
}
