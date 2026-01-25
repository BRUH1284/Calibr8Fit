import { db } from "@/db/db";
import { and, ColumnBaseConfig, gte, lt, sql, SQL, Table } from "drizzle-orm";
import { SQLiteColumn, SQLiteSelect } from "drizzle-orm/sqlite-core";

const DAY_MS = 24 * 60 * 60 * 1000;

export function createTimeSeriesQueryService<
  TTable extends Table & {
    time: SQLiteColumn<ColumnBaseConfig<"number", "SQLiteInteger">>;
  },
  Entity,
>(
  table: TTable,
  valueExpr: SQL<number> | SQLiteColumn<ColumnBaseConfig<"number", any>>,
  persistentFilter?: SQL<unknown>,
  baseSelect?: any,
  extraJoins?: <T extends SQLiteSelect>(query: T) => any,
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

    let query = db.select(baseSelect).from(table).where(where);

    if (extraJoins) query = extraJoins(query.$dynamic());

    return (await query) as unknown as Entity[];
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
    start = typeof start === "number" ? start : Math.floor(start.getTime());
    end = typeof end === "number" ? end : Math.floor(end.getTime());

    const LOCAL_OFFSET = new Date().getTimezoneOffset() * -60_000;

    const where = and(
      persistentFilter ?? and(),
      extraWhere ?? and(),
      gte(table.time, start),
      lt(table.time, end),
    );

    let query = db
      .select({
        ...baseSelect,
        date: sql<number>`((${table.time} + ${LOCAL_OFFSET})
        - ((${table.time} + ${LOCAL_OFFSET}) % ${DAY_MS}) - ${LOCAL_OFFSET})`,
        total: sql<number>`SUM(${valueExpr})`,
      })
      .from(table)
      .where(where)
      .groupBy(sql`1`);

    if (extraJoins) query = extraJoins(query.$dynamic());

    const rows = (await query) as Array<{ date: number; total: number }>;

    const totalsByDay = new Map<number, number>();
    if (fillDateGaps) {
      rows.forEach((r) => totalsByDay.set(r.date, r.total));

      for (let dt = start; dt < end; dt += DAY_MS)
        if (!totalsByDay.has(dt)) totalsByDay.set(dt, 0);
    }

    return Array.from(totalsByDay.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([date, value]) => ({
        date: new Date(date),
        value,
      }));
  };

  return { loadInTimeNumberRange, loadToday, loadDailySumInNumberRange };
}
