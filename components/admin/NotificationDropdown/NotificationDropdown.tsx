"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"

interface Notification {
  id: string
  timestamp: string
  title: string
  description: string
  read: boolean
  relatedId?: string
  relatedType?: "event" | "template" | "campaign"
}

const NotificationDropdown: React.FC<{
  notifications: Notification[]
  onNotificationClick: (id: string) => void
}> = ({ notifications, onNotificationClick }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  useEffect(() => {
    const storedReadIds = JSON.parse(localStorage.getItem("palei-notification-read-ids") || "[]")
    ;(async () => {})()
  }, [notifications])

  const handleMarkAllRead = () => {
    localStorage.removeItem("palei-notification-read-ids")
    setUnreadCount(0)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-md hover:bg-gold/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="text-gold-light" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full w-3 h-3 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-lg bg-navy-dark shadow-lg py-4 start-1/2 -translate-x-1/2 z-50 max-h-96 overflow-y-auto"
        >
          <div className="border-b border-white/10 pb-4">
            <p className="text-xs text-muted/60 uppercase tracking-wider">
              {notifications.length} activities
            </p>
          </div>

          {notifications.map((notif) => {
            const isRead = notif.read

            return (
              <div
                key={notif.id}
                className="flex items-start gap-3 px-2 py-2 rounded-md cursor-pointer"
                onClick={() => onNotificationClick(notif.id)}
                role="button"
                tabIndex={0}
              >
<span
                  className={`bg-${isRead ? "gold/10" : "red-600"} w-2 h-2 rounded-full mr-3`}
                  style={{ width: "8px", height: "8px" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate line-clamp-1">
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted/60 truncate line-clamp-1">
                    {notif.description}
                  </p>
                </div>
              </div>
            )
          })}

          {notifications.some((n) => !n.read) && (
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-gold-light/60 hover:text-gold transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown