import { AuthenticatedRequest } from '../../shared/authenticated-request';

export class LoginPresenter {
  present(response: AuthenticatedRequest) {
    return {
      user: {
        id: response.user.props.id,
        email: response.user.props.email,
      },
    };
  }
}
