package com.app.dto;

import java.util.Map;

public class UserNotificationStats {
    private long totalSent;
    private long totalRead;
    private double openRate;
    private double avgTimeToOpen; // in minutes
    private int bestHour;
    private Map<String, Long> typeBreakdown;

    public UserNotificationStats() {}

    // Getters and Setters
    public long getTotalSent() { return totalSent; }
    public void setTotalSent(long totalSent) { this.totalSent = totalSent; }
    public long getTotalRead() { return totalRead; }
    public void setTotalRead(long totalRead) { this.totalRead = totalRead; }
    public double getOpenRate() { return openRate; }
    public void setOpenRate(double openRate) { this.openRate = openRate; }
    public double getAvgTimeToOpen() { return avgTimeToOpen; }
    public void setAvgTimeToOpen(double avgTimeToOpen) { this.avgTimeToOpen = avgTimeToOpen; }
    public int getBestHour() { return bestHour; }
    public void setBestHour(int bestHour) { this.bestHour = bestHour; }
    public Map<String, Long> getTypeBreakdown() { return typeBreakdown; }
    public void setTypeBreakdown(Map<String, Long> typeBreakdown) { this.typeBreakdown = typeBreakdown; }

    public static UserNotificationStatsBuilder builder() {
        return new UserNotificationStatsBuilder();
    }

    public static class UserNotificationStatsBuilder {
        private UserNotificationStats stats = new UserNotificationStats();
        public UserNotificationStatsBuilder totalSent(long totalSent) { stats.setTotalSent(totalSent); return this; }
        public UserNotificationStatsBuilder totalRead(long totalRead) { stats.setTotalRead(totalRead); return this; }
        public UserNotificationStatsBuilder openRate(double openRate) { stats.setOpenRate(openRate); return this; }
        public UserNotificationStatsBuilder avgTimeToOpen(double avgTimeToOpen) { stats.setAvgTimeToOpen(avgTimeToOpen); return this; }
        public UserNotificationStatsBuilder bestHour(int bestHour) { stats.setBestHour(bestHour); return this; }
        public UserNotificationStatsBuilder typeBreakdown(Map<String, Long> typeBreakdown) { stats.setTypeBreakdown(typeBreakdown); return this; }
        public UserNotificationStats build() { return stats; }
    }
}

