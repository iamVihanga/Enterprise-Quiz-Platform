This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Features in Quizzes

---

- Time limit for quizzes
- Quiz Passing Score
- Quiz Publish and Unpublish
- Shuffle Questions on Student Side
- Show correct answers (After submit answer in quiz)
- Allow retake quizzes
- Define Maximum Attempts

- Various Question Types
- Answer explanation for each questions
- Number of points awarded by question

- Quiz categorization by Tags
- Quiz Feedback system and reviews

### Multiple Attempt Features in Quizzes

- Started and Completed Timestamps
- Score earned
- Total points rewarded by all attempt
- Earned points by specific attempt
- Copy of passing score
- Show passed / failed status
- The time spent for each attempts in seconds

### Question Response Features in Quizzes

- Show user answers and is it correct or not
- Points earned by answered question
- Show time taken to answer / responed in seconds

---

_Note_

- For admin, There are feature to manage all tags \*(categories) and reviews
  (Conditional render sidebar quizzes nav item by role,
  Students (member) -> Nav link to quizzes page
  Org. Admins / Owner -> Collapsible nav link to Quizzes, Categories, and Reviews
  )

---

### Quiz Tags Feature

- Filter quizzes by categories

### Quiz Feedback Features

- Rate answered quiz at the finish and leave a feedback
