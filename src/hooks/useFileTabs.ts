import { useState, useCallback } from "react";

export interface FileTab {
  id: string;
  name: string;
  content: string;
  isModified: boolean;
}

const defaultPythonCode = `# Welcome to Python Editor! 🐍
# Write your Python code here and click "Run" to execute it.

# Example: Hello World
print("Hello, World!")

# Example: Simple calculation
x = 10
y = 20
print(f"The sum of {x} and {y} is {x + y}")

# Example: Loop
for i in range(5):
    print(f"Count: {i}")

# Example: MySQL Database Connection (uses SQLite in browser)
# Install the connector first, then use it just like real MySQL!
pip install mysql-connector-python
import mysql.connector

# Connect to database (works in browser with SQLite backend)
db = mysql.connector.connect(
    host="localhost",
    user="user",
    password="password",
    database="mydb"
)

# Create a cursor and execute queries
cursor = db.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)")
cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", ("Alice", "alice@example.com"))
cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", ("Bob", "bob@example.com"))
db.commit()

# Fetch and display results
cursor.execute("SELECT * FROM users")
print("\\nUsers in database:")
for row in cursor.fetchall():
    print(f"  ID: {row[0]}, Name: {row[1]}, Email: {row[2]}")

cursor.close()
db.close()
print("\\nDatabase operations completed successfully!")

# Try modifying this code and run it!
`;

const defaultMySQLCode = `-- Welcome to SQL Editor!
-- Write your SQL queries here.
-- Uses SQLite under the hood. Tables persist during your session.

-- Example: Create a table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example: Insert data
INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');

-- Example: Select data
SELECT * FROM users;

-- Example: Filter and sort
SELECT name, email
FROM users
WHERE name LIKE 'A%'
ORDER BY name ASC;
`;

const generateId = () => Math.random().toString(36).substring(2, 9);

export type FileMode = "python" | "mysql";

export function useFileTabs() {
  const [mode, setMode] = useState<FileMode>("python");
  const [tabs, setTabs] = useState<FileTab[]>([
    { id: generateId(), name: "main.py", content: defaultPythonCode, isModified: false },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  const getDefaults = useCallback((m: FileMode) => {
    return m === "mysql"
      ? { name: "query.sql", content: defaultMySQLCode, ext: ".sql", empty: "-- New SQL file\n\n" }
      : { name: "main.py", content: defaultPythonCode, ext: ".py", empty: "# New Python file\n\n" };
  }, []);

  const createNewTab = useCallback((name?: string, content?: string) => {
    const defaults = getDefaults(mode);
    const newTab: FileTab = {
      id: generateId(),
      name: name || `untitled_${tabs.length + 1}${defaults.ext}`,
      content: content || defaults.empty,
      isModified: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  }, [tabs.length, mode, getDefaults]);

  const switchMode = useCallback((newMode: FileMode) => {
    setMode(newMode);
    const defaults = getDefaults(newMode);
    const newTab: FileTab = {
      id: generateId(),
      name: defaults.name,
      content: defaults.content,
      isModified: false,
    };
    setTabs([newTab]);
    setActiveTabId(newTab.id);
  }, [getDefaults]);

  const closeTab = useCallback((tabId: string) => {
    const defaults = getDefaults(mode);
    setTabs((prev) => {
      if (prev.length === 1) {
        return [{ id: generateId(), name: defaults.name, content: defaults.content, isModified: false }];
      }
      const newTabs = prev.filter((tab) => tab.id !== tabId);
      // If closing the active tab, switch to another
      if (tabId === activeTabId) {
        const closedIndex = prev.findIndex((tab) => tab.id === tabId);
        const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
        setActiveTabId(newTabs[newActiveIndex].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, content, isModified: true } : tab
      )
    );
  }, []);

  const renameTab = useCallback((tabId: string, newName: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, name: newName } : tab
      )
    );
  }, []);

  const markTabSaved = useCallback((tabId: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, isModified: false } : tab
      )
    );
  }, []);

  const loadFileToTab = useCallback((name: string, content: string) => {
    // Check if a tab with this name already exists
    const existingTab = tabs.find((tab) => tab.name === name);
    if (existingTab) {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === existingTab.id ? { ...tab, content, isModified: false } : tab
        )
      );
      setActiveTabId(existingTab.id);
    } else {
      createNewTab(name, content);
    }
  }, [tabs, createNewTab]);

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    createNewTab,
    closeTab,
    updateTabContent,
    renameTab,
    markTabSaved,
    loadFileToTab,
    mode,
    switchMode,
  };
}
