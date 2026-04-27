import { Menu, Play, Square, RotateCcw, Database } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/ThemeToggle";
import FileMenu from "./FileMenu";
import TipsPanel from "./TipsPanel";
import pythonLogo from "@/assets/python-logo.png";
import mysqlLogo from "@/assets/mysql-logo.svg";
import type { EditorMode } from "./PythonIDE";

interface MobileNavProps {
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  isRunning: boolean;
  code: string;
  onCodeChange: (code: string) => void;
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
}

const MobileNav = ({
  onRun,
  onStop,
  onClear,
  isRunning,
  code,
  onCodeChange,
  editorMode,
  onEditorModeChange,
}: MobileNavProps) => {
  const isPython = editorMode === "python";
  return (
    <header className="ide-header px-3 py-2 flex items-center justify-between lg:hidden">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-secondary rounded-md transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle className="flex items-center gap-2">
                <img src={isPython ? pythonLogo : mysqlLogo} alt={isPython ? "Python" : "MySQL"} className="w-6 h-6" />
                <span>{isPython ? "Python" : "MySQL"} Editor</span>
              </SheetTitle>
            </SheetHeader>
            <div className="p-4 space-y-4">
              <button
                onClick={() => onEditorModeChange(isPython ? "mysql" : "python")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                {isPython ? <Database className="w-5 h-5" /> : <img src={pythonLogo} alt="" className="w-5 h-5" />}
                <span>Switch to {isPython ? "MySQL" : "Python"} Editor</span>
              </button>
              <div className="flex flex-col gap-2">
                <FileMenu code={code} onCodeChange={onCodeChange} editorMode={editorMode} />
                <ThemeToggle />
              </div>
            </div>
            <div className="border-t border-border">
              <TipsPanel editorMode={editorMode} />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          <img src={isPython ? pythonLogo : mysqlLogo} alt={isPython ? "Python" : "MySQL"} className="w-7 h-7" />
          <span className="font-bold text-sm">
            <span className="python-logo-gradient">{isPython ? "PY" : "SQL"}</span>
            <span className="text-foreground">EDITOR</span>
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onClear}
          className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          title="Clear Console"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold transition-all"
          >
            <Square className="w-4 h-4" />
            <span className="text-sm">Stop</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all shadow-lg shadow-primary/20"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm">Run</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default MobileNav;
