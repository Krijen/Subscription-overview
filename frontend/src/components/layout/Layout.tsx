import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import styles from './Layout.module.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/subscriptions', label: 'Subscriptions', icon: '◈' },
  { to: '/subscriptions/add', label: 'Add New', icon: '+' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>S</span>
          <span className={styles.logoText}>Subscription Overview</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          {user && (
            <div className={styles.userSection}>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.displayName} className={styles.userAvatarImg} />
              ) : (
                <div className={styles.userAvatar}>
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.displayName}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
                ⇥
              </button>
            </div>
          )}
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
