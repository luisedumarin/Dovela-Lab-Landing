const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDirs = [path.join(__dirname, '..', 'FOTOSCURSO'), path.join(__dirname, '..', 'FOTOSECCION')];
const outDir = path.join(__dirname, '..', 'public', 'images');
const widths = [320, 640, 1200];

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function processImage(filePath){
  const ext = path.extname(filePath).toLowerCase();
  const name = path.basename(filePath, ext).replace(/\s+/g,'-');
  for(const w of widths){
    const outName = `${name}-${w}${ext}`;
    const outPath = path.join(outDir, outName);
    await sharp(filePath).resize({ width: w }).toFile(outPath).catch(err=>console.error('sharp err', err));
    // also webp
    const outWebp = path.join(outDir, `${name}-${w}.webp`);
    await sharp(filePath).resize({ width: w }).webp({quality:80}).toFile(outWebp).catch(err=>console.error('sharp err', err));
  }
}

(async ()=>{
  for(const dir of srcDirs){
    if(!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f=>/\.png$|\.jpg$|\.jpeg$/i.test(f));
    for(const f of files){
      const full = path.join(dir,f);
      console.log('Processing', full);
      await processImage(full);
    }
  }
  console.log('Done optimizing images. Output -> public/images');
})();
