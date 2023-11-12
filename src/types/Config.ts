interface Config
{
  destination: string;
  includes: string[] | string[][] | {[k: string]: string[] | string[][]};
  resources: {[k: string]: string};

  npm?: boolean;
  package?: {[k: string]: any};

  typescript?: boolean;
  tsconfig?: {[k: string]: any};
  tsconfigRelease?: {[k: string]: any};

  esbuild?: {
    entry: string;
    outFile?: string;
  };

  options?: string[];
  parameters?: string[];
  configuration?: string;
  release?: boolean;
  buildArtifacts?: string[];
}