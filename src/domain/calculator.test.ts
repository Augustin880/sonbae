import { describe, expect, it } from 'vitest';
import { calculateRevenueEstimate } from '@/domain/calculator';

describe('calculateRevenueEstimate', () => {
  it('calculates gross and attendance-adjusted monthly revenue', () => {
    expect(
      calculateRevenueEstimate({
        attendanceRatePercent: 80,
        memberCount: 100,
        monthlyFee: 50,
      }),
    ).toEqual({
      attendanceAdjustedRevenue: 4000,
      expectedActiveMembers: 80,
      grossMonthlyRevenue: 5000,
    });
  });

  it('clamps negative values and attendance outside 0-100', () => {
    expect(
      calculateRevenueEstimate({
        attendanceRatePercent: 150,
        memberCount: -10,
        monthlyFee: 50,
      }),
    ).toEqual({
      attendanceAdjustedRevenue: 0,
      expectedActiveMembers: 0,
      grossMonthlyRevenue: 0,
    });
  });
});
