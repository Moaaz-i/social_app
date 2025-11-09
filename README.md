# 🌐 LinkedIn-like Professional Network

A modern, professional networking platform similar to LinkedIn, built with React, Tailwind CSS, and FastAPI backend.

## ✨ Features

### 🔐 Authentication & Security
- Complete login/signup system with JWT tokens
- Secure password hashing with bcrypt
- Token-based authentication (7-day expiry)
- Protected routes and API endpoints

### 👤 Profile Management
- Comprehensive user profiles with headline, bio, location
- Skills with endorsement system
- Work experience tracking
- Education history
- Certifications
- Profile and cover pictures

### 📝 Posts & Feed
- Create, view, and delete posts
- Personalized feed from connections
- Like and comment on posts
- Rich content support (images, videos, documents)
- Hashtag support

### 🤝 Professional Networking
- Send and receive connection requests
- Connection suggestions based on mutual connections
- View and manage your network
- Follow/unfollow users

### 💼 Jobs & Careers
- Post job opportunities
- Search and filter jobs
- Apply to jobs with cover letter
- Track applications
- Application status management

### 💬 Messaging
- Direct messaging between connections
- Conversation management
- Unread message tracking
- File attachments

### 🔔 Notifications
- Real-time notifications for:
  - Likes and comments
  - Connection requests
  - Messages
  - Job applications
  - Endorsements
- Unread notification counter

### 🔍 Search
- Search users, posts, jobs, and companies
- Hashtag search
- Advanced filtering

### 🎨 Modern UI/UX
- Beautiful, responsive design
- Tailwind CSS styling
- Smooth animations and transitions
- Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and development server

### Backend (FastAPI)
- **FastAPI** - Modern Python web framework
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tailwindcss-project
```

### 2. Setup Backend API
```bash
cd /Users/moaaz/Documents/Api
pip install -r requirements.txt
python run.py
```
API will run on: `http://localhost:8000`

### 3. Setup Frontend
```bash
cd /Users/moaaz/session/projects/tailwind/tailwindcss-project
npm install
npm run dev
```
App will run on: `http://localhost:5173`

### 4. Environment Variables
Create a `.env` file in the project root:
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Troubleshooting

### useAuth Hook Error

If you encounter the error `useAuth must be used within an AuthProvider`, this is likely because:

1. **Import Issue**: Make sure you're importing `AuthContext` correctly in `useAuth.js`:
   ```javascript
   import AuthContext from '../contexts/AuthContext.jsx';
   ```

2. **Context Not Provided**: Ensure that `AuthProvider` wraps your entire app in `App.jsx`:
   ```javascript
   <AuthProvider>
     <RouterProvider router={router} />
   </AuthProvider>
   ```

3. **Component Outside Provider**: Some components like login/signup pages shouldn't use `useAuth` directly. Instead, use localStorage directly or create separate context.

### Tailwind CSS v4 Issues

If you experience styling issues with Tailwind CSS v4:

1. **CSS Import**: Use the correct import syntax:
   ```css
   @import "tailwindcss";
   ```

2. **Plugin Configuration**: Ensure your `vite.config.js` includes the Tailwind plugin:
   ```javascript
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

3. **Profile Page Loop Fix**: Fixed infinite re-render loop by:
   - Separating `reset` from `loadUserProfile` useCallback dependencies
   - Using separate useEffect for form reset when userData changes
   - Adding useCallback for event handlers to prevent unnecessary re-renders
   - Improved error handling and success messages

### Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Preview production build**:
   ```bash
   npm run preview
   ```

### API Integration

The app integrates with FastAPI backend. Make sure to:

1. **Update API endpoints** in hook files if needed
2. **Handle authentication** tokens properly in localStorage
3. **Test API connectivity** before deployment

## 📁 Project Structure

```
tailwindcss-project/
├── src/
│   ├── pages/
│   │   ├── home.jsx          # Landing page
│   │   ├── login.jsx         # Login page with Zod validation
│   │   ├── signup.jsx        # Signup page with Zod validation
│   │   ├── profile.jsx       # User profile management
│   │   ├── posts.jsx         # Posts feed
│   │   └── [upcoming]        # connections.jsx, jobs.jsx, messages.jsx
│   ├── hooks/
│   │   ├── login.js          # Login API integration
│   │   ├── signup.js         # Signup API integration
│   │   ├── profile.js        # Profile management
│   │   ├── posts.js          # Posts CRUD operations
│   │   ├── social.js         # Social features
│   │   └── search.js         # Search functionality
│   ├── components/
│   │   ├── Layout.jsx        # Main layout wrapper
│   │   └── Navbar/           # Navigation component
│   ├── contexts/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── App.jsx               # Main app with routing
│   └── main.jsx              # Entry point
├── .env                      # Environment variables
├── LINKEDIN_PROJECT_GUIDE.md # Comprehensive guide
├── POSTS_GUIDE.md            # Posts feature guide
└── README.md                 # This file
```

## 🔌 API Integration

The app integrates with a comprehensive LinkedIn-like API. See `LINKEDIN_PROJECT_GUIDE.md` for full API documentation.

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

#### Posts
- `GET /posts/feed` - Get personalized feed
- `POST /posts/` - Create post
- `DELETE /posts/{id}` - Delete post
- `POST /posts/{id}/like` - Like post
- `POST /posts/{id}/comments` - Add comment

#### Profile
- `GET /users/{id}` - Get user profile
- `PUT /users/me` - Update profile
- `POST /users/me/skills` - Add skill
- `POST /users/me/experiences` - Add experience
- `POST /users/me/educations` - Add education

#### Connections
- `POST /connections/requests/{user_id}` - Send request
- `GET /connections/requests/received` - Get requests
- `PUT /connections/requests/{id}/respond` - Accept/reject
- `GET /connections/` - Get connections

#### Jobs
- `GET /jobs/` - Search jobs
- `POST /jobs/` - Post job
- `POST /jobs/{id}/apply` - Apply to job

#### Messages
- `POST /messages/` - Send message
- `GET /messages/conversations` - Get conversations

#### Search
- `GET /search/` - Search all
- `GET /search/users` - Search users
- `GET /search/hashtags/{tag}` - Search by hashtag

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with navigation
│   └── Navbar/
│       ├── Navbar.jsx      # Navigation component
│       └── Navbar.module.css
├── contexts/
│   └── AuthContext.jsx     # Authentication context
├── hooks/
│   ├── login.js           # Login API hook
│   ├── signup.js          # Signup API hook
│   ├── profile.js         # Profile management hook
│   ├── posts.js           # Posts management hook
│   ├── social.js          # Social features hook
│   ├── search.js          # Search functionality hook
│   └── useAuth.js         # Authentication hook
├── pages/
│   ├── home.jsx           # Home/dashboard page
│   ├── profile.jsx        # Profile management page
│   ├── login.jsx          # Login page
│   └── signup.jsx         # Signup page
├── assets/                # Static assets
└── App.jsx               # Main app component
```

## 🔐 Authentication Flow

1. **Signup**: 
   - User fills form with name, email, password, headline, etc.
   - Zod validates all fields
   - API creates account and returns JWT token
   - Token and user info stored in localStorage
   - Auto-redirect to home

2. **Login**:
   - User enters email and password
   - Zod validates credentials
   - API verifies and returns JWT token
   - Fetch user info with `/auth/me`
   - Store token and user data
   - Redirect to home

3. **Protected Routes**:
   - All routes except login/signup require authentication
   - Token sent in `Authorization: Bearer {token}` header
   - Invalid/expired tokens redirect to login

4. **Logout**:
   - Clear localStorage
   - Redirect to login page

## 📚 Documentation

- **`LINKEDIN_PROJECT_GUIDE.md`** - Complete project documentation
- **`POSTS_GUIDE.md`** - Posts feature guide
- **`/Users/moaaz/Documents/Api/API_DOCUMENTATION.md`** - Full API docs
- **`/Users/moaaz/Documents/Api/EXAMPLES.md`** - API usage examples

## 🎯 Current Status

### ✅ Completed Features
- [x] Authentication (Login/Signup) with Zod validation
- [x] Posts Feed (Create, View, Delete)
- [x] Profile Management
- [x] API Integration
- [x] Responsive Design
- [x] Error Handling

### 🚧 In Progress
- [ ] Skills & Experience in Profile
- [ ] Connections Page
- [ ] Jobs Page
- [ ] Messages Page
- [ ] Notifications
- [ ] Search Functionality

### 🎯 Planned
- [ ] Like & Comment on Posts
- [ ] Image Upload
- [ ] Real-time Updates
- [ ] Advanced Search
- [ ] Recommendations
- [ ] Endorsements

## Customization

### Styling
The app uses Tailwind CSS with DaisyUI components. You can customize:
- Colors in `tailwind.config.js`
- Components in the `components/` directory
- Global styles in `src/index.css`

### API Configuration
Update API endpoints in the hooks files:
- Base URL in each hook file
- Authentication headers
- Error handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Frontend
Deploy to:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**

```bash
npm run build
# Deploy dist/ folder
```

### Backend
Deploy FastAPI to:
- **Railway** (Recommended)
- **Heroku**
- **DigitalOcean**
- **AWS**

### Environment Variables (Production)
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch posts"**
   - Ensure API is running on port 8000
   - Check VITE_API_BASE_URL in .env

2. **"Invalid token"**
   - Token expired (7 days)
   - Login again

3. **"CORS Error"**
   - Check CORS settings in FastAPI
   - Ensure frontend URL is allowed

4. **Lint Warnings**
   - Tailwind class suggestions (bg-gradient-to-r vs bg-linear-to-r)
   - These are suggestions, not errors
   - Can be safely ignored or updated

## 📖 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [FastAPI](https://fastapi.tiangolo.com)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 💬 Support

For help:
- Check `LINKEDIN_PROJECT_GUIDE.md`
- Review API documentation at `http://localhost:8000/docs`
- Open an issue on GitHub

---

**Built with ❤️ using React, Tailwind CSS, and FastAPI**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Check the FastAPI documentation
- Review React and Tailwind CSS docs
# social_app
