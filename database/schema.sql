-- the model which an application will follow
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    
    -- note: NOT NULL means it must have an entry
    company VARCHAR(255) NOT NULL,

    position VARCHAR(255) NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'Saved',

    application_date DATE,

    deadline DATE,

    url TEXT,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);