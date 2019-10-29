import { Request } from 'express';

import { IUser } from '../models/User';

interface IRequest extends Request {
  user: IUser;
}

export default IRequest;
