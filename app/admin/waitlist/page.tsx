import { db } from "@/db/drizzle";
import { waitlist } from "@/db/schema";
import { desc } from "drizzle-orm";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users, Mail, Calendar } from "lucide-react";

export default async function AdminWaitlistPage() {
  const session = await authClient.getSession();
  
  // Redirect if not authenticated
  if (!session.data) {
    redirect("/login");
  }

  // Fetch all waitlist entries
  const waitlistEntries = await db
    .select()
    .from(waitlist)
    .orderBy(desc(waitlist.createdAt));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Waitlist Management</h1>
        <p className="text-muted-foreground">
          View and manage users who have joined the waitlist
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Waitlist</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitlistEntries.length}</div>
            <p className="text-xs text-muted-foreground">
              People waiting for access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {waitlistEntries.filter(entry => {
                const createdAt = new Date(entry.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return createdAt > weekAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Joined in the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Waitlist Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitlistEntries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No one has joined the waitlist yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Joined</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.map((entry, index) => (
                    <tr key={entry.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{entry.email}</td>
                      <td className="py-3 px-4">
                        {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}