import { useState, useEffect, useCallback, useRef } from "react";
import type { ConsoleOutput } from "@/components/ide/Console";

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<any>;
  }
}

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const loadPyodideScript = async () => {
      // Check if script already loaded
      if (window.loadPyodide) {
        try {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          });
          pyodideRef.current = py;
          setPyodide(py);
          setOutputs([
            {
              type: "info",
              content: "Python environment loaded successfully! Ready to code.",
              timestamp: new Date(),
            },
          ]);
        } catch (error) {
          setOutputs([
            {
              type: "error",
              content: `Failed to load Python: ${error}`,
              timestamp: new Date(),
            },
          ]);
        }
        setIsLoading(false);
        return;
      }

      // Load Pyodide script
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.async = true;

      script.onload = async () => {
        try {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          });
          pyodideRef.current = py;
          setPyodide(py);
          setOutputs([
            {
              type: "info",
              content: "Python environment loaded successfully! Ready to code.",
              timestamp: new Date(),
            },
          ]);
        } catch (error) {
          setOutputs([
            {
              type: "error",
              content: `Failed to load Python: ${error}`,
              timestamp: new Date(),
            },
          ]);
        }
        setIsLoading(false);
      };

      script.onerror = () => {
        setOutputs([
          {
            type: "error",
            content: "Failed to load Pyodide. Check your internet connection.",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadPyodideScript();
  }, []);

  // Map of user-facing package name -> { pyodide package name, import name }
  // Some packages can't run in the browser (need sockets/C libs); we shim them.
  const PACKAGE_ALIASES: Record<string, { install?: string; shim?: string; importName: string }> = {
    "mysql-connector-python": { shim: "mysql_connector", importName: "mysql.connector" },
    "mysql.connector": { shim: "mysql_connector", importName: "mysql.connector" },
    "mysql": { shim: "mysql_connector", importName: "mysql" },
    "pymysql": { shim: "pymysql", importName: "pymysql" },
    "sklearn": { install: "scikit-learn", importName: "sklearn" },
    "scikit-learn": { install: "scikit-learn", importName: "sklearn" },
    "cv2": { install: "opencv-python", importName: "cv2" },
    "PIL": { install: "Pillow", importName: "PIL" },
    "bs4": { install: "beautifulsoup4", importName: "bs4" },
    "yaml": { install: "pyyaml", importName: "yaml" },
  };

  // Install a browser-side shim that emulates mysql.connector / pymysql on top of sqlite3
  const installMysqlShim = useCallback(async (flavor: "mysql_connector" | "pymysql") => {
    const py = pyodideRef.current;
    if (!py) return;
    const moduleName = flavor === "mysql_connector" ? "mysql" : "pymysql";
    // sqlite3 is a Pyodide package that needs to be explicitly loaded
    try {
      await py.loadPackage("sqlite3");
    } catch {
      // ignore — may already be loaded or unavailable in this Pyodide build
    }
    const shimCode = `
import sys, types, sqlite3, builtins

if not hasattr(builtins, '_shared_sql_conn'):
    builtins._shared_sql_conn = sqlite3.connect(':memory:')

class _Cursor:
    def __init__(self, conn):
        self._cur = conn.cursor()
        self.lastrowid = None
        self.rowcount = -1
    def execute(self, query, params=None):
        # Translate %s placeholders (mysql) to ? (sqlite)
        if params is not None and '%s' in query:
            query = query.replace('%s', '?')
        if params is None:
            self._cur.execute(query)
        else:
            self._cur.execute(query, params)
        self.lastrowid = self._cur.lastrowid
        self.rowcount = self._cur.rowcount
        return self
    def executemany(self, query, seq):
        if '%s' in query:
            query = query.replace('%s', '?')
        self._cur.executemany(query, seq)
        self.rowcount = self._cur.rowcount
    def fetchone(self): return self._cur.fetchone()
    def fetchall(self): return self._cur.fetchall()
    def fetchmany(self, size=1): return self._cur.fetchmany(size)
    @property
    def description(self): return self._cur.description
    def close(self): self._cur.close()
    def __iter__(self): return iter(self._cur)

class _Connection:
    def __init__(self, **kwargs):
        self._conn = builtins._shared_sql_conn
        self._kwargs = kwargs
    def cursor(self, **kw): return _Cursor(self._conn)
    def commit(self): self._conn.commit()
    def rollback(self): self._conn.rollback()
    def close(self): pass
    def is_connected(self): return True
    def ping(self, **kw): return True

def connect(*args, **kwargs):
    print("⚠️  Using in-browser SQLite shim for MySQL (real MySQL servers can't be reached from the browser).")
    return _Connection(**kwargs)

class Error(Exception): pass
class DatabaseError(Error): pass
class IntegrityError(DatabaseError): pass
class ProgrammingError(DatabaseError): pass
class OperationalError(DatabaseError): pass

if "${flavor}" == "mysql_connector":
    mysql_mod = types.ModuleType("mysql")
    connector_mod = types.ModuleType("mysql.connector")
    connector_mod.connect = connect
    connector_mod.Error = Error
    connector_mod.DatabaseError = DatabaseError
    connector_mod.IntegrityError = IntegrityError
    connector_mod.ProgrammingError = ProgrammingError
    connector_mod.OperationalError = OperationalError
    mysql_mod.connector = connector_mod
    sys.modules["mysql"] = mysql_mod
    sys.modules["mysql.connector"] = connector_mod
else:
    pymysql_mod = types.ModuleType("pymysql")
    pymysql_mod.connect = connect
    pymysql_mod.Error = Error
    pymysql_mod.DatabaseError = DatabaseError
    pymysql_mod.IntegrityError = IntegrityError
    pymysql_mod.ProgrammingError = ProgrammingError
    pymysql_mod.OperationalError = OperationalError
    sys.modules["pymysql"] = pymysql_mod
`;
    py.runPython(shimCode);
    setOutputs((prev) => [
      ...prev,
      { type: "info", content: `✅ Loaded ${moduleName} (browser SQLite shim)`, timestamp: new Date() },
    ]);
  }, []);

  // Run an explicit pip-style install command. Returns true if the line was a pip command.
  const runPipCommand = useCallback(async (line: string): Promise<boolean> => {
    const py = pyodideRef.current;
    if (!py) return false;
    // Match: pip install x, pip3 install x, !pip install x, %pip install x, python -m pip install x
    const m = line.match(/^\s*(?:!|%)?\s*(?:python\s+-m\s+)?pip[0-9]*\s+install\s+(.+?)\s*$/);
    if (!m) return false;
    // Strip flags, keep package names
    const pkgs = m[1]
      .split(/\s+/)
      .filter((p) => p && !p.startsWith("-"));
    if (pkgs.length === 0) return true;

    await py.loadPackage("micropip");
    const micropip = py.pyimport("micropip");

    for (const rawPkg of pkgs) {
      const pkg = rawPkg.replace(/[<>=!~].*$/, "").trim(); // strip version specifiers
      const alias = PACKAGE_ALIASES[pkg];
      setOutputs((prev) => [
        ...prev,
        { type: "info", content: `📦 pip install ${rawPkg}...`, timestamp: new Date() },
      ]);
      try {
        if (alias?.shim) {
          await installMysqlShim(alias.shim as "mysql_connector" | "pymysql");
          continue;
        }
        const installName = alias?.install || pkg;
        await micropip.install(installName);
        setOutputs((prev) => [
          ...prev,
          { type: "info", content: `✅ Successfully installed ${pkg}`, timestamp: new Date() },
        ]);
      } catch (err: any) {
        setOutputs((prev) => [
          ...prev,
          { type: "error", content: `❌ Failed to install ${pkg}: ${err.message || err}`, timestamp: new Date() },
        ]);
      }
    }
    return true;
  }, [installMysqlShim]);

  const installImports = useCallback(async (code: string) => {
    const py = pyodideRef.current;
    if (!py) return;

    // Extract import statements (supports dotted imports like "mysql.connector")
    const importRegex = /^\s*(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_.]*)/gm;
    const stdlibAndBuiltin = new Set([
      "sys", "os", "io", "re", "math", "json", "random", "time", "datetime",
      "collections", "itertools", "functools", "operator", "string", "textwrap",
      "struct", "copy", "pprint", "typing", "abc", "contextlib", "decimal",
      "fractions", "statistics", "pathlib", "glob", "shutil", "pickle",
      "shelve", "csv", "configparser", "hashlib", "hmac", "secrets",
      "logging", "warnings", "traceback", "unittest", "doctest",
      "enum", "dataclasses", "array", "queue", "heapq", "bisect",
      "ast", "dis", "inspect", "importlib", "pkgutil", "token", "tokenize",
      "urllib", "html", "xml", "email", "base64", "binascii", "cmath",
      "difflib", "calendar", "locale", "gettext", "argparse", "optparse",
      "sqlite3", "zlib", "gzip", "bz2", "lzma", "zipfile", "tarfile",
      "socket", "ssl", "select", "signal", "mmap", "codecs", "unicodedata",
      "stringprep", "readline", "rlcompleter", "weakref", "types",
      "pdb", "profile", "timeit", "platform", "errno", "ctypes",
      // Pyodide built-ins
      "pyodide", "micropip", "js",
      // Common internal modules
      "__future__", "builtins", "_thread", "threading", "multiprocessing",
    ]);

    const modules = new Set<string>();
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const full = match[1];
      const top = full.split(".")[0];
      if (stdlibAndBuiltin.has(top)) continue;
      modules.add(PACKAGE_ALIASES[full] ? full : top);
    }

    if (modules.size === 0) return;

    await py.loadPackage("micropip");
    const micropip = py.pyimport("micropip");

    for (const mod of modules) {
      const alias = PACKAGE_ALIASES[mod];
      const importName = alias?.importName || mod;
      try {
        py.runPython(`import ${importName}`);
        continue;
      } catch {
        // not available, install or shim below
      }

      if (alias?.shim) {
        await installMysqlShim(alias.shim as "mysql_connector" | "pymysql");
        continue;
      }

      const installName = alias?.install || mod;
      setOutputs((prev) => [
        ...prev,
        { type: "info", content: `📦 Installing package: ${installName}...`, timestamp: new Date() },
      ]);
      try {
        await micropip.install(installName);
        setOutputs((prev) => [
          ...prev,
          { type: "info", content: `✅ Installed ${installName} successfully`, timestamp: new Date() },
        ]);
      } catch (err: any) {
        setOutputs((prev) => [
          ...prev,
          { type: "error", content: `❌ Failed to install ${installName}: ${err.message || err}. Tip: not all PyPI packages run in the browser (Pyodide).`, timestamp: new Date() },
        ]);
      }
    }
  }, [installMysqlShim]);

  const runCode = useCallback(
    async (code: string, mode: "python" | "mysql" = "python") => {
      if (!pyodideRef.current || isRunning) return;

      setIsRunning(true);
      setOutputs((prev) => [
        ...prev,
        { type: "info", content: mode === "mysql" ? ">>> Running SQL query..." : ">>> Running code...", timestamp: new Date() },
      ]);

      try {
        if (mode === "mysql") {
          // Wrap SQL in Python sqlite3 execution
          const wrappedCode = `
import sqlite3, sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.outputs = []
    def write(self, text):
        if text.strip():
            self.outputs.append(text)
    def flush(self):
        pass
    def get_output(self):
        return ''.join(self.outputs)

_stdout_capture = OutputCapture()
_stderr_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture

if not hasattr(__builtins__, '_sql_conn') if isinstance(__builtins__, dict) else not hasattr(__builtins__, '_sql_conn'):
    import builtins
    builtins._sql_conn = sqlite3.connect(':memory:')

_conn = __builtins__._sql_conn if isinstance(__builtins__, dict) else __builtins__._sql_conn

_sql_code = ${JSON.stringify(code)}
_statements = [s.strip() for s in _sql_code.split(';') if s.strip() and not s.strip().startswith('--')]

_cursor = _conn.cursor()
for _stmt in _statements:
    # Skip pure comment lines
    _lines = [l for l in _stmt.split('\\n') if l.strip() and not l.strip().startswith('--')]
    _clean = '\\n'.join(_lines).strip()
    if not _clean:
        continue
    try:
        _cursor.execute(_clean)
        if _clean.upper().startswith('SELECT') or _clean.upper().startswith('SHOW') or _clean.upper().startswith('DESCRIBE') or _clean.upper().startswith('PRAGMA'):
            _cols = [desc[0] for desc in _cursor.description] if _cursor.description else []
            _rows = _cursor.fetchall()
            if _cols:
                _col_widths = [max(len(str(c)), max((len(str(r[i])) for r in _rows), default=0)) for i, c in enumerate(_cols)]
                _header = ' | '.join(str(c).ljust(w) for c, w in zip(_cols, _col_widths))
                _sep = '-+-'.join('-' * w for w in _col_widths)
                print(_header)
                print(_sep)
                for _row in _rows:
                    print(' | '.join(str(v).ljust(w) for v, w in zip(_row, _col_widths)))
            print(f"({len(_rows)} row{'s' if len(_rows) != 1 else ''})")
        else:
            _conn.commit()
            print(f"Query OK, {_cursor.rowcount} row(s) affected")
    except Exception as _e:
        print(f"SQL Error: {_e}", file=sys.stderr)
`;
          await pyodideRef.current.runPythonAsync(wrappedCode);

          const stdout = pyodideRef.current.runPython("_stdout_capture.get_output()");
          const stderr = pyodideRef.current.runPython("_stderr_capture.get_output()");

          if (stdout) {
            setOutputs((prev) => [...prev, { type: "output", content: stdout, timestamp: new Date() }]);
          }
          if (stderr) {
            setOutputs((prev) => [...prev, { type: "error", content: stderr, timestamp: new Date() }]);
          }
          if (!stdout && !stderr) {
            setOutputs((prev) => [...prev, { type: "info", content: "Query executed successfully (no output)", timestamp: new Date() }]);
          }

          // Reset stdout/stderr
          pyodideRef.current.runPython(`import sys; sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__`);
        } else {
          // Python mode

          // Strip pip-style install lines from the code and run them as install commands
          const codeLines = code.split("\n");
          const remainingLines: string[] = [];
          for (const line of codeLines) {
            const handled = await runPipCommand(line);
            if (!handled) remainingLines.push(line);
          }
          const userCode = remainingLines.join("\n");

          await installImports(userCode);

          pyodideRef.current.runPython(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.outputs = []
    def write(self, text):
        if text.strip():
            self.outputs.append(text)
    def flush(self):
        pass
    def get_output(self):
        return ''.join(self.outputs)

_stdout_capture = OutputCapture()
_stderr_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
          `);

          if (userCode.trim()) {
            await pyodideRef.current.runPythonAsync(userCode);
          }

          const stdout = pyodideRef.current.runPython("_stdout_capture.get_output()");
          const stderr = pyodideRef.current.runPython("_stderr_capture.get_output()");

          if (stdout) {
            setOutputs((prev) => [...prev, { type: "output", content: stdout, timestamp: new Date() }]);
          }
          if (stderr) {
            setOutputs((prev) => [...prev, { type: "error", content: stderr, timestamp: new Date() }]);
          }
          if (!stdout && !stderr) {
            setOutputs((prev) => [...prev, { type: "info", content: "Code executed successfully (no output)", timestamp: new Date() }]);
          }

          pyodideRef.current?.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
          `);
        }
      } catch (error: any) {
        setOutputs((prev) => [
          ...prev,
          { type: "error", content: error.message || String(error), timestamp: new Date() },
        ]);
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning, installImports, runPipCommand]
  );

  const clearOutputs = useCallback(() => {
    setOutputs([]);
  }, []);

  const stopExecution = useCallback(() => {
    // Note: Pyodide doesn't support interrupting execution
    // This is a placeholder for UI feedback
    setIsRunning(false);
    setOutputs((prev) => [
      ...prev,
      {
        type: "info",
        content: "Execution stopped.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    pyodide,
    isLoading,
    isRunning,
    outputs,
    runCode,
    clearOutputs,
    stopExecution,
  };
};
