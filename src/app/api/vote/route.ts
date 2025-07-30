import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { ImageData } from "@/types/types";

const INDEX_PATH = path.join(process.cwd(), "src/data/imageIndex.json");

function updateElo(winner: number, loser: number, k = 32) {
  const expected = (a: number, b: number) => 1 / (1 + 10 ** ((b - a) / 400));
  return {
    newWinnerElo: winner + k * (1 - expected(winner, loser)),
    newLoserElo: loser + k * (0 - expected(loser, winner)),
  };
}

export async function POST(req: NextRequest) {
  const { winnerId, loserId } = await req.json();

  const index = JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));

  const winner = index.find((img: ImageData) => img.id === winnerId);
  const loser = index.find((img: ImageData) => img.id === loserId);

  if (!winner || !loser) {
    return NextResponse.json({ error: "Invalid image IDs" }, { status: 400 });
  }

  const { newWinnerElo, newLoserElo } = updateElo(winner.elo, loser.elo);

  winner.elo = newWinnerElo;
  loser.elo = newLoserElo;

  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));

  return NextResponse.json({ success: true });
}
