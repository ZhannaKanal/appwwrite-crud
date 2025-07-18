import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";
import { use } from "react";

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
    console.log("Error when fetching", error);
    throw new Error("Failed fetching interpretation");
  }
}

async function deleteInterpretation(id: string) {
  try {
    const response = await database.deleteDocument(
      "6878ebb60016140f52c1",
      "6878ec2a00166e4ee89c",
      id
    );
  } catch (error) {
    console.log("Error when deleting the interpretation", error);
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
    const response = await database.updateDocument(
      "6878ebb60016140f52c1",
      "6878ec2a00166e4ee89c",
      id,
      data
    );
  } catch (error) {
    console.log("Error when updating the interpretation", error);
    throw new Error("Error to update interpretation");
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = use(params);
    const interpretation = await fetchInterpretation(id);
    return NextResponse.json({ interpretation });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to interpretation",
      },
      {
        status: 500,
      }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = use(params);
    await deleteInterpretation(id);
    return NextResponse.json({ message: "Interpretation deleted" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete interpretation",
      },
      {
        status: 500,
      }
    );
  }
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = use(params);
    const interpretation = await req.json();
    await updateInterpretation(id, interpretation);
    return NextResponse.json({ message: "Interpretation updated" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update interpretation",
      },
      {
        status: 500,
      }
    );
  }
}
