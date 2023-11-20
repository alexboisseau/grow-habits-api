import { TrackedHabit } from '../../../../domain/entities/tracked-habit.entity';
import { formatDateToYYYYMMDD } from '../../../../utils/format-date-to-YYYY-MM-DD';
import { HABIT_SEEDS_TRACKED_FROM, habitSeeds } from './habit.seeds';

export const trackedHabitSeeds = {
  makeMyBed: new TrackedHabit({
    id: 'id-1',
    date: formatDateToYYYYMMDD(HABIT_SEEDS_TRACKED_FROM),
    habitId: habitSeeds.makeMyBed.props.id,
    status: 'TO_COMPLETE',
    userId: habitSeeds.makeMyBed.props.userId,
  }),
  breakfast: new TrackedHabit({
    id: 'id-2',
    date: formatDateToYYYYMMDD(HABIT_SEEDS_TRACKED_FROM),
    habitId: habitSeeds.breakfast.props.id,
    status: 'COMPLETED',
    userId: habitSeeds.breakfast.props.userId,
  }),
};
