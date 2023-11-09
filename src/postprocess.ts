/// <reference path="imports/fs.ts"/>
/// <reference path="imports/fsp.ts"/>
/// <reference path="imports/buffer.ts"/>

/// <reference path="types/Config.ts"/>

async function postprocess(config: Config)
{
  console.log(`  Post-processing...`);

  await Promise.all(config.buildArtifacts!.map(async (path) => {
    let stat = await fsp.stat(path);
    if (!stat.isFile()) return;

    // ISSUE: May corrupt files if they are binary but look like valid utf-8
    let content = await fsp.readFile(path);
    if (!buffer.isUtf8(content)) return;

    let contentString = content.toString();

    let anyReplaced = false;
    for (let replaced = false; ; replaced = false)
    {
      for (let [key, value] of Object.entries(config.resources))
      {
        let target = `$(` + key.toUpperCase() + `)`;
        let replacement: string;

        const filePrefix = `file://`;
        if (value.startsWith(filePrefix))
        {
          let filePath = value.slice(filePrefix.length);
          let fileReplacement = await fsp.readFile(filePath);
          replacement = buffer.isUtf8(fileReplacement)
                      ? fileReplacement.toString()
                      : fileReplacement.toString(`base64`);
        }
        else replacement = value;

        if (!replaced && contentString.includes(target)) anyReplaced = replaced = true;
        contentString = contentString.replaceAll(target, replacement);
      }
      if (!replaced) break;
    }

    if (anyReplaced) await fsp.writeFile(path, contentString);
  }));
}