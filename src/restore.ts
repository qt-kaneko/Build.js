/// <reference path="imports/fs.ts"/>

/// <reference path="types/Config.ts"/>
/// <reference path="types/BuildError.ts"/>

async function restore(config: Config)
{
  if (!config.npm) return;
  if (fs.existsSync(`node_modules`)) return;

  let dependencies = <never[]>config.package![`dependencies`] ?? [];
  let devDependencies = <never[]>config.package![`devDependencies`] ?? [];
  if (dependencies.length === 0 && devDependencies.length === 0) return;

  console.log(`  Restoring...`);
  if (await spawnAsync(`npm`, [`install`], {stdio: [`inherit`, `ignore`, `inherit`]}) !== 0)
  {
    throw new BuildError(``);
  }
}