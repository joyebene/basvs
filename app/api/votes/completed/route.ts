import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

export async function GET() {
  await connectDB();
  const elections = await Election.find({ status: "completed" });
  return Response.json(elections);
}
