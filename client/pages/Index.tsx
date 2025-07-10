import { useState } from "react";
import { Timer } from "@/components/Timer";
irdContent } from "@/components/ui/card";
import { Clock, BarChart3, History } from "lucide-react";

export date = () => {
    setRe
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}-auto px-4 py-4">
          r
                </h1>
                <p className="text-xs text-muted-foreground">
                  Time tracking made simple
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={activeView === "timer" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("timer")}
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                Timer
              </Button>
              <Button
                variant={activeView === "dashboard" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("dashboard")}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeView === "timer" ? (
          /* Timer View - Centered */
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
              <Timer onSessionUpdate={handleSessionUpdate} />

              {/* Mini Stats Below Timer */}
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-medium mb-2 text-sm">Quick Overview</h3>
                    <p className="text-xs text-muted-foreground">
                      Switch to Dashboard view for detailed analytics and
                      session history
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveView("dashboard")}
                      className="mt-3 gap-2"
                    >
                      <BarChart3 className="w-3 h-3" />
                      View Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Dashboard View - Full Viewport Height with Subsections */
          <div className="h-full flex flex-col">
            {/* Dashboard Header with Subsection Tabs */}
            <div className="px-6 py-4 border-b border-border bg-card/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Dashboard</h2>
                </div>

                {/* Subsection Tabs */}
                <div className="flex gap-2">
                  <Button
                    variant={
                      dashboardSection === "analytics" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setDashboardSection("analytics")}
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Button>
                  <Button
                    variant={
                      dashboardSection === "history" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setDashboardSection("history")}
                    className="gap-2"
                  >
                    <History className="w-4 h-4" />
                    History
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-hidden">
              {dashboardSection === "analytics" ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-auto p-6 py-2">
                    <Analytics refreshKey={refreshKey} />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="px-6 py-3 border-b border-border/50 bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      Review your recent work sessions
                    </p>
                  </div>
                  <div className="flex-1 overflow-hidden p-6">
                    <SessionList
                      refreshKey={refreshKey}
                      onSessionsUpdate={handleSessionUpdate}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border shrink-0">
        <div className="container mx-auto px-4 py-3 text-center text-xs text-muted-foreground">
          <p>WorkTrackr - Focus on what matters. Track your progress.</p>
        </div>
      </footer>
    </div>
  );
}
