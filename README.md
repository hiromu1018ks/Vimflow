# Vimflow ⚡

> A modern todo application with Vim-style keyboard navigation

Vimflow combines the power of modern web technologies with the efficiency of Vim keybindings, creating a unique and productive task management experience.

## ✨ Features

### 🎯 Core Functionality
- **Vim-style Navigation**: Navigate with `j`/`k`, edit with `i`/`o`, delete with `dd`
- **Task Management**: Create, edit, complete, and delete tasks
- **User Authentication**: Secure sign-up and sign-in system
- **Real-time Updates**: Instant UI updates with optimistic rendering

### 🎨 User Experience
- **Theme Switching**: Light/dark mode with system preference detection
- **Interactive Backgrounds**: Animated neural networks (dark) and flowing orbs (light)
- **Responsive Design**: Optimized for all screen sizes
- **Custom Error Pages**: Beautiful 404 and error handling

### ⌨️ Vim Keybindings

| Key | Mode | Action |
|-----|------|--------|
| `j` | Normal | Move down |
| `k` | Normal | Move up |
| `gg` | Normal | Go to first task |
| `G` | Normal | Go to last task |
| `o` | Normal | Add new task (insert mode) |
| `i` | Normal | Insert mode for new task |
| `Enter` | Normal | Edit selected task |
| `dd` | Normal | Delete selected task |
| `Esc` | Insert | Return to normal mode |
| `Ctrl+C` | Insert | Return to normal mode |

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **Icons**: Lucide React
- **Validation**: Zod

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/tasks/      # Task CRUD API endpoints
│   ├── auth/           # Authentication pages
│   └── page.tsx        # Main todo page
├── components/
│   ├── auth/           # Authentication components
│   ├── navigation/     # Navigation components
│   ├── todo/           # Todo-specific components
│   └── ui/             # Reusable UI components
├── hooks/
│   ├── useTodos.ts     # Task CRUD operations
│   ├── useTaskEdit.ts  # Task editing logic
│   ├── useVimMode.ts   # Vim navigation system
│   └── useMousePosition.ts # Mouse tracking for animations
├── contexts/           # React contexts (theme, etc.)
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Vimflow.git
   cd Vimflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/vimflow"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d
   
   # Push schema to database
   npm run db:push
   
   # (Optional) Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

### Docker
```bash
docker-compose up -d # Start PostgreSQL container
```

## 🎨 Custom Hooks Architecture

Vimflow uses a clean separation of concerns through custom hooks:

- **`useTodos`**: Handles all CRUD operations and loading states
- **`useTaskEdit`**: Manages task editing mode and operations  
- **`useVimMode`**: Implements Vim-style keyboard navigation
- **`useMousePosition`**: Smooth mouse tracking for background animations

## 🔒 Authentication

Built with NextAuth.js v5 featuring:
- Email/password authentication
- Secure password hashing with bcryptjs
- Session management
- Protected API routes
- User-specific task isolation

## 🎭 Background Animations

Dynamic backgrounds that respond to your theme:
- **Dark Mode**: Neural network with particle connections
- **Light Mode**: Flowing interactive orbs
- **Mouse Interaction**: Particles react to cursor movement
- **Performance Optimized**: Smooth 60fps animations

## 🚧 Database Schema

```prisma
model Task {
  id        String   @id @default(uuid())
  task      String
  completed Boolean  @default(false)
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the efficiency of Vim
- Built with modern React patterns
- Powered by the Next.js ecosystem

---

**Happy task managing with Vim efficiency!** ⚡