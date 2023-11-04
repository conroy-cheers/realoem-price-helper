# RealOEM Price Helper

Ah, RealOEM, saviour of BMW enthusiasts worldwide.

Unfortunately, their listed prices are often wildly inaccurate, or even missing for some parts. Copy-pasting dozens of part numbers into vendor websites is incredibly tedious, so I'm doing the Thing here where I spend way more time automating a task than I'd spend just continuing to do it by hand.

This is a Chrome extension to automatically insert current prices for all parts, along with direct links to purchase them.

As of right now, [Cars245.com](https://cars245.com) is my favourite seller, so it's the only one that's supported.

## TODO

- [x] Fetch Cars245 prices and links
- [x] More thorough error handling
- [x] Cache results locally
- [ ] Improve UI
- [ ] Fetch individual shipping costs
- [ ] Support more stores, with price comparison
- [x] Aftermarket part alternatives
- [ ] Filter aftermarket part by brand / quality
- [ ] Scrape part images on demand

## Boilerplate stuff

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

### Getting Started

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

### Making production build

Run the following:

```bash
pnpm build
# or
npm run build
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

### Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission!
