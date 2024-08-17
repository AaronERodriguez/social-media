"use client"


import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ConvexError } from "convex/values";

function MyFallbackComponent({ error, resetErrorBoundary }: {error: ConvexError<any> | Error, resetErrorBoundary: any}) {

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Card role="alert" className="p-4 bg-destructive text-destructive-foreground flex flex-col gap-2">
                <p>Something went wrong: <span className="font-bold">{error instanceof ConvexError ? error.data : error.message}</span></p>
                <Link href={'/'}>
                    <Button onClick={resetErrorBoundary} className="bg-secondary text-secondary-foreground float-right">Go back</Button>
                </Link>
            </Card>
        </div>
  )
}

export default MyFallbackComponent