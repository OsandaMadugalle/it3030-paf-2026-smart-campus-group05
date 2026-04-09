package com.app.dto;

import java.util.List;
import java.util.Map;

public class SystemNotificationStats {
    private long totalToday;
    private long totalWeek;
    private double overallOpenRate;
    private List<Map<String, Object>> topEngagedUsers;
    private Map<Integer, Long> peakHours;
    private Map<String, Double> openRateByType;

    public SystemNotificationStats() {}

    // Getters and Setters
    public long getTotalToday() { return totalToday; }
    public void setTotalToday(long totalToday) { this.totalToday = totalToday; }
    public long getTotalWeek() { return totalWeek; }
    public void setTotalWeek(long totalWeek) { this.totalWeek = totalWeek; }
    public double getOverallOpenRate() { return overallOpenRate; }
    public void setOverallOpenRate(double overallOpenRate) { this.overallOpenRate = overallOpenRate; }
    public List<Map<String, Object>> getTopEngagedUsers() { return topEngagedUsers; }
    public void setTopEngagedUsers(List<Map<String, Object>> topEngagedUsers) { this.topEngagedUsers = topEngagedUsers; }
    public Map<Integer, Long> getPeakHours() { return peakHours; }
    public void setPeakHours(Map<Integer, Long> peakHours) { this.peakHours = peakHours; }
    public Map<String, Double> getOpenRateByType() { return openRateByType; }
    public void setOpenRateByType(Map<String, Double> openRateByType) { this.openRateByType = openRateByType; }

    public static SystemNotificationStatsBuilder builder() {
        return new SystemNotificationStatsBuilder();
    }

    public static class SystemNotificationStatsBuilder {
        private SystemNotificationStats stats = new SystemNotificationStats();
        public SystemNotificationStatsBuilder totalToday(long totalToday) { stats.setTotalToday(totalToday); return this; }
        public SystemNotificationStatsBuilder totalWeek(long totalWeek) { stats.setTotalWeek(totalWeek); return this; }
        public SystemNotificationStatsBuilder overallOpenRate(double overallOpenRate) { stats.setOverallOpenRate(overallOpenRate); return this; }
        public SystemNotificationStatsBuilder topEngagedUsers(List<Map<String, Object>> topEngagedUsers) { stats.setTopEngagedUsers(topEngagedUsers); return this; }
        public SystemNotificationStatsBuilder peakHours(Map<Integer, Long> peakHours) { stats.setPeakHours(peakHours); return this; }
        public SystemNotificationStatsBuilder openRateByType(Map<String, Double> openRateByType) { stats.setOpenRateByType(openRateByType); return this; }
        public SystemNotificationStats build() { return stats; }
    }
}

