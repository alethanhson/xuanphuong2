interface AdminState {
  theme: "light" | "dark"
  sidebarCollapsed: boolean
  notifications: Notification[]
  filters: Record<string, unknown>
}

interface AdminActions {
  toggleTheme: () => void
  toggleSidebar: () => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  setFilter: (key: string, value: unknown) => void
}

export const useAdminStore = create<AdminState & AdminActions>((set) => ({
  theme: "light",
  sidebarCollapsed: false,
  notifications: [],
  filters: {},

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 5),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
}))

