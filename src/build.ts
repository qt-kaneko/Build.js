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
    console.log(`  Copying includes -> ${config.destination}`);
    tasks.push(...includes.map(include => {
      let source: string;
      let destination: string;
      if (typeof include === `string`) source = destination = include;
      else [source, destination] = [include[0], include[1]];

      return fsp.cp(source, config.destination + `/` + destination, {recursive: true})
    }));
  }

  // Compile
  if (config.typescript)
  {
    console.log(`  Compiling...`);
    tasks.push(
      spawnAsync(`tsc`, [`--build`, (config.release ? `tsconfig.release.json` : `tsconfig.json`)], {stdio: `inherit`})
        .then(exitCode => exitCode !== 0 ? Promise.reject() : Promise.resolve())
    );
  }

  try {await Promise.all(tasks)}
  catch (e)
  {
    if (e instanceof Error)
    {
      throw new BuildError(e.message);
    }
    else throw e;
  }

  let outFile = <string|null>config.tsconfig![`compilerOptions`]?.[`outFile`];
  if (config.typescript && outFile != null)
  {
    let content = await fsp.readFile(outFile);
    let contentString = content.toString();

    if (!contentString.includes(`main?.(); // Build.js auto-generated`))
    {
      // TODO: Maybe place main?.(); before source map url
      // let sourceMap = contentString.indexOf(`//# sourceMappingURL=`);

      contentString += `\nmain?.(); // Build.js auto-generated`;

      await fsp.writeFile(outFile, contentString);
    }
  }

  if (tasks.length > 0)
  {
    config.buildArtifacts = fs.readdirSync(config.destination, {recursive: true})
                              .map(name => config.destination + `/` + name);
  }
}