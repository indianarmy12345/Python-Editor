import { useRef } from "react";
import { FileDown, FileUp, FileCode, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EditorMode } from "./PythonIDE";

const pythonTemplates = [
  {
    name: "Hello World",
    code: `# Hello World Example
print("Hello, World!")
print("Welcome to Python!")
`,
  },
  {
    name: "Variables & Types",
    code: `# Variables and Data Types
name = "Python"
version = 3.12
is_awesome = True

print(f"Language: {name}")
print(f"Version: {version}")
print(f"Is Awesome: {is_awesome}")
print(f"Type of name: {type(name)}")
print(f"Type of version: {type(version)}")
`,
  },
  {
    name: "Lists & Loops",
    code: `# Lists and Loops
fruits = ["apple", "banana", "cherry", "mango"]

print("All fruits:")
for fruit in fruits:
    print(f"  - {fruit}")

print(f"\\nFirst fruit: {fruits[0]}")
print(f"Last fruit: {fruits[-1]}")
print(f"Total fruits: {len(fruits)}")

# List comprehension
upper_fruits = [f.upper() for f in fruits]
print(f"Uppercase: {upper_fruits}")
`,
  },
  {
    name: "Functions",
    code: `# Functions Example
def greet(name, greeting="Hello"):
    """A simple greeting function."""
    return f"{greeting}, {name}!"

def calculate_area(length, width):
    """Calculate the area of a rectangle."""
    return length * width

# Using the functions
print(greet("Python Learner"))
print(greet("Developer", "Welcome"))

area = calculate_area(10, 5)
print(f"Area of 10x5 rectangle: {area}")
`,
  },
  {
    name: "Classes & Objects",
    code: `# Classes and Objects
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    
    def bark(self):
        return f"{self.name} says: Woof!"
    
    def info(self):
        return f"{self.name} is a {self.breed}"

# Create instances
buddy = Dog("Buddy", "Golden Retriever")
max_dog = Dog("Max", "German Shepherd")

print(buddy.info())
print(buddy.bark())
print(max_dog.info())
print(max_dog.bark())
`,
  },
  {
    name: "Dictionary Operations",
    code: `# Dictionary Operations
student = {
    "name": "Alice",
    "age": 20,
    "grades": [85, 90, 78, 92],
    "is_active": True
}

print(f"Student: {student['name']}")
print(f"Age: {student['age']}")
print(f"Average Grade: {sum(student['grades']) / len(student['grades']):.1f}")

# Adding and updating
student["email"] = "alice@example.com"
student["age"] = 21

# Iterating
print("\\nAll student info:")
for key, value in student.items():
    print(f"  {key}: {value}")
`,
  },
  {
    name: "Error Handling",
    code: `# Error Handling with Try/Except
def divide(a, b):
    try:
        result = a / b
        return f"{a} / {b} = {result}"
    except ZeroDivisionError:
        return "Error: Cannot divide by zero!"
    except TypeError:
        return "Error: Invalid types for division!"
    finally:
        print("Division attempted.")

print(divide(10, 2))
print(divide(10, 0))
print(divide("10", 2))
`,
  },
  {
    name: "List Comprehensions",
    code: `# List Comprehensions
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Basic comprehension
squares = [x**2 for x in numbers]
print(f"Squares: {squares}")

# With condition
evens = [x for x in numbers if x % 2 == 0]
print(f"Even numbers: {evens}")

# Nested comprehension
matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print(f"Matrix: {matrix}")

# Dictionary comprehension
square_dict = {x: x**2 for x in range(1, 6)}
print(f"Square dict: {square_dict}")
`,
  },
  {
    name: "MySQL Database",
    code: `# MySQL Database Connection Example
# Install the connector and connect to a database!

pip install mysql-connector-python
import mysql.connector

# Connect to database (uses SQLite backend in browser)
db = mysql.connector.connect(
    host="localhost",
    user="user",
    password="password",
    database="mydb"
)

# Create a cursor
cursor = db.cursor()

# Create a table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT
    )
""")

# Insert data using parameterized queries
cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", ("Alice", "alice@example.com"))
cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", ("Bob", "bob@example.com"))
cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", ("Charlie", "charlie@example.com"))

# Commit the changes
db.commit()

# Query the data
cursor.execute("SELECT * FROM users")
print("All users:")
for row in cursor.fetchall():
    print(f"  ID: {row[0]}, Name: {row[1]}, Email: {row[2]}")

# Close connections
cursor.close()
db.close()
print("\\nDatabase operations completed!")
`,
  },
];

const sqlTemplates = [
  {
    name: "JOIN - Inner Join",
    code: `-- Inner JOIN Example
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dept_id INTEGER,
    salary REAL,
    FOREIGN KEY (dept_id) REFERENCES departments(id)
);

INSERT INTO departments (name) VALUES
('Engineering'), ('Marketing'), ('Sales'), ('HR');

INSERT INTO employees (name, dept_id, salary) VALUES
('Alice', 1, 95000), ('Bob', 2, 72000),
('Charlie', 1, 88000), ('Diana', 3, 67000),
('Eve', 1, 102000), ('Frank', 4, 61000);

-- INNER JOIN: employees with their department
SELECT e.name AS employee, d.name AS department, e.salary
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
ORDER BY e.salary DESC;
`,
  },
  {
    name: "JOIN - Left & Cross",
    code: `-- LEFT JOIN and CROSS JOIN Examples
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER,
    price REAL
);

INSERT INTO categories (name) VALUES
('Electronics'), ('Books'), ('Clothing'), ('Sports');

INSERT INTO products (name, category_id, price) VALUES
('Laptop', 1, 999.99), ('Phone', 1, 699.99),
('Novel', 2, 14.99), ('T-Shirt', 3, 24.99);

-- LEFT JOIN: all categories, even without products
SELECT c.name AS category, p.name AS product, p.price
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
ORDER BY c.name;
`,
  },
  {
    name: "Aggregations",
    code: `-- Aggregation Functions
CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    region TEXT NOT NULL,
    amount REAL NOT NULL,
    quantity INTEGER NOT NULL
);

INSERT INTO sales (product, region, amount, quantity) VALUES
('Widget A', 'North', 150.00, 3),
('Widget B', 'South', 230.00, 5),
('Widget A', 'South', 180.00, 4),
('Widget C', 'North', 90.00, 2),
('Widget B', 'North', 310.00, 7),
('Widget A', 'North', 200.00, 5),
('Widget C', 'South', 120.00, 3),
('Widget B', 'South', 275.00, 6);

-- Total sales by product
SELECT product,
    COUNT(*) AS total_orders,
    SUM(amount) AS total_revenue,
    ROUND(AVG(amount), 2) AS avg_order,
    MIN(amount) AS min_order,
    MAX(amount) AS max_order
FROM sales
GROUP BY product
ORDER BY total_revenue DESC;

-- Sales by region with HAVING
SELECT region,
    COUNT(*) AS orders,
    SUM(amount) AS revenue
FROM sales
GROUP BY region
HAVING SUM(amount) > 400;
`,
  },
  {
    name: "Subqueries",
    code: `-- Subquery Examples
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade REAL NOT NULL,
    course TEXT NOT NULL
);

INSERT INTO students (name, grade, course) VALUES
('Alice', 92, 'Math'), ('Bob', 85, 'Science'),
('Charlie', 78, 'Math'), ('Diana', 95, 'Science'),
('Eve', 88, 'Math'), ('Frank', 72, 'Science'),
('Grace', 91, 'Math'), ('Henry', 83, 'Science');

-- Students above the average grade
SELECT name, grade, course
FROM students
WHERE grade > (SELECT AVG(grade) FROM students)
ORDER BY grade DESC;

-- Top student per course (correlated subquery)
SELECT s.name, s.grade, s.course
FROM students s
WHERE s.grade = (
    SELECT MAX(s2.grade)
    FROM students s2
    WHERE s2.course = s.course
);

-- Using subquery in FROM (derived table)
SELECT course, avg_grade
FROM (
    SELECT course, ROUND(AVG(grade), 2) AS avg_grade
    FROM students
    GROUP BY course
) AS course_stats
ORDER BY avg_grade DESC;
`,
  },
  {
    name: "Window Functions",
    code: `-- Window Functions (SQLite 3.25+)
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer TEXT NOT NULL,
    product TEXT NOT NULL,
    amount REAL NOT NULL,
    order_date TEXT NOT NULL
);

INSERT INTO orders (customer, product, amount, order_date) VALUES
('Alice', 'Laptop', 999, '2024-01-15'),
('Bob', 'Phone', 699, '2024-01-20'),
('Alice', 'Tablet', 499, '2024-02-10'),
('Charlie', 'Laptop', 999, '2024-02-15'),
('Bob', 'Tablet', 499, '2024-03-01'),
('Alice', 'Phone', 699, '2024-03-10'),
('Charlie', 'Phone', 699, '2024-03-20');

-- ROW_NUMBER and RANK
SELECT customer, product, amount,
    ROW_NUMBER() OVER (ORDER BY amount DESC) AS row_num,
    RANK() OVER (ORDER BY amount DESC) AS rank,
    DENSE_RANK() OVER (ORDER BY amount DESC) AS dense_rank
FROM orders;

-- Running total per customer
SELECT customer, product, amount, order_date,
    SUM(amount) OVER (PARTITION BY customer ORDER BY order_date) AS running_total
FROM orders
ORDER BY customer, order_date;
`,
  },
  {
    name: "CASE & String Functions",
    code: `-- CASE Expressions and String Functions
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    age INTEGER
);

INSERT INTO contacts (first_name, last_name, email, age) VALUES
('Alice', 'Smith', 'alice@example.com', 28),
('Bob', 'Johnson', NULL, 35),
('Charlie', 'Williams', 'charlie@test.com', 17),
('Diana', 'Brown', 'diana@example.com', 42),
('Eve', 'Davis', NULL, 22);

-- CASE expression for age groups
SELECT first_name, last_name, age,
    CASE
        WHEN age < 18 THEN 'Minor'
        WHEN age BETWEEN 18 AND 30 THEN 'Young Adult'
        WHEN age BETWEEN 31 AND 40 THEN 'Adult'
        ELSE 'Senior'
    END AS age_group
FROM contacts;

-- String functions
SELECT
    UPPER(first_name) AS upper_name,
    LOWER(last_name) AS lower_name,
    LENGTH(first_name || ' ' || last_name) AS full_name_len,
    COALESCE(email, 'No email') AS email_display,
    REPLACE(COALESCE(email, ''), '@', ' [at] ') AS masked_email
FROM contacts;
`,
  },
];

interface FileMenuProps {
  code: string;
  onCodeChange: (code: string) => void;
  editorMode?: EditorMode;
}

const FileMenu = ({ code, onCodeChange, editorMode = "python" }: FileMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSQL = editorMode === "mysql";
  const templates = isSQL ? sqlTemplates : pythonTemplates;
  const fileExt = isSQL ? ".sql" : ".py";
  const fileAccept = isSQL ? ".sql,.txt" : ".py,.txt";

  const handleSave = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isSQL ? "query.sql" : "script.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onCodeChange(content);
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTemplateSelect = (templateCode: string) => {
    onCodeChange(templateCode);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={fileAccept}
        className="hidden"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md 
                       bg-secondary text-secondary-foreground hover:bg-secondary/80
                       transition-colors duration-200 text-sm font-medium"
          >
            <FileCode className="w-4 h-4" />
            <span className="hidden sm:inline">File</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={handleSave}>
            <FileDown className="w-4 h-4 mr-2" />
            Save as {fileExt}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLoad}>
            <FileUp className="w-4 h-4 mr-2" />
            Open File...
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FileCode className="w-4 h-4 mr-2" />
              {isSQL ? "SQL Templates" : "Sample Templates"}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-52">
              {templates.map((template) => (
                <DropdownMenuItem
                  key={template.name}
                  onClick={() => handleTemplateSelect(template.code)}
                >
                  {template.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileMenu;
