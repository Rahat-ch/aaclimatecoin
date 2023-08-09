This repository was used for workshops at Infrocon and Polygon Guild Parist events in Paris during Eth CC 2023. Based on the workshop and the alpha documentation below, finish the implementation. 

Final implementation should allow for: 

- Farmers to claim their rewards
- New Farmers to add themselves to a waitlist 
- An implementation of the Admin dashboard where an admin can: approve farmers from the waitlist as well as approve any claims they have made. 
- All transactions should be gasless or allow for ERC20 payments in gas. 

Biconomy dashboard documentation: 
https://docs.biconomy.io

Use the implementation of the Farmer claim to help you implement more gasless transactions!

Deployed climate coin contract:
https://mumbai.polygonscan.com/address/0x61ec475c64c5042a6Cbb7763f89EcAe745fc8315

Original climate coin contract:
https://github.com/teeolendo/climatecoin

## Getting Started

Install with: 

```bash
npm install
# or
yarn 
```


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Create a .env file with the following variable: 

NEXT_PUBLIC_BICONOMY_PAYMASTER_URL=

Make sure to get this from the paymaster dashboard documentation linked above! 

Tweet your solution to @biconomy and @rahatcodes along with an address for something cool!

