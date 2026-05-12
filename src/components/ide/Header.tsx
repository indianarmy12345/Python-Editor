import { Play, Square, RotateCcw, Database } from "lucide-react";
import { Link } from "react-router-dom";
import pythonLogo from "@/assets/python-logo.png";
import mysqlLogo from "@/assets/mysql-logo.svg";
import ThemeToggle from "@/components/ThemeToggle";
import FileMenu from "./FileMenu";
import type { EditorMode } from "./PythonIDE";

interface HeaderProps {
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  isRunning: boolean;
  code: string;
  onCodeChange: (code: string) => void;
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
}

const Header = ({ onRun, onStop, onClear, isRunning, code, onCodeChange, editorMode, onEditorModeChange }: HeaderProps) => {
  const isPython = editorMode === "python";
  return (
    <header className="ide-header px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img 
          src={isPython ? pythonLogo : mysqlLogo} 
          alt={isPython ? "Python Logo" : "MySQL Logo"}
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="python-logo-gradient">{isPython ? "PYTHON" : "MySQL"}</span>
            <span className="text-foreground ml-2">EDITOR</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            {isPython ? "Write, Run, and Learn Python in your browser" : "Write and edit MySQL queries in your browser"}
          </p>
        </div>
        <button
          onClick={() => onEditorModeChange(isPython ? "mysql" : "python")}
          className="ml-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
          title={`Switch to ${isPython ? "MySQL" : "Python"} Editor`}
        >
          {isPython ? <Database className="w-4 h-4" /> : <img src={pythonLogo} alt="" className="w-4 h-4" />}
          <span className="hidden sm:inline">{isPython ? "MySQL" : "Python"}</span>
        </button>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <FileMenu code={code} onCodeChange={onCodeChange} editorMode={editorMode} />
        <ThemeToggle />
        
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 rounded-md 
                     bg-secondary text-secondary-foreground hover:bg-secondary/80
                     transition-colors duration-200"
          title="Clear Console"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
        
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-6 py-2 rounded-md 
                       bg-destructive text-destructive-foreground hover:bg-destructive/90
                       font-semibold transition-all duration-200
                       shadow-lg shadow-destructive/20"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="run-button"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
