-- Certificates & Achievements Vault Schema
-- PostgreSQL Migration File

CREATE TABLE IF NOT EXISTS certificates (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL CHECK (category IN ('CERTIFICATIONS', 'ACHIEVEMENTS', 'COMPETITIONS', 'COURSES', 'WORKSHOPS', 'OTHER')),
  description TEXT,
  issue_date VARCHAR(64) NOT NULL,
  expiry_date VARCHAR(64),
  credential_id VARCHAR(128),
  credential_url TEXT,
  skills TEXT[] DEFAULT '{}',
  image_url TEXT,
  pdf_url TEXT,
  verification_status VARCHAR(32) DEFAULT 'NO VERIFICATION LINK' CHECK (verification_status IN ('VERIFIED', 'LINK AVAILABLE', 'NO VERIFICATION LINK')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_certificates_category ON certificates(category);
CREATE INDEX IF NOT EXISTS idx_certificates_issuer ON certificates(issuer);
CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON certificates(issue_date);
CREATE INDEX IF NOT EXISTS idx_certificates_featured ON certificates(featured);
