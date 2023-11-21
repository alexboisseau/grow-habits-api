import {
  HABIT_SEEDS_TRACKED_FROM,
  habitSeeds,
} from '../../../../../application/usecases/tests/seeds/habit.seeds';
import { trackedHabitSeeds } from '../../../../../application/usecases/tests/seeds/tracked-habit.seeds';
import { userSeeds } from '../../../../../application/usecases/tests/seeds/user.seeds';
import { formatDateToYYYYMMDD } from '../../../../../utils/format-date-to-YYYY-MM-DD';
import { PrismaService } from '../../../prisma/prisma.service';
import { PrismaTrackedHabitMapper } from '../../../repositories/habit/prisma/prisma-tracked-habit.mapper';
import { PrismaGetTrackedHabitsByDateAndUserIdQuery } from './prisma-get-tracked-habits-by-date-and-user-id-query';

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

    await prismaService.habit.create({
      data: habitSeeds.breakfast.props,
    });

    await prismaService.trackedHabit.create({
      data: trackedHabitSeeds.breakfast.props,
    });
  }

  const trackedHabitMapper = new PrismaTrackedHabitMapper();
  let prismaService: PrismaService;
  let query: PrismaGetTrackedHabitsByDateAndUserIdQuery;

  beforeAll(async () => {
    prismaService = new PrismaService();
    query = new PrismaGetTrackedHabitsByDateAndUserIdQuery(
      prismaService,
      trackedHabitMapper,
    );

    await initializeDatabase();
  });

  afterAll(async () => {
    await clearDatabase();
  });

  it('should return the habits to track depending on the date and the user', async () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      date: trackedHabitSeeds.breakfast.props.date,
    };

    const response = await query.execute(payload);

    expect(response.length).toEqual(1);
    expect(response[0].props).toEqual({
      id: trackedHabitSeeds.breakfast.props.id,
      date: trackedHabitSeeds.breakfast.props.date,
      status: trackedHabitSeeds.breakfast.props.status,
      habitId: trackedHabitSeeds.breakfast.props.habitId,
      userId: trackedHabitSeeds.breakfast.props.userId,
    });
  });

  it('should add new Tracked Habit to the array if it does not already exists', async () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      date: '2023-01-02',
    };

    const response = await query.execute(payload);

    expect(response.length).toEqual(1);
    expect(response[0].props).toEqual({
      id: '',
      date: payload.date,
      status: 'TO_COMPLETE',
      habitId: trackedHabitSeeds.breakfast.props.habitId,
      userId: trackedHabitSeeds.breakfast.props.userId,
    });
  });

  it('should returns multiple habits to track', async () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      date: formatDateToYYYYMMDD(HABIT_SEEDS_TRACKED_FROM),
    };

    await prismaService.habit.create({ data: habitSeeds.makeMyBed.props });
    const response = await query.execute(payload);

    expect(response.length).toEqual(2);
  });

  it('should returns an empty array if date is lower than trackedFrom field', async () => {
    const payload = {
      userId: userSeeds.alice.props.id,
      date: '1970-01-01',
    };

    const response = await query.execute(payload);

    expect(response.length).toEqual(0);
  });
});
