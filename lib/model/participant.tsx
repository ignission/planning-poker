export interface Participant {
    id: string;
    name: string;
    point: number | null;
    voted: boolean;
}

export const Participant = (value: any): Participant => {
  const point = value.point !== undefined ? value.point : null;
  return {
    id: value.id,
    name: value.name,
    point: point,
    voted: point !== null,
  }
};
