export interface IExceptionsMapper {
  map(error: Error): Error;
}
