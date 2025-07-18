import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function createInterpretation(data: {
  term: string;
  interpretation: string;
}) {
  try {
    const response = await database.createDocument(
      "6878ebb60016140f52c1",
      "6878ec2a00166e4ee89c",
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.log("error", error);
    throw new Error("failed to create interpretation");
  }
}
async function fetchInterpretation() {
  try {
    const response = await database.listDocuments(
      "6878ebb60016140f52c1",
      "6878ec2a00166e4ee89c",
      [Query.orderDesc("$createdAt")]
    );
    return response.documents;
  } catch (error) {
    console.log("error fetching", error);
    throw new Error("failed to fetch interpretation");
  }
}

export async function POST(req: Request) {
  try {
    const { term, interpretation } = await req.json();
    const data = { term, interpretation };
    const response = await createInterpretation(data);
    return NextResponse.json({ message: "Interpretation created" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create interpretation",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const interpretations = await fetchInterpretation();
    return NextResponse.json(interpretations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to interpretetion" },
      {
        status: 500,
      }
    );
  }
}
