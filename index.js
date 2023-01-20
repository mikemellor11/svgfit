import fs from "fs-extra";
import puppeteer from "puppeteer-core";
import path from "path";

export async function fit(inputs, outputs){
    let dest = outputs;
    let input = inputs;

    const browser = await puppeteer.launch({
        executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
        args: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    });

    try{
        const page = await browser.newPage();

        let svg = fs.readFileSync(input, {encoding: 'utf8'});

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

        fs.mkdirpSync(dest);
        fs.writeFileSync(`${dest}/${path.basename(input)}`, result);
    } catch(e){console.log(e);}

    await browser.close();
}

export default {
    fit
};