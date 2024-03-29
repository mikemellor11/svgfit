import fs from "fs-extra";
import puppeteer from "puppeteer";
import path from "path";

export async function fit(srcs, dests, options = { silent: false }){
    if(typeof srcs !== 'string' && !Array.isArray(srcs)){
        throw new Error('src must be an array or a string.');
    }

    if(typeof dests !== 'string' && !Array.isArray(dests)){
        throw new Error('dest must be an array or a string.');
    }

    let opts = Object.assign({
        puppeteer: {
            args: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        }
    }, options);

    srcs = Array.isArray(srcs) ? srcs : [srcs];
    dests = Array.isArray(dests) ? dests : [dests];

    if(srcs.length !== dests.length && dests.find(d => path.extname(d) === '.svg')){
        throw new Error('uneven number of src and dest files.');
    }

    let inputs;

    try{
        inputs = srcs.reduce((concat, src, i) => {
            let arr = [];

            if(fs.existsSync(src)){
                if(fs.lstatSync(src).isDirectory()){
                    arr = fs.readdirSync(src).map(d => ({src: `${src}/${d}`}));
                } else {
                    arr = [{src}];
                }
            }

            let dest = dests[i % dests.length];
            let destIsFile = path.extname(dest) !== '';
            let destPath = destIsFile ? path.dirname(dest) : dest;

            fs.mkdirpSync(destPath);

            arr = arr.map(input => {
                return {
                    src: input.src,
                    dest: destIsFile ? dest : `${destPath}/${path.basename(input.src)}`
                };
            });

            return concat.concat(arr);
        }, []);
    } catch(e){console.log(e);}

    inputs.forEach(d => {
        if(path.extname(d.src) !== '.svg'){
            throw new Error('some srcs are non svg files.');
        }

        if(path.extname(d.dest) !== '.svg'){
            throw new Error('some dest files have a non svg extension.');
        }
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
                console.log(`\x1b[32m%s\x1b[0m`, `✔`, `${input.src} fitted.`);
            }
        }
    } catch(e){console.log(e);}

    await browser.close();
}

export default {
    fit
};