import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { normalizeAccountType, normalizeProfileVisibility } from "../../../utils/account/types";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/account";

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
      const hasAccountType = typeof userData.user.user_metadata.account_type === "string";
      const hasVisibility = typeof userData.user.user_metadata.profile_visibility === "string";

      if (!hasAccountType || !hasVisibility) {
        await supabase.auth.updateUser({
          data: {
            ...userData.user.user_metadata,
            account_type: currentAccountType,
            profile_visibility: currentVisibility
          }
        });
      }
    }
  }

  const redirectUrl = new URL(next, requestUrl.origin);
  return NextResponse.redirect(redirectUrl);
}
