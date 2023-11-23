import { User } from '../../domain/entities/user.entity';

export type AuthenticatedRequest = Request & { user: User };
