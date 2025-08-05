'use client';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { generateExponentialCode, generateLinearCode, generatePolynomialCode, generatePowerCode } from "@/actions/get-code-actions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Code, Clipboard } from "lucide-react";

interface GetCodeProps {
    name: string
    points: number[][];
    degree?: number
}

export function GetCode({ name, points, degree }: GetCodeProps) {
    const [copied, setCopied] = useState(false);

    let code = "";

    switch (name) {
        case "linear":
            code = generateLinearCode(points);
            break;
        case "polynomial":
            code = generatePolynomialCode(points, degree!);
            break;
        case "power":
            code = generatePowerCode(points);
            break;
        case "exponential":
            code = generateExponentialCode(points);
            break;
        // default:
        //   code = generateLinearCode(points);
        //   break;
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><Code className="mr-1" /> Get Code</Button>
            </DialogTrigger>

            <DialogContent className="max-w-none w-full sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-sm">Python</DialogTitle>
                    <DialogDescription>
                        <div className="relative mt-4 h-[70vh] max-w-[380px] lg:max-w-[850px] overflow-y-auto overflow-x-auto rounded-lg">
                            <SyntaxHighlighter
                                language="python"
                                style={dracula}
                                customStyle={{
                                    whiteSpace: 'pre',
                                    overflowX: 'auto',
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    borderRadius: '0.5rem',
                                }}
                            >
                                {code}
                            </SyntaxHighlighter>
                            <Button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 flex items-center gap-1 text-xs"
                                size="sm"
                                variant="secondary"
                            >
                                <Clipboard className="h-4 w-4" />
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

