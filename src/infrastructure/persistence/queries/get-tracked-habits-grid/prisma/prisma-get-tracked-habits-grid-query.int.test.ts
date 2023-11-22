import { habitSeeds } from '../../../../../application/usecases/tests/seeds/habit.seeds';
import { trackedHabitSeeds } from '../../../../../application/usecases/tests/seeds/tracked-habit.seeds';
import { userSeeds } from '../../../../../application/usecases/tests/seeds/user.seeds';
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

  let prismaService: PrismaService;
  let query: PrismaGetTrackedHabitsGridQuery;

  beforeAll(async () => {
    prismaService = new PrismaService();
    query = new PrismaGetTrackedHabitsGridQuery(prismaService);

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
        response.filter((item) => {
          return (
            item.date != null &&
            item.completedTrackedHabitsCount != null &&
            item.uncompletedTrackedHabitsCount != null &&
            item.habitsCount != null
          );
        }).length,
      ).toEqual(response.length);
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

  describe('habitsCount property : 5 habits, two tracked from February, one from March 2023, two from May', () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      year: 2023,
    };

    beforeEach(async () => {
      await prismaService.habit.create({
        data: {
          ...habitSeeds.breakfast.props,
          id: 'february-1',
          trackedFrom: new Date('2023-02-01'),
        },
      });

      await prismaService.habit.create({
        data: {
          ...habitSeeds.breakfast.props,
          id: 'february-2',
          trackedFrom: new Date('2023-02-01'),
        },
      });

      await prismaService.habit.create({
        data: {
          ...habitSeeds.breakfast.props,
          id: 'march-1',
          trackedFrom: new Date('2023-03-01'),
        },
      });

      await prismaService.habit.create({
        data: {
          ...habitSeeds.breakfast.props,
          id: 'may-1',
          trackedFrom: new Date('2023-05-01'),
        },
      });

      await prismaService.habit.create({
        data: {
          ...habitSeeds.breakfast.props,
          id: 'may-2',
          trackedFrom: new Date('2023-05-01'),
        },
      });
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
        habitsCount: 5,
        monthName: 'May',
        month: 4,
      },
      {
        habitsCount: 5,
        monthName: 'June',
        month: 5,
      },
      {
        habitsCount: 5,
        monthName: 'July',
        month: 6,
      },
      {
        habitsCount: 5,
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

        expect(
          items.filter((item) => {
            return item.habitsCount === habitsCount;
          }),
        ).toHaveLength(items.length);
      });
    });
  });

  describe('completedTrackedHabits and uncompletedTrackedHabitsCount properties : 2 habits, one tracked from February, one from August. One tracked habit completed for each after one month', () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      year: 2023,
    };

    beforeEach(async () => {
      await prismaService.habit.create({
        data: {
          ...habitSeeds.breakfast.props,
          trackedFrom: new Date('2023-02-01'),
        },
      });

      await prismaService.habit.create({
        data: {
          ...habitSeeds.makeMyBed.props,
          trackedFrom: new Date('2023-08-01'),
        },
      });

      await prismaService.trackedHabit.create({
        data: {
          ...trackedHabitSeeds.breakfast.props,
          status: 'COMPLETED',
          date: '2023-02-10',
        },
      });

      await prismaService.trackedHabit.create({
        data: {
          ...trackedHabitSeeds.makeMyBed.props,
          status: 'COMPLETED',
          date: '2023-09-10',
        },
      });

      await prismaService.trackedHabit.create({
        data: {
          ...trackedHabitSeeds.breakfast.props,
          id: 'breakfast-2',
          status: 'COMPLETED',
          date: '2023-10-10',
        },
      });

      await prismaService.trackedHabit.create({
        data: {
          ...trackedHabitSeeds.makeMyBed.props,
          id: 'make-my-bed-2',
          status: 'COMPLETED',
          date: '2023-10-10',
        },
      });
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
