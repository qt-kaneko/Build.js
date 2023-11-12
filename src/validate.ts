/// <reference path="types/Config.ts"/>
/// <reference path="types/BuildError.ts"/>

async function validate(config: Config)
{
  if (config.destination === ``)
  {
    throw new BuildError(`No destination specified.`);
  }

  if ([`.`, `./`, `./src`, `src`].includes(config.destination))
  {
    throw new BuildError(`Are you sure you want to delete all your sources on build ?) (why destination includes source files?)`);
  }

  if (fs.existsSync(config.destination) && !fs.readdirSync(config.destination).some(name => name.endsWith(`.js`)))
  {
    throw new BuildError(`No .js files found in '${config.destination}', is destination specified correctly?\n` +
                         `Remove '${config.destination}' manually if you are sure that this is correct behaviour.`);
  }

  if (config.esbuild)
  {
    if (config.esbuild.entry == null)
    {
      throw new BuildError(`Entry point was not provided for ESBuild.`);
    }
  }

  if (!(config.includes instanceof Array))
  {
    let configurations = Object.keys(config.includes);

    if (config.configuration == null)
    {
      throw new BuildError(`Configuration option was not provided, but multiple ['${configurations.join(`', '`)}'] configuratons exists.`);
    }

    if (!configurations.includes(config.configuration))
    {
      throw new BuildError(`Configuration '${config.configuration}' does not exists in ['${configurations.join(`', '`)}'].`);
    }
  }
}