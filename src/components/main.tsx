import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types";
import { ethers } from 'ethers'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import abi from "../utils/abi.json";
import FarmerDashboard from './farmerDashboard';
import adminDashboard from './adminDashboard';
import styles from '@/styles/Home.module.css'

const contractAddress = "0x61ec475c64c5042a6Cbb7763f89EcAe745fc8315";

const bundler: IBundler = new Bundler({
  bundlerUrl: 'https://bundler.biconomy.io/api/v2/80001/abc', // you can get this value from biconomy dashboard.     
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL || "" 
})

export default function Home() {
  const [smartAccount, setSmartAccount] = useState<any>(null)
  const [interval, enableInterval] = useState(false)
  const sdkRef = useRef<SocialLogin | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [ isFarmer, setIsFarmer ] = useState<boolean>(false);
  const [ coinContract, setCoinContract ] = useState<any>(null);

  useEffect(() => {
    let configureLogin:any
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount()
          clearInterval(configureLogin)
        }
      }, 1000)
    }
  }, [interval])

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin()
      const signature1 = await socialLoginSDK.whitelistUrl('http://localhost:3000/')
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          'http://localhost:3000/': signature1,
        }
      })
      sdkRef.current = socialLoginSDK
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet()
      enableInterval(true)
    } else {
      setupSmartAccount()
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return
    sdkRef.current.hideWallet()
    setLoading(true)
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    )
    setProvider(web3Provider)
    
    try {
      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster
      }
      let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
      biconomySmartAccount =  await biconomySmartAccount.init()
      setAddress(await biconomySmartAccount.getSmartAccountAddress())
      setSmartAccount(biconomySmartAccount)
      setLoading(false)
    } catch (err) {
      console.log('error setting up smart account... ', err)
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error('Web3Modal not initialized.')
      return
    }
    await sdkRef.current.logout()
    sdkRef.current.hideWallet()
    setSmartAccount(null)
    setAddress("")
    enableInterval(false)
  }

  const checkUserStatus= async() => {
    console.log("checking user status")
    const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider,
      )
    setCoinContract(contract)
    const isAFarmer = await contract.isAFarmer(address)
    setIsFarmer(isAFarmer)
}

useEffect(() => {
  if( address && provider ) {
    checkUserStatus()
  }
}, [address, provider])
  return (
    <>
      <Head>
        <title>Climate Coin</title>
        <meta name="description" content="Workshop for AA on Zkevm" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Climate Coin</h1>
        {address && <h2>Welcome {address}</h2>}
        { isFarmer && <FarmerDashboard coinContract={coinContract} smartAccount={smartAccount} /> }
        {!smartAccount && <button onClick={login} className={styles.connect}>Connect to Web3</button>}
        {smartAccount && <button onClick={logout} className={styles.connect}>Logout</button>}
      </main>
    </>
  )
}
