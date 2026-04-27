import { useState, useEffect, useCallback, useRef } from "react";

export interface SQLResult {
  type: "table" | "message" | "error" | "info";
  columns?: string[];
  rows?: any[][];
  content?: string;
  timestamp: Date;
}

export const useSQLite = () => {
  const [db, setDb] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SQLResult[]>([]);
  const dbRef = useRef<any>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const initDB = useCallback(async () => {
    if (dbRef.current) return;
    if (initPromiseRef.current) {
      await initPromiseRef.current;
      return;
    }

    initPromiseRef.current = (async () => {
      setIsLoading(true);
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/sql.js@1.14.0/dist/${file}`,
        });
        const database = new SQL.Database();
        dbRef.current = database;
        setDb(database);
        setResults([
          {
            type: "info",
            content: "SQL environment ready! Tables persist during your session.",
            timestamp: new Date(),
          },
        ]);
      } catch (error: any) {
        setResults([
          {
            type: "error",
            content: `Failed to load SQL engine: ${error.message || error}`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    })();

    await initPromiseRef.current;
  }, []);

  // Initialize on mount
  useEffect(() => {
    initDB();
  }, [initDB]);

  const runSQL = useCallback(
    async (code: string) => {
      await initDB();
      const database = dbRef.current;
      if (!database || isRunning) return;

      setIsRunning(true);
      setResults((prev) => [
        ...prev,
        { type: "info", content: ">>> Running SQL...", timestamp: new Date() },
      ]);

      // Split by semicolons, filter empty/comment-only
      const statements = code
        .split(";")
        .map((s) => s.trim())
        .filter((s) => {
          const lines = s
            .split("\n")
            .filter((l) => l.trim() && !l.trim().startsWith("--"));
          return lines.length > 0;
        });

      // Translate common MySQL commands to SQLite equivalents
      const translateMySQL = (sql: string): string => {
        const trimmed = sql.trim();
        const upper = trimmed.toUpperCase();

        // DESCRIBE table / DESC table -> PRAGMA table_info(table)
        const describeMatch = trimmed.match(/^(DESCRIBE|DESC)\s+`?([a-zA-Z_][a-zA-Z0-9_]*)`?\s*$/i);
        if (describeMatch) {
          return `PRAGMA table_info(${describeMatch[2]})`;
        }

        // SHOW TABLES -> sqlite_master query
        if (/^SHOW\s+TABLES\s*$/i.test(trimmed)) {
          return `SELECT name AS Tables FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`;
        }

        // SHOW COLUMNS FROM table -> PRAGMA table_info(table)
        const showColsMatch = trimmed.match(/^SHOW\s+COLUMNS\s+(?:FROM|IN)\s+`?([a-zA-Z_][a-zA-Z0-9_]*)`?\s*$/i);
        if (showColsMatch) {
          return `PRAGMA table_info(${showColsMatch[1]})`;
        }

        // SHOW DATABASES -> single in-memory db info
        if (/^SHOW\s+DATABASES\s*$/i.test(trimmed)) {
          return `SELECT 'main' AS Database`;
        }

        // SHOW CREATE TABLE table -> sqlite_master sql
        const showCreateMatch = trimmed.match(/^SHOW\s+CREATE\s+TABLE\s+`?([a-zA-Z_][a-zA-Z0-9_]*)`?\s*$/i);
        if (showCreateMatch) {
          return `SELECT name AS "Table", sql AS "Create Table" FROM sqlite_master WHERE type='table' AND name='${showCreateMatch[1]}'`;
        }

        return sql;
      };

      for (const stmt of statements) {
        const cleanLines = stmt
          .split("\n")
          .filter((l) => l.trim() && !l.trim().startsWith("--"));
        const clean = cleanLines.join("\n").trim();
        if (!clean) continue;

        const translated = translateMySQL(clean);

        try {
          const res = database.exec(translated);
          const upper = translated.toUpperCase();

          if (
            res.length > 0 &&
            (upper.startsWith("SELECT") ||
              upper.startsWith("PRAGMA") ||
              upper.startsWith("SHOW"))
          ) {
            for (const table of res) {
              setResults((prev) => [
                ...prev,
                {
                  type: "table",
                  columns: table.columns,
                  rows: table.values,
                  timestamp: new Date(),
                },
              ]);
            }
          } else {
            const changes = database.getRowsModified();
            setResults((prev) => [
              ...prev,
              {
                type: "message",
                content: `Query OK${changes > 0 ? `, ${changes} row(s) affected` : ""}`,
                timestamp: new Date(),
              },
            ]);
          }
        } catch (err: any) {
          setResults((prev) => [
            ...prev,
            {
              type: "error",
              content: `SQL Error: ${err.message || err}`,
              timestamp: new Date(),
            },
          ]);
        }
      }

      setIsRunning(false);
    },
    [isRunning, initDB]
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const stopExecution = useCallback(() => {
    setIsRunning(false);
    setResults((prev) => [
      ...prev,
      { type: "info", content: "Execution stopped.", timestamp: new Date() },
    ]);
  }, []);

  return {
    db,
    isLoading,
    isRunning,
    results,
    runSQL,
    clearResults,
    stopExecution,
  };
};
