"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Interpretations {
  $id: string;
  term: string;
  interpretation: string;
}

export default function Home() {
  const [interpretations, setInterpretations] = useState<Interpretations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterpretations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/interpretations");
        if (!response.ok) {
          throw new Error("Failed to fetch interpretations");
        }
        const data = await response.json();
        setInterpretations(data);
      } catch (error) {
        console.log("Error", error);
        setError("Failed to fetch");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterpretations();
  }, []);
  
  const handleDelete =  async(id:string) => {
    try {
      await fetch(`/api/interpretations/${id}`, { method: "DELETE" });
      setInterpretations((prevInterpretations)=>prevInterpretations?.filter((i)=>i.$id !==id))
    } catch (error) {
      setError("Failed to delete interpretation");
    }
  }

  return (
    <div>
      {error && <p className="py-[16px] text-[red]">{error}</p>}{" "}
      {isLoading ? (
        <p>Loading interpretations</p>
      ) : interpretations?.length > 0 ? (
        <div>
          {interpretations?.map((interpretation) => (
            <div
              key={interpretation.$id}
              className="border-b leading-8 rounded-[7px] p-[16px] my-[8px]"
            >
             <div className="text-[24px] font-bold">{interpretation.term}</div>
              <div className="text-[16px]">{interpretation.interpretation}</div>
              <div className="mt-[16px] flex justify-end gap-[4px] text-[16px]">
                <Link
                  href={`/edit/${interpretation.$id}`}
                  className="px-[16px] py-[8px] bg-[orange] no-underline text-[black] rounded-[7px] text-[16px]"
                >
                  Edit
                </Link>
                <button onClick={()=>handleDelete(interpretation.$id)} className="bg-[red] px-[16px] py-[8px] no-underline rounded-[7px] border-none text-[16px] text-[white]">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ): (<p>No interpretation found</p>)}
    </div>
  );
}
