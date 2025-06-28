export interface WorkSession {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
  isActive: boolean;
}

export interface TimeStats {
  totalToday: number;
  totalWeek: number;
  dailyAverage: number;
  dailyData: { date: string; hours: number }[];
}

const SESSIONS_KEY = "worktrackr_sessions";

export const saveSession = (session: WorkSession): void => {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getSessions = (): WorkSession[] => {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    if (!stored) return [];

    const sessions = JSON.parse(stored);
    return sessions.map((s: any) => ({
      ...s,
      startTime: new Date(s.startTime),
      endTime: s.endTime ? new Date(s.endTime) : null,
    }));
  } catch {
    return [];
  }
};

export const getActiveSession = (): WorkSession | null => {
  const sessions = getSessions();
  return sessions.find((s) => s.isActive) || null;
};

export const calculateStats = (): TimeStats => {
  const sessions = getSessions();
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  // Calculate today's total
  const todaySessions = sessions.filter(
    (s) => s.startTime >= startOfToday && !s.isActive,
  );
  const totalToday = todaySessions.reduce((sum, s) => sum + s.duration, 0);

  // Calculate week's total
  const weekSessions = sessions.filter(
    (s) => s.startTime >= startOfWeek && !s.isActive,
  );
  const totalWeek = weekSessions.reduce((sum, s) => sum + s.duration, 0);

  // Calculate daily average (last 7 days)
  const dailyData: { date: string; hours: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const daySessions = sessions.filter(
      (s) => s.startTime >= date && s.startTime < nextDay && !s.isActive,
    );
    const dayTotal = daySessions.reduce((sum, s) => sum + s.duration, 0);

    dailyData.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      hours: Math.round((dayTotal / 3600) * 10) / 10,
    });
  }

  const dailyAverage = dailyData.reduce((sum, d) => sum + d.hours, 0) / 7;

  return {
    totalToday,
    totalWeek,
    dailyAverage,
    dailyData,
  };
};

export const clearAllSessions = (): void => {
  localStorage.removeItem(SESSIONS_KEY);
};
