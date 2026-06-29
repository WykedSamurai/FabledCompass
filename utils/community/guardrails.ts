export function formatCommunityGuardrail(rawMessage: string): string {
  const message = rawMessage.trim();
  const lower = message.toLowerCase();

  if (lower.includes("only verified people can create rooms")) {
    return "Only verified people can create rooms. Verify your account in Navigator Center first.";
  }

  if (lower.includes("only verified people can join rooms")) {
    return "Only verified people can join rooms. Verify your account in Navigator Center first.";
  }

  if (lower.includes("only verified people can send messages")) {
    return "Only verified people can send messages in rooms. Verify your account in Navigator Center first.";
  }

  if (lower.includes("only verified people can start direct messages")) {
    return "Only verified people can start direct messages. Verify your account in Navigator Center first.";
  }

  if (lower.includes("room is full")) {
    return "This room is full right now. Choose a different room or try again later.";
  }

  if (lower.includes("join the room before sending messages")) {
    return "Join this room before sending messages.";
  }

  if (lower.includes("authentication required") || lower.includes("sign in required")) {
    return "Sign in is required to continue.";
  }

  return message;
}
