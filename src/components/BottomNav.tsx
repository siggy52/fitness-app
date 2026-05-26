import { NavLink } from 'react-router-dom'
import { Home, Calendar, Dumbbell, Apple, User, BookOpen } from 'lucide-react'

const navItems = [
  { path: '/home', label: '首页', icon: Home },
  { path: '/plan', label: '计划', icon: Calendar },
  { path: '/exercises', label: '动作库', icon: BookOpen },
  { path: '/workout', label: '训练', icon: Dumbbell },
  { path: '/nutrition', label: '饮食', icon: Apple },
  { path: '/profile', label: '我的', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-1 transition-all ${
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
