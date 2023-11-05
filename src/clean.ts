/// <reference path="imports/fsp.ts"/>

/// <reference path="types/Config.ts"/>

async function clean(config: Config)
{
  let tasks: Promise<any>[] = [];

  if (!config.release) return; // Clean only in Release

  // Remove typescript build cache (like .tsbuildinfo)
  if (config.typescript)
  {
    tasks.push(
      spawnAsync(`tsc`, [`--build`, `--clean`, `tsconfig.json`], {stdio: `inherit`}),
      spawnAsync(`tsc`, [`--build`, `--clean`, `tsconfig.release.json`], {stdio: `inherit`}),
    );
  }

  // Remove build artifacts
  tasks.push(
    fsp.rm(config.destination, {recursive: true, force: true})
  );

  console.log(`  Cleaning...`);
  try {await Promise.all(tasks)}
  catch (e)
  {
    if (e instanceof Error)
    {
      throw new BuildError(e.message);
    }
    else throw e;
  }
}