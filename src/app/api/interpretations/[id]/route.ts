import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function fetchInterpretation(id: string) {
  try {
    const interpretation = await database.getDocument(
      "6878ebb60016140f52c1",
      "6878ec2a00166e4ee89c",
      id
    );
    return interpretation;
  } catch (error) {
    console.error("Error when fetching", error);
    throw new Error("Failed fetching interpretation");
  }
}

async function deleteInterpretation(id: string) {
  try {
    await database.deleteDocument(
      "6878ebb60016140f52c1",
      "6878ec2a00166e4ee89c",
      id
    );
  } catch (error) {
    console.error("Error when deleting the interpretation", error);
    throw new Error("Error to delete interpretation");
  }
}

async function updateInterpretation(
  id: string,
  data: {
    term: string;
    interpretation: string;
  }
) {
  try {
    await database.updateDocument(
      "6878ebb60016140f52c1",
      "6878ec2a00166e4ee89c",
      id,
      data
    );
  } catch (error) {
    console.error("Error when updating the interpretation", error);
    throw new Error("Error to update interpretation");
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // extracts ID from URL
    if (!id) throw new Error("No ID provided");

    const interpretation = await fetchInterpretation(id);
    return NextResponse.json({ interpretation });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interpretation" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // extracts ID from URL
    if (!id) throw new Error("No ID provided");

    await deleteInterpretation(id);
    return NextResponse.json({ message: "Interpretation deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete interpretation" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // extracts ID from URL
    if (!id) throw new Error("No ID provided");

    const data = await req.json();
    await updateInterpretation(id, data);
    return NextResponse.json({ message: "Interpretation updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update interpretation" },
      { status: 500 }
    );
  }
}
