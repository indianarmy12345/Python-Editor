import { useRef, useEffect } from "react";
import { Terminal } from "lucide-react";

interface ConsoleOutput {
  type: "output" | "error" | "info";
  content: string;
  timestamp: Date;
}

interface ConsoleProps {
  outputs: ConsoleOutput[];
  isRunning: boolean;
}

const Console = ({ outputs, isRunning }: ConsoleProps) => {
  return (
    <div className="ide-console h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm">Console Output</span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Running...
          </span>
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-1">
        {outputs.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            Output will appear here when you run your code...
          </p>
        ) : (
          outputs.map((output, index) => (
            <div
              key={index}
              className={`font-mono text-sm leading-relaxed animate-fade-in ${
                output.type === "error"
                  ? "console-error"
                  : output.type === "info"
                  ? "text-accent"
                  : "console-output"
              }`}
            >
              {output.type === "error" && (
                <span className="text-destructive mr-2">❌</span>
              )}
              {output.type === "info" && (
                <span className="text-accent mr-2">ℹ️</span>
              )}
              <span className="whitespace-pre-wrap">{output.content}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Console;
export type { ConsoleOutput };
