interface Config
{
  destination: string;
  includes: string[] | string[][] | {[k: string]: string[] | string[][]};
  resources: {[k: string]: string};

  npm?: boolean;
  package?: {[k: string]: any};
  options?: string[];
  parameters?: string[];
  configuration?: string;
  typescript: boolean;
  tsconfig?: {[k: string]: any};
  release?: boolean;
  buildArtifacts?: string[];
}