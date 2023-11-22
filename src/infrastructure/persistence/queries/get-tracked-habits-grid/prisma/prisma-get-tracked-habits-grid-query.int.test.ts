import { habitSeeds } from '../../../../../application/usecases/tests/seeds/habit.seeds';
import { trackedHabitSeeds } from '../../../../../application/usecases/tests/seeds/tracked-habit.seeds';
import { userSeeds } from '../../../../../application/usecases/tests/seeds/user.seeds';
import { HabitProps } from '../../../../../domain/entities/habit.entity';
import { TrackedHabitProps } from '../../../../../domain/entities/tracked-habit.entity';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaGetTrackedHabitsGridQuery } from './prisma-get-tracked-habits-grid-query';

describe('Query : Get tracked habits by date and user id', () => {
  async function clearDatabase() {
    await prismaService.trackedHabit.deleteMany({});
    await prismaService.habit.deleteMany({});
    await prismaService.user.deleteMany({});
  }

  async function initializeDatabase() {
    await prismaService.user.create({
      data: userSeeds.alice.props,
    });
  }

  async function createHabits(habitsProps: HabitProps[]) {
    await Promise.all(
      habitsProps.map(async (props) => {
        return await prismaService.habit.create({
          data: props,
        });
      }),
    );
  }

  async function createTrackedHabits(trackedHabitsProps: TrackedHabitProps[]) {
    await Promise.all(
      trackedHabitsProps.map(async (props) => {
        return await prismaService.trackedHabit.create({
          data: props,
        });
      }),
    );
  }

  const prismaService: PrismaService = new PrismaService();
  const query: PrismaGetTrackedHabitsGridQuery =
    new PrismaGetTrackedHabitsGridQuery(prismaService);

  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  describe('query response format', () => {
    it('should return a IGetTrackedHabitsGridQueryResponse', async () => {
      const payload = {
        userId: userSeeds.alice.props.id,
        year: 2023,
      };

      const response = await query.execute(payload);

      expect(response).toHaveLength(365);
      expect(
        response.every((item) => {
          return (
            item.date != null &&
            item.completedTrackedHabitsCount != null &&
            item.uncompletedTrackedHabitsCount != null &&
            item.habitsCount != null
          );
        }),
      ).toEqual(true);
    });
  });

  describe('leap year', () => {
    it('should return an array of 366 items for a leap year', async () => {
      const payload = {
        userId: userSeeds.alice.props.id,
        year: 2020,
      };

      const response = await query.execute(payload);

      expect(response).toHaveLength(366);
    });

    it('should return an array of 365 items for a standard year', async () => {
      const payload = {
        userId: userSeeds.alice.props.id,
        year: 2021,
      };

      const response = await query.execute(payload);

      expect(response).toHaveLength(365);
    });
  });

  describe('habitsCount property : 5 habits, two tracked from February, one from March 2023, one from May and one from September', () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      year: 2023,
    };

    beforeEach(async () => {
      await createHabits([
        {
          ...habitSeeds.breakfast.props,
          id: 'february-1',
          trackedFrom: new Date('2023-02-01'),
        },
        {
          ...habitSeeds.breakfast.props,
          id: 'february-2',
          trackedFrom: new Date('2023-02-01'),
        },
        {
          ...habitSeeds.breakfast.props,
          id: 'march-1',
          trackedFrom: new Date('2023-03-01'),
        },
        {
          ...habitSeeds.breakfast.props,
          id: 'may-1',
          trackedFrom: new Date('2023-05-01'),
        },
        {
          ...habitSeeds.breakfast.props,
          id: 'may-2',
          trackedFrom: new Date('2023-09-01'),
        },
      ]);
    });

    afterEach(async () => {
      await clearDatabase();
      await initializeDatabase();
    });

    const tests = [
      {
        habitsCount: 0,
        monthName: 'January',
        month: 0,
      },
      {
        habitsCount: 2,
        monthName: 'February',
        month: 1,
      },
      {
        habitsCount: 3,
        monthName: 'March',
        month: 2,
      },
      {
        habitsCount: 3,
        monthName: 'April',
        month: 3,
      },
      {
        habitsCount: 4,
        monthName: 'May',
        month: 4,
      },
      {
        habitsCount: 4,
        monthName: 'June',
        month: 5,
      },
      {
        habitsCount: 4,
        monthName: 'July',
        month: 6,
      },
      {
        habitsCount: 4,
        monthName: 'August',
        month: 7,
      },
      {
        habitsCount: 5,
        monthName: 'September',
        month: 8,
      },
      {
        habitsCount: 5,
        monthName: 'October',
        month: 9,
      },
      {
        habitsCount: 5,
        monthName: 'November',
        month: 10,
      },
      {
        habitsCount: 5,
        monthName: 'December',
        month: 11,
      },
    ];

    tests.forEach(({ habitsCount, monthName, month }) => {
      it(`should have habitsCount property equals to ${habitsCount} for ${monthName} month`, async () => {
        const response = await query.execute(payload);

        const items = response.filter((item) => {
          return item.date.getMonth() === month;
        });

        const result = items.every((item) => {
          return item.habitsCount === habitsCount;
        });

        expect(result).toEqual(true);
      });
    });
  });

  describe('completedTrackedHabits and uncompletedTrackedHabitsCount properties : 2 habits, one tracked from February, one from August. One tracked habit completed for each after one month', () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      year: 2023,
    };

    beforeEach(async () => {
      await createHabits([
        {
          ...habitSeeds.breakfast.props,
          trackedFrom: new Date('2023-02-01'),
        },
        {
          ...habitSeeds.breakfast.props,
          trackedFrom: new Date('2023-08-01'),
        },
      ]);

      await createTrackedHabits([
        {
          ...trackedHabitSeeds.breakfast.props,
          status: 'COMPLETED',
          date: '2023-02-10',
        },
        {
          ...trackedHabitSeeds.makeMyBed.props,
          status: 'COMPLETED',
          date: '2023-09-10',
        },
        {
          ...trackedHabitSeeds.breakfast.props,
          id: 'breakfast-2',
          status: 'COMPLETED',
          date: '2023-10-10',
        },
        {
          ...trackedHabitSeeds.makeMyBed.props,
          id: 'make-my-bed-2',
          status: 'COMPLETED',
          date: '2023-10-10',
        },
      ]);
    });

    afterEach(async () => {
      await clearDatabase();
      await initializeDatabase();
    });

    const tests = [
      {
        day: 1,
        month: 0,
        dayName: 'the 1st of January',
        completedTrackedHabitsCount: 0,
        uncompletedTrackedHabitsCount: 0,
      },
      {
        day: 10,
        month: 1,
        dayName: 'the 10th of February',
        completedTrackedHabitsCount: 1,
        uncompletedTrackedHabitsCount: 0,
      },
      {
        day: 10,
        month: 8,
        dayName: 'the 8th of August',
        completedTrackedHabitsCount: 1,
        uncompletedTrackedHabitsCount: 1,
      },
      {
        day: 10,
        month: 9,
        dayName: 'the 10th of October',
        completedTrackedHabitsCount: 2,
        uncompletedTrackedHabitsCount: 0,
      },
      {
        day: 31,
        month: 11,
        dayName: 'the 31th of December',
        completedTrackedHabitsCount: 0,
        uncompletedTrackedHabitsCount: 2,
      },
    ];

    tests.forEach(
      ({
        day,
        month,
        dayName,
        completedTrackedHabitsCount,
        uncompletedTrackedHabitsCount,
      }) => {
        it(`should have completedTrackedHabitsCount equals to ${completedTrackedHabitsCount} and uncompletedTrackedHabitsCount equals to ${uncompletedTrackedHabitsCount} for ${dayName}`, async () => {
          const response = await query.execute(payload);

          const trackedDay = response.find((item) => {
            return (
              item.date.getDate() === day && item.date.getMonth() === month
            );
          });

          expect(trackedDay?.completedTrackedHabitsCount).toEqual(
            completedTrackedHabitsCount,
          );
          expect(trackedDay?.uncompletedTrackedHabitsCount).toEqual(
            uncompletedTrackedHabitsCount,
          );
        });
      },
    );
  });
});
