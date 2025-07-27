## What's this for?

[Ma che vuoi](https://machevuoi.vercel.app/) is my free-hand drawing app. It's named after a well known Italian hand gesture, looking like this 🤌, meaning "What do you want?" but in a specifically Italian way. 

The idea is to draw with all five fingers, even with both hands, and even with more than two hands if you're up to "pair drawing" as opposed to "pair programming" :)

I should write a more comprehensive manual, but meanwhile click around and you won't be bored, that much I can promise.

Apart from drawing, this is an interesting puppetry tool, which you can see on my [live demo](https://youtube.com/watch?v=XA_kYc5ovHI&si=Nofnwf_YO4xs8XDb), which I made in occasion of 200th anniversary of 9th Beethoven's Symphony.

Ma che vuoi uses [MediaPipe hand landmark detection](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker). In the past it used Tensorflow wrapper with mediapipe runtime, but this is more up to date, performs better and it's better for the milieu 🐿🦔🦆

Below is just a default Next.js introduction.

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
