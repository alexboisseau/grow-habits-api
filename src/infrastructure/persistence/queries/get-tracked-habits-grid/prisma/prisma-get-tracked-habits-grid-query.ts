import { Habit, Prisma } from '@prisma/client';
import {
  IGetTrackedHabitsGridQuery,
  IGetTrackedHabitsGridQueryRequest,
  IGetTrackedHabitsGridQueryResponse,
} from '../../../../../domain/ports/get-tracked-habits-grid-query.port';
import { PrismaService } from '../../../prisma/prisma.service';

type TrackedHabitsStats = {
  date: Date;
  completedTrackedHabitsCount: bigint;
};

type TrackedHabitsStatsMapValue = {
  date: Date;
  completedTrackedHabitsCount: number;
  uncompletedTrackedHabitsCount: number;
  habitsCount: number;
};

type TrackedHabitsStatsMap = Map<string, TrackedHabitsStatsMapValue>;

export class PrismaGetTrackedHabitsGridQuery
  implements IGetTrackedHabitsGridQuery
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    request: IGetTrackedHabitsGridQueryRequest,
  ): Promise<IGetTrackedHabitsGridQueryResponse> {
    const startDate = `${request.year}-01-01`;
    const endDate = `${request.year}-12-31`;

    const userHabits = await this.fetchHabitsTrackedFromDates({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId: request.userId,
    });

    if (userHabits.length === 0) {
      return this.generateTrackedHabitsGrid(
        request.year,
        userHabits,
        new Map(),
      );
    }

    const habitsId: string[] = userHabits.map((habit) => habit.id);

    const trackedHabitsStats = await this.fetchTrackedHabitsStats({
      userId: request.userId,
      startDate,
      endDate,
      habitsId,
    });

    const habitsStatsMap = this.generateTrackedHabitsStatsMap(
      trackedHabitsStats,
      userHabits,
    );

    return this.generateTrackedHabitsGrid(
      request.year,
      userHabits,
      habitsStatsMap,
    );
  }

  private async fetchHabitsTrackedFromDates(params: {
    startDate: Date;
    endDate: Date;
    userId: string;
  }) {
    return await this.prisma.habit.findMany({
      where: {
        userId: params.userId,
        trackedFrom: {
          gte: params.startDate,
          lte: params.endDate,
        },
      },
    });
  }

  private async fetchTrackedHabitsStats(params: {
    userId: string;
    startDate: string;
    endDate: string;
    habitsId: string[];
  }): Promise<TrackedHabitsStats[]> {
    return await this.prisma.$queryRaw`
      SELECT
        date::date AS date,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS "completedTrackedHabitsCount"
      FROM "TrackedHabit"
      WHERE "userId" = ${params.userId} 
      AND date BETWEEN ${params.startDate} AND ${params.endDate} 
      AND "habitId" IN (${Prisma.join(params.habitsId)})
      GROUP BY date::date
      ORDER BY date::date;
      `;
  }

  private generateDatesForYear(year: number) {
    const startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate.getTime() <= endDate.getTime()) {
      dates.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dates;
  }

  private generateTrackedHabitsStatsMap(
    trackedHabitsStats: TrackedHabitsStats[],
    userHabits: Habit[],
  ): TrackedHabitsStatsMap {
    return new Map(
      trackedHabitsStats.map((stats) => {
        const habitsCount = userHabits.filter((habit) => {
          return habit.trackedFrom <= stats.date;
        }).length;

        return [
          new Date(stats.date).toISOString(),
          {
            date: new Date(stats.date),
            completedTrackedHabitsCount: Number(
              stats.completedTrackedHabitsCount,
            ),
            uncompletedTrackedHabitsCount:
              habitsCount - Number(stats.completedTrackedHabitsCount),
            habitsCount,
          },
        ];
      }),
    );
  }

  private generateTrackedHabitsGrid(
    year: number,
    userHabits: Habit[],
    habitsStatsMap: TrackedHabitsStatsMap,
  ) {
    const datesForYear = this.generateDatesForYear(year);

    return datesForYear.map((date) => {
      const key = date.toISOString();

      const habitsCount = userHabits.filter((habit) => {
        return habit.trackedFrom <= date;
      }).length;

      return (
        habitsStatsMap.get(key) || {
          date,
          completedTrackedHabitsCount: 0,
          uncompletedTrackedHabitsCount: habitsCount,
          habitsCount,
        }
      );
    });
  }
}
