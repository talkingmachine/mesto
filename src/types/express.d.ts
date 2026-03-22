/* eslint-disable no-unused-vars */
declare namespace Express {
  interface Request {
    user: { _id: string };
  }
}
// а то type error'ы при req.user
