export type Character = {
    id: number;
    name: string;
    bw: string;
    color: string;
    portrait: string;
    stats: {
      Power: number;
      Speed: number;
      Technique: number;
    };
  };
  