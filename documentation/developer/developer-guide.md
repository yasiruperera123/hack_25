# Developer Guide

## Development Environment Setup

### Prerequisites
1. Install Node.js (v18 or higher)
2. Install npm (v9 or higher)
3. Install Git
4. Install your preferred IDE (VS Code recommended)
5. Install PostgreSQL (if using locally)

### Getting Started

1. Clone the repository
```bash
git clone [repository-url]
cd SmartCart
```

2. Install VS Code Extensions (recommended)
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens

3. Frontend Development Setup
```bash
cd frontend
npm install
npm run dev
```

4. Backend Development Setup
```bash
cd backend
npm install
npm run dev
```

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use async/await instead of Promises
- Use meaningful variable and function names
- Keep functions small and focused
- Document complex logic with comments

### React Components
- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Follow component naming conventions:
  - PascalCase for component names
  - camelCase for functions and variables
  - UPPER_CASE for constants

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow BEM naming convention for custom CSS
- Keep styles modular and reusable
- Use CSS variables for theming

## Testing

### Frontend Testing
```bash
cd frontend
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Backend Testing
```bash
cd backend
npm run test
npm run test:e2e    # Run end-to-end tests
```

## Git Workflow

### Branching Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `release/*` - Release branches

### Commit Messages
Follow conventional commits:
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from develop
2. Make changes and commit
3. Push branch and create PR
4. Get code review
5. Pass CI/CD checks
6. Merge to develop

## Debugging

### Frontend Debugging
- Use React Developer Tools
- Use Chrome DevTools
- Use console.log() strategically
- Use debugger statement

### Backend Debugging
- Use VS Code debugger
- Use logging (winston/morgan)
- Use Postman for API testing
- Monitor error tracking

## Performance Optimization

### Frontend
- Implement code splitting
- Optimize images
- Use lazy loading
- Minimize bundle size
- Cache API responses

### Backend
- Implement caching
- Optimize database queries
- Use connection pooling
- Implement rate limiting
- Monitor performance metrics

## Security Best Practices

### Frontend
- Sanitize user input
- Implement CSRF protection
- Use HTTPS
- Secure token storage
- Validate API responses

### Backend
- Use environment variables
- Implement rate limiting
- Validate request data
- Use secure headers
- Implement authentication
- Log security events

## Deployment

### Development Deployment
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm run build
npm start
```

### Production Deployment
Refer to [Deployment Guide](../deployment/deployment-guide.md)

## Troubleshooting

### Common Issues
1. Node version mismatch
   - Solution: Use nvm to manage Node versions

2. Package conflicts
   - Solution: Clear node_modules and package-lock.json

3. TypeScript errors
   - Solution: Check tsconfig.json settings

4. Build failures
   - Solution: Check build logs and dependencies

## Resources

### Documentation
- [API Documentation](../api/api-documentation.md)
- [Architecture Overview](../architecture/architecture-overview.md)

### External Links
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Node.js Documentation](https://nodejs.org/)
- [Express.js Documentation](https://expressjs.com/) 