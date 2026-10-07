import fs from 'node:fs/promises';
import path from 'node:path';

export async function readShotTree(root) {
  const tree = [];
  async function walk(directory, relative) {
    const entries = await fs.readdir(directory, {withFileTypes: true});
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const absolute = path.join(directory, entry.name);
      const filePath = relative + '/' + entry.name;
      if (entry.isDirectory()) await walk(absolute, filePath);
      else if (entry.isFile()) tree.push({path: filePath, type: 'blob', size: (await fs.stat(absolute)).size});
    }
  }
  await walk(path.join(root, 'shots'), 'shots');
  return {tree, truncated: false};
}
