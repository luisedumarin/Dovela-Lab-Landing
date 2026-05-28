const sharp = require('sharp');
const path = require('path');
(async ()=>{
  try{
    const src = path.join(__dirname,'..','public','images','hero','hero.png');
    const outDir = path.join(__dirname,'..','public','images');
    const widths = [320,640,1200];
    for(const w of widths){
      const out = path.join(outDir,`hero-${w}.webp`);
      console.log('Creating', out);
      await sharp(src).resize({ width: w }).webp({ quality: 90 }).toFile(out);
    }
    console.log('Done');
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();