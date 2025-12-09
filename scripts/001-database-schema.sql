-- Rehabilitation Centre Management System Database Schema
-- This schema can be used with Supabase/PostgreSQL when you're ready to connect a database

-- States table for Indian states
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state_id INTEGER REFERENCES states(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rehabilitation Centres table
CREATE TABLE IF NOT EXISTS centres (
  id SERIAL PRIMARY KEY,
  centre_id VARCHAR(20) NOT NULL UNIQUE, -- Unique ID like RC-MH-001
  name VARCHAR(200) NOT NULL,
  city_id INTEGER REFERENCES cities(id),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  capacity INTEGER DEFAULT 0,
  established_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, under_review
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Administrators table
CREATE TABLE IF NOT EXISTS administrators (
  id SERIAL PRIMARY KEY,
  admin_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  centre_id INTEGER REFERENCES centres(id),
  role VARCHAR(20) DEFAULT 'centre_admin', -- centre_admin, super_admin
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(20) NOT NULL UNIQUE, -- Unique ID like PT-RC001-0001
  centre_id INTEGER REFERENCES centres(id),
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  gender VARCHAR(10),
  address TEXT,
  phone VARCHAR(20),
  emergency_contact VARCHAR(20),
  admission_date DATE NOT NULL,
  discharge_date DATE,
  diagnosis TEXT,
  status VARCHAR(20) DEFAULT 'admitted', -- admitted, discharged, transferred
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id),
  medicine_name VARCHAR(100) NOT NULL,
  dosage VARCHAR(50),
  frequency VARCHAR(50),
  start_date DATE NOT NULL,
  end_date DATE,
  prescribed_by VARCHAR(100),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_centres_city ON centres(city_id);
CREATE INDEX idx_patients_centre ON patients(centre_id);
CREATE INDEX idx_medications_patient ON medications(patient_id);
CREATE INDEX idx_administrators_centre ON administrators(centre_id);
