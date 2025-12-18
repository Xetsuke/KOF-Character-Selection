import type { Character } from "../../../shared/types/character";

const N = 21;

const NAMES = [
  "Kyo","Moe","Reiji","Terry","Andy","Mai","Leona","Ralf","Clark","Kim",
  "Choi","Chang","Athena","Kensou","Bao","Ryo","Yuri","Takuma","Iori","Jun","Miu",
];

// helpers
const profileTile = (n: number) =>
  `/characters/profile/tile${String(n).padStart(3, "0")}.png`;

const portraitTile = (n: number) =>
  `/characters/portrait/tile${String(n).padStart(3, "0")}.png`;

// stats (mock data)
const makeStats = (i: number) => ({
  Power: 60 + (i * 7) % 40,
  Speed: 60 + (i * 11) % 40,
  Technique: 60 + (i * 13) % 40,
});

export const CHARACTERS: Character[] = Array.from({ length: N }, (_, i) => ({
  id: i + 1,
  name: NAMES[i] ?? `Fighter ${i + 1}`,
  bw: profileTile(i),          // tile000..tile020
  color: profileTile(i + N),   // tile021..tile041
  portrait: portraitTile(i),
  stats: makeStats(i),
}));
