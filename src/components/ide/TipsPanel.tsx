import { Lightbulb, BookOpen, Keyboard, Zap, Database, Table, Search, Filter } from "lucide-react";
import type { EditorMode } from "./PythonIDE";

const pythonTips = [
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description: "Press Ctrl+Enter to run your code quickly",
  },
  {
    icon: Lightbulb,
    title: "Auto-completion",
    description: "Press Ctrl+Space to see code suggestions",
  },
  {
    icon: BookOpen,
    title: "Python Basics",
    description: "Use print() to display output in the console",
  },
  {
    icon: Zap,
    title: "Quick Tip",
    description: "Indent with 4 spaces for proper Python syntax",
  },
];

const sqlTips = [
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description: "Press Ctrl+Enter to execute your SQL query",
  },
  {
    icon: Database,
    title: "SQL Basics",
    description: "Use CREATE TABLE to define your data structure",
  },
  {
    icon: Table,
    title: "Table Operations",
    description: "INSERT INTO adds rows, SELECT queries data",
  },
  {
    icon: Filter,
    title: "Filtering Data",
    description: "Use WHERE clause to filter rows with conditions",
  },
  {
    icon: Search,
    title: "Joins",
    description: "JOIN tables to combine related data",
  },
  {
    icon: Zap,
    title: "Quick Tip",
    description: "End each SQL statement with a semicolon",
  },
];

interface TipsPanelProps {
  editorMode?: EditorMode;
}

const TipsPanel = ({ editorMode = "python" }: TipsPanelProps) => {
  const isPython = editorMode === "python";
  const tips = isPython ? pythonTips : sqlTips;
  
  return (
    <div className="ide-sidebar p-4 space-y-4 overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className={`w-5 h-5 ${isPython ? "text-python-yellow" : "text-blue-500"}`} />
        <h2 className="font-semibold text-foreground">{isPython ? "Python Tips" : "MySQL Tips"}</h2>
      </div>
      
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <div className="flex items-start gap-3">
              <tip.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-foreground">
                  {tip.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={`mt-6 p-4 rounded-lg border ${isPython ? "bg-primary/10 border-primary/20" : "bg-blue-500/10 border-blue-500/20"}`}>
        <h3 className={`font-medium text-sm mb-2 ${isPython ? "text-primary" : "text-blue-500"}`}>
          {isPython ? "🐍 Python in Browser" : "🗄️ SQL in Browser"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isPython 
            ? "This IDE uses Pyodide to run Python directly in your browser. No installation needed! Standard library included."
            : "This IDE uses SQLite to run SQL queries directly in your browser. Practice MySQL-compatible syntax without a server!"
          }
        </p>
      </div>
    </div>
  );
};

export default TipsPanel;
