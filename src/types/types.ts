export interface Message {
  id: number | string;
  role: "user" | "assistant" | "system";
  text: string;
}
