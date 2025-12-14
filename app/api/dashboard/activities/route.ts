import { getRecentStockActivities, getRecentTransactions } from "@/app/lib/models/dashboard";
import { NextResponse } from "next/server";

export async function GET() {
  const activitiesResult = await getRecentStockActivities();
  const transactionsResult = await getRecentTransactions();

  if (activitiesResult.status !== 200 || transactionsResult.status !== 200) {
    return NextResponse.json(
      {
        error: activitiesResult.error || transactionsResult.error || 'Failed to fetch dashboard data'
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    stockActivities: activitiesResult.data || [],
    recentTransactions: transactionsResult.data || []
  }, { status: 200 });
}