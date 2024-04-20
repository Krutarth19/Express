interface Config{
    SWAGGER_URL:string;
    PORT:string;
    DATABASE:string;
    JWT_SECRET:string;
    BASE_URL:string;
    SESSION_SECRET:string;
    GOOGLE_CLIENT_ID:string;
    GOOGLE_CLIENT_SECRET:string;
    GOOGLE_CALLBACK_URL:string;
}

export const config:Config ={
    SWAGGER_URL:process.env.SWAGGER_URL || 'localhost:8000',
    PORT: process.env.PORT || '5001',
    DATABASE: process.env.MONGO_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    BASE_URL: process.env.BASE_URL || 'http://localhost:5001',
    SESSION_SECRET:process.env.SESSION_SECRET || 'secret',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET||'',
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',
}