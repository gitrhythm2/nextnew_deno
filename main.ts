import { join } from "https://deno.land/std/path/mod.ts";
import $ from "https://deno.land/x/dax/mod.ts";

const args = Deno.args;
let projectName = '';
let useTailwind = true;

for (const arg of args) {
  if (arg === '-h') {
    console.log('Usage: next-new [--ignore-tailwind] [project-name]');
    Deno.exit(0);
  } else if (arg === '--ignore-tailwind') {
    useTailwind = false;
  } else {
    projectName = arg;
  }
}

if (projectName === '') {
  console.error('プロジェクト名を指定してください');
  Deno.exit(1);
}

await $`pnpx create-next-app@latest
  --src-dir --ts --app --tailwind --use-pnpm --eslint --import-alias "@/*"
  ${useTailwind ? '--tailwind' : ''} ${projectName}
`;


Deno.chdir(join(Deno.cwd(), projectName));

const current = Deno.cwd();
const cssPath = join(current, 'src', 'app', 'globals.css');
await Deno.writeTextFile(cssPath, `\
@tailwind base;
@tailwind components;
@tailwind utilities;
`);

const pagePath = join(current, 'src', 'app', 'page.tsx');
await Deno.writeTextFile(pagePath, `\
export default function Home() {
  return (
    <div className="p-6">Hello Next!</div>
  );
}
`);
