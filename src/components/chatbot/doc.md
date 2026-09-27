Jab bhi aap code me koi bhi changes karein, toh build karne ke liye sirf yeh command chalana hai:

bash
npm run build
Yeh command automatically:

Saare TypeScript types check karega (tsc -b).
Library bundle create karega (dist/embidly.js aur dist/embidly.umd.cjs).
Saare CSS styles compile karega (dist/style.css).
Type definitions update karega (dist/lib.d.ts).
📦 Agar Changes ko NPM par Publish karna ho:
Step 1: Version badhayein:

bash
npm version patch
(Yeh package.json me version automatically badha dega, jaise 1.1.1 ➡️ 1.1.2)

Step 2: Build karein:

bash
npm run build
Step 3: NPM par live karein:

bash
npm publish
(Maine aapka link https://luckya.vercel.app/ add hone ke baad abhi npm run build run kar diya hai, build 100% successful hai!)

