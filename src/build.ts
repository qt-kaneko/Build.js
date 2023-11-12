/// <reference path="imports/fs.ts"/>
/// <reference path="imports/fsp.ts"/>

/// <reference path="types/Config.ts"/>
/// <reference path="types/BuildError.ts"/>

async function build(config: Config)
{
  let tasks: Promise<any>[] = [];

  if (!fs.existsSync(config.destination)) fs.mkdirSync(config.destination);

  // Copy includes
  let includes = (config.includes instanceof Array) ? config.includes
               : config.includes[config.configuration!];
  if (includes.length === 0) console.log(`  Nothing to include ¯\\_(ツ)_/¯`);
  else
  {
    tasks.push((async () => console.log(`  Copying includes -> ${config.destination}`))());
    tasks.push(...includes.map(include => {
      let source: string;
      let destination: string;
      if (typeof include === `string`) source = destination = include;
      else [source, destination] = [include[0], include[1]];

      return fsp.cp(source, config.destination + `/` + destination, {recursive: true})
    }));
  }

  // Compile
  if (config.typescript && !config.esbuild)
  {
    tasks.push((async () => {
      console.log(`  Compiling...`);

      let command = `tsc`;
      let options = [
        `--project`, (config.release && config.tsconfigRelease) ? `tsconfig.release.json` : `tsconfig.json`,
        `--outDir`, config.destination
      ];

      await spawnAsync(command, options, {stdio: `inherit`}).then(
        exitCode => exitCode !== 0 ? Promise.reject() : Promise.resolve()
      );
    })());
  }

  // Bundle
  if (config.esbuild)
  {
    tasks.push((async () => {
      console.log(`  Bundling...`);

      let command = `esbuild`;
      let options = [
        config.esbuild!.entry,
        `--log-level=warning`
      ];
      if (config.esbuild?.outFile) options.push(
        `--bundle`,
        `--outfile=${config.destination}/${config.esbuild!.outFile}`
      );
      if (!config.esbuild?.outFile) options.push(`--outdir=${config.destination}`);
      if (config.release && config.tsconfigRelease) options.push(`--tsconfig=tsconfig.release.json`);
      if (!config.release && config.tsconfig) options.push(`--tsconfig=tsconfig.json`);
      if (!config.release) options.push(`--sourcemap`);

      await spawnAsync(command, options, {stdio: `inherit`}).then(
        exitCode => exitCode !== 0 ? Promise.reject() : Promise.resolve()
      );
    })());
  }

  await Promise.all(tasks);

  if (tasks.length > 0)
  {
    config.buildArtifacts = fs.readdirSync(config.destination, {recursive: true})
                              .map(name => config.destination + `/` + name);
  }
}