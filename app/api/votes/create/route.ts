import Election from "@/models/Election";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  const election = await Election.create({
    ...data,
    candidates: data.candidates.map((c: string) => ({
      name: c,
      position: data.title,
    })),
    status: "ongoing",
  });

  return Response.json(election);
}
