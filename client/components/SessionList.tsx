import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { History, Trash2 } from "lucide-react";
import { getSessions, clearAllSessions, type WorkSession } from "@/lib/storage";
import { formatTime, formatDate, formatDuration } from "@/lib/time-utils";

interface SessionListProps {
  refreshKey: number;
  onSessionsUpdate: () => void;
}

export function SessionList({
  refreshKey,
  onSessionsUpdate,
}: SessionListProps) {
  const sessions = getSessions()
    .filter((s) => !s.isActive)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 20); // Show last 20 sessions

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to clear all session history? This cannot be undone.",
      )
    ) {
      clearAllSessions();
      onSessionsUpdate();
    }
  };

  const groupSessionsByDate = (sessions: WorkSession[]) => {
    const groups: { [key: string]: WorkSession[] } = {};

    sessions.forEach((session) => {
      const dateKey = formatDate(session.startTime);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Session History
        </CardTitle>
        {sessions.length > 0 && (
          <Button
            onClick={handleClearAll}
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No work sessions yet.</p>
            <p className="text-sm">
              Start your first timer to see history here.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 sticky top-0 bg-background">
                    {date}
                  </h4>
                  <div className="space-y-2 mb-4">
                    {dateSessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {formatTime(session.startTime)}
                            </span>
                            {session.endTime && (
                              <>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-sm font-medium">
                                  {formatTime(session.endTime)}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Duration: {formatDuration(session.duration)}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-primary">
                          {formatDuration(session.duration)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
