/// <reference path="imports/fs.ts"/>

declare const CONFIG: Config;

async function main()
{
  console.time(`Elapsed`);
  console.log(`Build.js`);

  try
  {
    if (typeof CONFIG === `undefined`) throw new BuildError(`Build config is not defined.`);
    CONFIG.destination ??= ``;
    CONFIG.includes ??= [];
    CONFIG.resources ??= {};

    if (!fs.existsSync(`build.js`))
    {
      throw new BuildError(`'build.js' was not found in working directory, are you running in correct folder?`);
    }

    let args = process.argv.slice(2);
    CONFIG.options = args.filter(arg => !arg.startsWith(`-`));
    CONFIG.parameters = args.filter(arg => arg.startsWith(`-`));

    CONFIG.configuration ??= CONFIG.options.at(0);
    CONFIG.release ??= CONFIG.parameters.includes(`--release`);

    if (fs.existsSync(`package.json`))
    {
      CONFIG.npm ??= true;
      CONFIG.package = JSON.parse(fs.readFileSync(`package.json`).toString());
    }
    else CONFIG.npm ??= false;

    if (fs.existsSync(`tsconfig.json`))
    {
      CONFIG.typescript ??= true;
      CONFIG.tsconfig = JSON.parse(fs.readFileSync(`tsconfig.json`).toString());

      if (fs.existsSync(`tsconfig.release.json`))
      {
        CONFIG.tsconfigRelease = JSON.parse(fs.readFileSync(`tsconfig.release.json`).toString());
      }
    }
    else CONFIG.typescript ??= false;

    console.log(`Building`
                + (CONFIG.configuration != null ? ` configuration '${CONFIG.configuration}'`
                                                : ` without configuration`)
                + ` in ${CONFIG.release ? `release` : `debug`} mode:`);

    await validate(CONFIG);
    await clean(CONFIG);
    await restore(CONFIG);
    await build(CONFIG);
    await postprocess(CONFIG);

    console.log();
    console.log(`\x1B[32mBuild succeeded.\x1B[0m`);
  }
  catch (e: any)
  {
    if (`message` in e)
    {
      console.log();
      console.log(`\x1B[91mError: ${e.message}\x1B[0m`);
    }

    console.log();
    console.log(`\x1B[91mBuild FAILED.\x1B[0m`);

    process.exitCode = -1;
  }

  console.log();
  console.timeEnd(`Elapsed`);
}
main().catch(reason => {throw reason});