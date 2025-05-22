// Mock API functions for the dashboard

// Dashboard stats
export async function fetchDashboardStats() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate dates for the last 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  })

  return {
    totalUsers: 12458,
    userGrowth: 12,
    activeUsers: 8721,
    activeUserGrowth: 8,
    totalPosts: 45672,
    postGrowth: 15,
    totalPoints: 1250000,
    pointsGrowth: 5,
    reportedContent: 42,
    reportedContentGrowth: -8,
    actionsTaken: 36,
    actionsTakenGrowth: 12,
    pendingActions: 18,
    pendingActionsGrowth: -15,

    // Community overview chart data
    communityOverview: dates.map((date, i) => ({
      date,
      users: 8000 + Math.floor(Math.random() * 2000) + i * 50,
      posts: 1000 + Math.floor(Math.random() * 500) + i * 30,
      engagement: 20 + Math.floor(Math.random() * 30),
    })),

    // Recent registrations
    recentRegistrations: [
      {
        id: "1",
        name: "Emma Wilson",
        email: "emma@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "2023-05-21T10:30:00",
        status: "verified",
      },
      {
        id: "2",
        name: "James Rodriguez",
        email: "james@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "2023-05-20T14:45:00",
        status: "pending",
      },
      {
        id: "3",
        name: "Sophia Chen",
        email: "sophia@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "2023-05-19T09:15:00",
        status: "verified",
      },
      {
        id: "4",
        name: "Michael Johnson",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "2023-05-18T16:20:00",
        status: "pending",
      },
      {
        id: "5",
        name: "Olivia Brown",
        email: "olivia@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        date: "2023-05-17T11:10:00",
        status: "verified",
      },
    ],

    // User activity chart data
    userActivity: dates.slice(-14).map((date, i) => ({
      date,
      activeUsers: 5000 + Math.floor(Math.random() * 1500) + i * 100,
      engagement: 40 + Math.floor(Math.random() * 20),
    })),

    // Content volume chart data
    contentVolume: dates.slice(-14).map((date) => ({
      date,
      posts: 500 + Math.floor(Math.random() * 300),
      announcements: 50 + Math.floor(Math.random() * 30),
      events: 20 + Math.floor(Math.random() * 15),
      services: 100 + Math.floor(Math.random() * 50),
    })),
  }
}

// Moderation data
export async function fetchModerationData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    reportedContent: [
      {
        id: "1",
        user: {
          name: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        type: "post",
        content:
          "This is a reported post that contains potentially inappropriate content that needs to be reviewed by a moderator.",
        date: "2023-05-21T10:30:00",
        reportCount: 5,
        reason: "Inappropriate content",
      },
      {
        id: "2",
        user: {
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        type: "user",
        content:
          "This user has been reported for repeatedly violating community guidelines and posting spam across multiple threads.",
        date: "2023-05-20T14:45:00",
        reportCount: 8,
        reason: "Spam",
      },
      {
        id: "3",
        user: {
          name: "David Lee",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        type: "event",
        content:
          "This event has been reported for containing misleading information about the time, location, and purpose of the gathering.",
        date: "2023-05-19T09:15:00",
        reportCount: 3,
        reason: "Misleading information",
      },
    ],

    actionsTaken: [
      {
        id: "1",
        action: "Removed",
        contentType: "Post",
        moderator: "Admin",
        date: "2023-05-21T10:30:00",
      },
      {
        id: "2",
        action: "Suspended",
        contentType: "User",
        moderator: "Admin",
        date: "2023-05-20T14:45:00",
      },
      {
        id: "3",
        action: "Approved",
        contentType: "Event",
        moderator: "Moderator",
        date: "2023-05-19T09:15:00",
      },
      {
        id: "4",
        action: "Removed",
        contentType: "Announcement",
        moderator: "Admin",
        date: "2023-05-18T16:20:00",
      },
      {
        id: "5",
        action: "Warned",
        contentType: "User",
        moderator: "Moderator",
        date: "2023-05-17T11:10:00",
      },
    ],

    pendingActions: [
      {
        id: "1",
        contentType: "Post",
        date: "2023-05-21T10:30:00",
      },
      {
        id: "2",
        contentType: "User",
        date: "2023-05-20T14:45:00",
      },
      {
        id: "3",
        contentType: "Event",
        date: "2023-05-19T09:15:00",
      },
      {
        id: "4",
        contentType: "Announcement",
        date: "2023-05-18T16:20:00",
      },
      {
        id: "5",
        contentType: "Service",
        date: "2023-05-17T11:10:00",
      },
    ],
  }
}

// Users data
export async function fetchUsers() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    users: [
      {
        id: "1",
        name: "Emma Wilson",
        email: "emma@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        role: "Member",
        joinDate: "2023-01-15T10:30:00",
        points: 1250,
      },
      {
        id: "2",
        name: "James Rodriguez",
        email: "james@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        role: "Moderator",
        joinDate: "2022-11-20T14:45:00",
        points: 3750,
      },
      {
        id: "3",
        name: "Sophia Chen",
        email: "sophia@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "suspended",
        role: "Member",
        joinDate: "2023-02-19T09:15:00",
        points: 850,
      },
      {
        id: "4",
        name: "Michael Johnson",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        role: "Admin",
        joinDate: "2022-08-18T16:20:00",
        points: 5200,
      },
      {
        id: "5",
        name: "Olivia Brown",
        email: "olivia@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "inactive",
        role: "Member",
        joinDate: "2023-03-17T11:10:00",
        points: 320,
      },
      {
        id: "6",
        name: "William Davis",
        email: "william@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        role: "Member",
        joinDate: "2023-04-16T13:25:00",
        points: 980,
      },
      {
        id: "7",
        name: "Ava Martinez",
        email: "ava@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "active",
        role: "Moderator",
        joinDate: "2022-12-15T08:40:00",
        points: 2800,
      },
      {
        id: "8",
        name: "Ethan Thompson",
        email: "ethan@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        status: "suspended",
        role: "Member",
        joinDate: "2023-01-14T15:55:00",
        points: 150,
      },
    ],
  }
}

// Points data
export async function fetchPointsData() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    totalPoints: 1250000,
    pointsEarned: 85000,
    pointsSpent: 62000,

    // Points distribution chart data
    pointsDistribution: [
      { name: "Content Creation", value: 450000, color: "#E74B3B" },
      { name: "Engagement", value: 350000, color: "#3b82f6" },
      { name: "Events", value: 250000, color: "#22c55e" },
      { name: "Services", value: 200000, color: "#a855f7" },
    ],

    // Points activity
    pointsActivity: [
      {
        id: "1",
        user: {
          name: "Emma Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        action: "Created a popular post",
        points: 50,
        date: "2023-05-21T10:30:00",
        type: "earned",
      },
      {
        id: "2",
        user: {
          name: "James Rodriguez",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        action: "Purchased premium feature",
        points: 200,
        date: "2023-05-20T14:45:00",
        type: "spent",
      },
      {
        id: "3",
        user: {
          name: "Sophia Chen",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        action: "Organized community event",
        points: 100,
        date: "2023-05-19T09:15:00",
        type: "earned",
      },
      {
        id: "4",
        user: {
          name: "Michael Johnson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        action: "Redeemed reward",
        points: 150,
        date: "2023-05-18T16:20:00",
        type: "spent",
      },
      {
        id: "5",
        user: {
          name: "Olivia Brown",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        action: "Daily login streak bonus",
        points: 25,
        date: "2023-05-17T11:10:00",
        type: "earned",
      },
    ],
  }
}

// Events data
export async function fetchEvents() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate dates for the next 30 days
  const today = new Date()
  const events = []

  // Create some events for the current month
  for (let i = 0; i < 10; i++) {
    const eventDate = new Date(today)
    eventDate.setDate(today.getDate() + Math.floor(Math.random() * 30))

    const event = {
      id: `event-${i + 1}`,
      title: `Community Event ${i + 1}`,
      description: `This is a description for community event ${i + 1}. Join us for this exciting gathering!`,
      date: eventDate.toISOString(),
      endTime: `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? "30" : "00"} PM`,
      location: `Location ${i + 1}`,
      attendees: Math.floor(Math.random() * 100) + 10,
      status: i === 0 ? "live" : i < 3 ? "upcoming" : "scheduled",
    }

    events.push(event)
  }

  return {
    events,
  }
}
