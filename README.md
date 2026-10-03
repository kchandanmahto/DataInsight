# 📊 DataInsight

### Data Science Analysis & Visualization System

DataInsight is a college Data Science Lab project designed to combine fundamental Data Science concepts into a single practical application.

The system allows users to upload datasets and perform data analysis, statistical analysis, visualization, and regression-based analysis through a simple web interface.

---

## 🎯 Project Objective

The main objective of DataInsight is to practically implement the concepts covered in the **Data Science Lab (CSEP701)** course.

The project combines:

* NumPy
* Pandas
* SciPy
* Matplotlib
* Seaborn
* Plotly
* Statsmodels
* Python
* FastAPI
* HTML
* CSS
* JavaScript

into one application.

---

## 🛠️ Technology Stack

### Backend

* Python 3.12
* FastAPI
* Uvicorn

### Data Science

* NumPy
* Pandas
* SciPy
* Statsmodels
* Matplotlib
* Seaborn
* Plotly

### Frontend

* HTML5
* CSS3
* JavaScript

### Dataset Support

* CSV
* Excel

---

## 📂 Project Structure

```text
DataInsight/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── routes/
│   │   │   └── dataset.py
│   │   │
│   │   ├── services/
│   │   │   └── dataset_service.py
│   │   │
│   │   ├── analysis/
│   │   └── utils/
│   │
│   ├── datasets/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── README.md
└── .gitignore
```

---

## ✅ Current Features

The first version of DataInsight currently supports:

* CSV dataset upload
* Excel dataset upload
* Dataset reading using Pandas
* Dataset row count
* Dataset column count
* Column name detection
* Data type detection
* Missing value detection
* Duplicate row detection
* Dataset preview
* FastAPI REST API
* Simple HTML/CSS/JavaScript frontend

---

## 🚧 Planned Features

The project is being developed incrementally.

### Data Cleaning

* Missing value handling
* Duplicate removal
* Data type conversion
* Basic data preprocessing

### Statistical Analysis

* Mean
* Median
* Mode
* Variance
* Standard Deviation
* Skewness
* Kurtosis
* Frequency analysis

### Bivariate Analysis

* Correlation analysis
* Scatter plots
* Relationship analysis

### Regression

* Linear Regression
* Logistic Regression
* Multiple Regression

### Data Visualization

* Histograms
* Scatter plots
* Correlation plots
* Density plots
* Contour plots
* 3D visualization

### Dataset Analysis

* Iris Dataset
* Diabetes Dataset
* Pima Indians Diabetes Dataset

### Geographic Visualization

* Geographic data visualization
* Map-based analysis

---

## 🔄 Application Workflow

```text
Upload Dataset
      ↓
Read Dataset
      ↓
Dataset Overview
      ↓
Data Cleaning
      ↓
Statistical Analysis
      ↓
Correlation Analysis
      ↓
Regression Analysis
      ↓
Data Visualization
      ↓
Final Insights
```

---

## 🚀 Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/DataInsight.git
```

```bash
cd DataInsight
```

### 2. Create Python 3.12 Virtual Environment

```bash
cd backend
```

```bash
py -3.12 -m venv venv
```

### 3. Activate Virtual Environment

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### 4. Install Dependencies

```bash
python -m pip install --upgrade pip
```

```bash
pip install -r requirements.txt
```

### 5. Start FastAPI Backend

```bash
uvicorn app.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Start Frontend

Open the `frontend/index.html` using VS Code Live Server.

---

## 🧪 Sample Dataset

A sample student dataset can be used to test the application.

Example columns:

```text
Name
Age
Study_Hours
Attendance
Marks
Department
```

The application can analyze CSV and Excel datasets.

---

## 🎓 Academic Purpose

This project is developed as a practical implementation of the concepts covered in the **Data Science Lab (CSEP701)** curriculum.

It demonstrates the practical use of:

* Python programming
* Numerical computing
* Data manipulation
* Statistical analysis
* Regression
* Data visualization
* Exploratory Data Analysis

---

## 📌 Project Status

**Status:** 🚧 In Development

### Completed

* Project setup
* FastAPI backend
* Frontend
* Dataset upload
* CSV/Excel processing
* Dataset overview
* Dataset preview

### Next

* Data cleaning
* Statistical analysis
* Visualization
* Regression
* Final dashboard

---

## 👨‍💻 Author

**Chandan Kumar**

B.Tech Computer Science & Engineering

---

## 📄 License

This project is developed for educational and academic purposes.
