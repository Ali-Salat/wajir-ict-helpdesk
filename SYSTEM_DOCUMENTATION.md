
# Wajir County IT Help Desk System Documentation

## Overview
The Wajir County IT Help Desk System is a comprehensive ticket management system designed for the Wajir County Government. The system includes user management, ticket tracking, knowledge base, analytics, and audit logging capabilities.

## Theme & Design
- **Colors**: Based on the Wajir County flag colors (Green, Blue, White)
- **Dark/Light Theme**: Fully responsive theme system with automatic system preference detection
- **Branding**: Official Wajir County logo and government styling

## Demo Accounts (First Names Only)
- **Admin**: 
  - Email: admin@wajir.go.ke
  - Password: admin123
  - Name: Ahmed

- **IT Support**:
  - Email: support@wajir.go.ke  
  - Password: support123
  - Name: Fatima

- **User**:
  - Email: user@wajir.go.ke
  - Password: user123
  - Name: Hassan

## Features
1. **Authentication System** - Secure login/logout with Supabase
2. **Ticket Management** - Create, track, and resolve IT support tickets
3. **User Management** - Manage staff accounts and departments
4. **Knowledge Base** - Store and share IT solutions and procedures
5. **Analytics Dashboard** - View system metrics and performance
6. **Audit Logs** - Track all system activities
7. **Theme Toggle** - Switch between light, dark, and system themes

## County Departments Represented
Based on Wajir County Government structure:
- Administration
- Finance & Economic Planning
- Health Services
- Education & Vocational Training
- Agriculture & Livestock
- Water & Environment
- Roads & Public Works
- Trade & Industry
- Lands & Urban Planning
- Youth & Sports

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Deployment**: Netlify
- **State Management**: Redux Toolkit
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

## Deployment Instructions
1. Connect your project to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on git push

## Environment Variables (Required for Supabase)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## For PowerPoint Presentation
Create slides covering:
1. System Overview & Purpose
2. User Interface Screenshots
3. Feature Demonstrations
4. Department Integration
5. Security Features
6. Benefits for Wajir County
7. Future Enhancements
8. Training Requirements
