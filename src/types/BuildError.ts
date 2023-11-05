class BuildError implements Error
{
  name = BuildError.prototype.constructor.name;
  message;

  constructor(message: string)
  {
    this.message = message;
  }
}