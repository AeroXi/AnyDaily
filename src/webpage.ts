import 'dotenv/config'
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import axios from 'axios';


async function extractContent(url: string) {
    const response = await axios.get(url);

    // We now have the article HTML, but before we can use Readability to locate the article content we need jsdom to convert it into a DOM object
    let dom = new JSDOM(response.data, {
        url: url,
    });

    // now pass the DOM document into readability to parse
    let article = new Readability(dom.window.document).parse();
    if (!article) {
        return "No article found"
    }
    if (article.textContent == null) {
        return "No content found"
    }

    // Done! The article content is in the textContent property
    let textContent = article.textContent.replace(/^\s*[\r\n]/gm, '');
    console.log(`Title: ${article.title}`);
    console.log(`Content: ${textContent}`);
    return `Title: ${article.title} \n Content: ${textContent}`
}