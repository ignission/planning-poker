export interface Room {
  id: string;
  name: string;
  hostUserId: string;
  status: "waiting" | "finished";
}
