# MAC Redirect Service
## Overview
MAC Redirect Service is an innovative solution designed to facilitate payment to creators for their advertising efforts on our platform. This service integrates a fraud prevention mechanism by capturing the IP address of users who click on links, ensuring authenticity and transparency. Furthermore, it includes a redirect service to seamlessly guide users to their intended destination.

## Features
- IP Address Tracking: Captures the IP address of the user clicking the link to prevent fraud.
- Automated Payments: Pays creators automatically for their advertising contributions.
- Redirect Service: Efficiently redirects users to the appropriate destination upon link click.
- Fraud Prevention: Ensures genuine interactions by validating each click.

## API Endpoints
- Clicks API: https://mac-backend-six.vercel.app/clicks
- References API: https://mac-backend-six.vercel.app/references

## Usage
The service can be integrated into your platform by importing the required functions from the provided codebase. The main functionalities include:

- getLinkByReference(reference): Retrieves the link associated with a given reference.
-newIpClick(ip, reference): Checks if the IP has already clicked the reference.
- thousandClicks(reference): Determines if there are at least a thousand unpaid clicks.
- resetUnpaidCount(): Resets the count of unpaid clicks.
- PayPerClick(req): Processes payment per click after validating conditions.
- makePayment(): Handles the payment transaction process.
- addNewClick(ip, reference): Records a new click with the provided IP and reference.

## Dependencies
- starknet: For interacting with StarkNet contracts.
- fetch: For making HTTP requests to the API endpoints.
- PayPerClick.json: A JSON file located in the abis folder, containing the ABI for the PayPerClick contract.
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
