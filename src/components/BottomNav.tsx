import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Calendar, Plus, PieChart, User } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/home', icon: Home, label: '首页' },
  { path: '/plan', icon: Calendar, label: '计划' },
  { path: '/workout', icon: Plus, label: '训练', isFab: true },
  { path: '/dashboard', icon: PieChart, label: '统计' },
  { path: '/profile', icon: User, label: '我的' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="flex items-center gap-2 px-3 h-[70px] rounded-[35px]"
        style={{
          background: 'rgba(26,26,26,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentPath === item.path

          if (item.isFab) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="fab mx-1"
                aria-label={item.label}
              >
                <Plus className="w-7 h-7 text-black" strokeWidth={2.5} />
              </button>
            )
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-[50px] h-[50px] rounded-[25px] flex items-center justify-center
                transition-all duration-300 ease-out
                ${isActive
                  ? 'bg-neon text-dark-bg'
                  : 'text-dark-muted hover:text-white'
                }
              `}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
