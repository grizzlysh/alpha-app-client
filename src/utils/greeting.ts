type GreetingKey = "greetingMorning" | "greetingAfternoon" | "greetingEvening" | "greetingNight";

export function getGreetingKey(hour: number): GreetingKey {
  if (hour >= 5 && hour < 11) return "greetingMorning";
  if (hour >= 11 && hour < 15) return "greetingAfternoon";
  if (hour >= 15 && hour < 19) return "greetingEvening";
  return "greetingNight";
}
