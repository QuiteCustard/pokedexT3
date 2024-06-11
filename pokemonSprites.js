
import fs from 'fs-extra';

const sourceDir = './node_modules/pokemon-sprites/sprites/pokemon/other/home';
const targetDir = './public/pokemon-sprites';

async function copyFiles() {
    try {
        await fs.copy(sourceDir, targetDir)
    } catch (err) {
        console.error(err)
    }
}
  
await copyFiles()