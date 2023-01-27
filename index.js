import fs from "fs-extra";
import puppeteer from "puppeteer-core";
import path from "path";

export async function fit(src, dest, options = { silent: false }){
    let opts = Object.assign({
        puppeteer: {
            args: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
            executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
        }
    }, options);

    let inputs;

    if(fs.existsSync(src)){
        if(fs.lstatSync(src).isDirectory()){
            inputs = fs.readdirSync(src).map(src => {src});
        } else {
            inputs = [{src}];
        }
    }

    let destIsFile = path.extname(dest) === '.svg';
    let destPath = destIsFile ? path.dirname(dest) : dest;

    fs.mkdirpSync(destPath);

    inputs = inputs.map(input => {
        return {
            src: input.src,
            dest: destIsFile ? destPath : `${destPath}/${path.basename(input.src)}`
        };
    });

    const browser = await puppeteer.launch({
        executablePath: opts.puppeteer.executablePath,
        args: opts.puppeteer.args,
    });

    try{
        const page = await browser.newPage();

        for(let i = inputs.length; i--;){
            let input = inputs[i];
            let svg = fs.readFileSync(input.src, {encoding: 'utf8'});

            await page.setContent(svg);
                
            const result = await (await page.waitForSelector("svg")).evaluate((el) => {
                let { x, y, width, height } = el.getBBox();
                
                el.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
                
                if(el.hasAttribute('width')){
                    el.setAttribute('width', width);
                }
                
                if(el.hasAttribute('height')){
                    el.setAttribute('height', height);
                }

                return el.outerHTML;
            });

            fs.writeFileSync(`${input.dest}`, result);

            if(!opts.silent){
                console.log(`${input.src} fitted.`);
            }
        }
    } catch(e){console.log(e);}

    await browser.close();
}

export default {
    fit
};