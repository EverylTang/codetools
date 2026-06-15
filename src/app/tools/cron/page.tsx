import ToolLayout from "@/components/ToolLayout";
import CronClient from "./client";

export const metadata = {
  title: "Cron Expression Generator - Visual Cron Editor",
  description: "Free online cron expression generator and editor. Visual dropdown selects for minute, hour, day, month, and weekday. Calculate next 10 execution times instantly. Includes common presets like every hour, daily at midnight, weekdays at 9am.",
  keywords: ["cron", "cron expression", "cron job", "cron generator", "cron editor", "scheduled task", "crontab", "定时任务"],
  openGraph: {
    title: "Cron Expression Generator - Free Online Visual Cron Editor",
    description: "Generate cron expressions visually and calculate next execution times. Perfect for scheduling tasks and server automation.",
    type: "website",
  },
};

export default function CronPage() {
  return (
    <ToolLayout toolKey="cron" title="Cron Expression Generator" description="Build cron expressions visually using dropdown selectors. See the next 10 scheduled execution times in real-time. Paste a cron expression to analyze it, or use the presets for common schedules.">
      <CronClient />
    </ToolLayout>
  );
}