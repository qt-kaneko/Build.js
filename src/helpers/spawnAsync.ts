/// <reference path="../imports/cp.ts"/>

function spawnAsync(command: string, args: string[],
                    options: {}) : Promise<number | null>
{
  return new Promise(resolve =>
    cp.spawn(command, args, options)
      .on(`exit`, code => resolve(code))
  );
}