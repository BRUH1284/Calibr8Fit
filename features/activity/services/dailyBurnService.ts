import { db } from "@/db/db";
import { activities, dailyBurnTarget, userActivities } from "@/db/schema";
import { createSyncService } from "@/shared/services/createSyncService";
import { SyncEntityType } from "@/shared/services/syncTimeService";
import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { DailyBurnTarget } from "../types/dailyBurnTarget";

const loadInRange = async (
  start: number,
  end: number,
): Promise<DailyBurnTarget[]> => {
  const predicates = [
    eq(dailyBurnTarget.deleted, false),
    gte(dailyBurnTarget.modifiedAt, start),
    lt(dailyBurnTarget.modifiedAt, end),
  ];

  return await db
    .select({
      id: dailyBurnTarget.id,
      activityId: dailyBurnTarget.activityId,
      userActivityId: dailyBurnTarget.userActivityId,
      duration: dailyBurnTarget.duration,
      modifiedAt: dailyBurnTarget.modifiedAt,
      deleted: dailyBurnTarget.deleted,
      activity: {
        id: activities.id,
        majorHeading: activities.majorHeading,
        metValue: activities.metValue,
        description: activities.description,
      },
      userActivity: {
        id: userActivities.id,
        majorHeading: userActivities.majorHeading,
        metValue: userActivities.metValue,
        description: userActivities.description,
        modifiedAt: userActivities.modifiedAt,
        deleted: userActivities.deleted,
      },
    })
    .from(dailyBurnTarget)
    .leftJoin(activities, eq(dailyBurnTarget.activityId, activities.id))
    .leftJoin(
      userActivities,
      eq(dailyBurnTarget.userActivityId, userActivities.id),
    )
    .where(and(...predicates));
};

const loadToday = async (): Promise<DailyBurnTarget[]> => {
  const start = new Date().setHours(0, 0, 0, 0);
  const end = start + 24 * 60 * 60 * 1000;

  return loadInRange(start, end);
};

const syncService = createSyncService<
  typeof dailyBurnTarget,
  DailyBurnTarget,
  {
    id: string;
    activityId: string;
    duration: number;
    modifiedAt: string; // ISO date string from the server
    deleted: boolean;
  }
>({
  entityType: SyncEntityType.DailyBurnTarget,
  table: dailyBurnTarget,
  endpoint: "/daily-burn-target",
  collectionKey: "dailyBurnTargets",
  mapRemoteArrayToLocal: async (remote) => {
    const activitiesIdSet = new Set(
      (
        await db
          .select({ id: activities.id })
          .from(activities)
          .where(
            inArray(
              activities.id,
              remote.map((target) => target.id),
            ),
          )
      ).map((row) => row.id),
    );

    return remote.map((target) => ({
      ...target,
      activityId: activitiesIdSet.has(target.activityId)
        ? target.activityId
        : null,
      userActivityId: activitiesIdSet.has(target.activityId)
        ? null
        : target.activityId,
      activity: null,
      userActivity: null,
      modifiedAt: new Date(target.modifiedAt).getTime(), // Convert to unix timestamp
    }));
  },
  mapLocalArrayToRemote: async (local) =>
    local.map(({ userActivityId, ...target }) => ({
      ...target,
      activityId: target.activityId || userActivityId!, // Use activityId or userActivityId
      modifiedAt: new Date(target.modifiedAt).toISOString(), // Convert to ISO string for the server
    })),
  primaryKey: dailyBurnTarget.id,
  upsertSet: {
    activityId: sql.raw(`excluded.${dailyBurnTarget.activityId.name}`),
    userActivityId: sql.raw(`excluded.${dailyBurnTarget.userActivityId.name}`),
    duration: sql.raw(`excluded.${dailyBurnTarget.duration.name}`),
    modifiedAt: sql.raw(`excluded.${dailyBurnTarget.modifiedAt.name}`),
    deleted: sql.raw(`excluded.${dailyBurnTarget.deleted.name}`),
  },
});

export const dailyBurnService = {
  ...syncService,
  loadToday,
  loadInRange,
};
