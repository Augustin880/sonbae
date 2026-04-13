export type RevenueEstimateInput = {
  memberCount: number;
  monthlyFee: number;
  attendanceRatePercent: number;
};

export type RevenueEstimate = {
  expectedActiveMembers: number;
  grossMonthlyRevenue: number;
  attendanceAdjustedRevenue: number;
};

export function calculateRevenueEstimate(input: RevenueEstimateInput): RevenueEstimate {
  const memberCount = Math.max(0, input.memberCount);
  const monthlyFee = Math.max(0, input.monthlyFee);
  const attendanceRate = Math.min(100, Math.max(0, input.attendanceRatePercent)) / 100;
  const grossMonthlyRevenue = memberCount * monthlyFee;

  return {
    expectedActiveMembers: Math.round(memberCount * attendanceRate),
    grossMonthlyRevenue,
    attendanceAdjustedRevenue: grossMonthlyRevenue * attendanceRate,
  };
}
