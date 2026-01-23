import { db } from "@/db/db";
import { and, ColumnBaseConfig, gte, lt, sql, SQL, Table } from "drizzle-orm";
import { SQLiteColumn } from "drizzle-orm/sqlite-core";

const DAY_SECONDS = 24 * 60 * 60;

export function createTimeSeriesQueryService<
  TTable extends Table & {
    time: SQLiteColumn<ColumnBaseConfig<"number", "SQLiteInteger">>;
  },
  Entity,
>(
  table: TTable,
  sumColumn: SQLiteColumn<ColumnBaseConfig<"number", "SQLiteReal">>,
  persistentFilter?: SQL<unknown>,
) {
  const loadInTimeNumberRange = async (
    start: number,
    end: number,
    extraWhere?: SQL<unknown>,
  ): Promise<Entity[]> => {
    const where = and(
      persistentFilter ?? and(),
      extraWhere ?? and(),
      gte(table.time, start),
      lt(table.time, end),
    );

    // Load data from the database
    return (await db.select().from(table).where(where)) as unknown as Entity[];
  };

  const loadToday = async (extraWhere?: SQL<unknown>) =>
    loadInTimeNumberRange(
      new Date().setHours(0, 0, 0, 0),
      new Date().setHours(24, 0, 0, 0),
      extraWhere,
    );

  const loadDailySumInNumberRange = async (
    start: number | Date,
    end: number | Date,
    fillDateGaps: boolean = true,
    extraWhere?: SQL<unknown>,
  ): Promise<{ date: Date; value: number }[]> => {
    start =
      typeof start === "number" ? start : Math.floor(start.getTime() / 1000);
    end = typeof end === "number" ? end : Math.floor(end.getTime() / 1000);

    const where = and(
      persistentFilter ?? and(),
      extraWhere ?? and(),
      gte(table.time, start * 1000),
      lt(table.time, end * 1000),
    );

    const rows = await db
      .select({
        date: sql<number>`strftime('%s', datetime(${table.time} / 1000, 'unixepoch', 'localtime', 'start of day', 'utc'))`,
        total: sql<number>`SUM(${sumColumn})`,
      })
      .from(table)
      .where(where)
      .groupBy(sql`1`);

    const totalsByDay = new Map<number, number>();
    if (fillDateGaps) {
      rows.forEach((r) => totalsByDay.set(r.date, r.total));

      for (let dt = start; dt < end; dt += DAY_SECONDS)
        if (!totalsByDay.has(dt)) totalsByDay.set(dt, 0);
    }

    return Array.from(totalsByDay.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([date, value]) => ({
        date: new Date(date * 1000),
        value,
      }));
  };

  return { loadInTimeNumberRange, loadToday, loadDailySumInNumberRange };
}
