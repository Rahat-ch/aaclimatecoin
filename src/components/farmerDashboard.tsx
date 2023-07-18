import React, {useState} from "react";
import { 
  IPaymaster, 
  BiconomyPaymaster, 
  IHybridPaymaster, 
  SponsorUserOperationDto,
  PaymasterMode
} from '@biconomy/paymaster'
interface Props {
  coinContract: any
  smartAccount: any
}
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FarmerDashboard:React.FC<Props> = ({ coinContract, smartAccount }) => {
  const contractAddress = "0x61ec475c64c5042a6Cbb7763f89EcAe745fc8315";
  const addClaim = async () => {
    try {
      toast.info('Creating your claim...', {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      const claimTx = await coinContract.populateTransaction.addClaim();
      console.log(claimTx.data);
      const tx1 = {
        to: contractAddress,
        data: claimTx.data,
      };

      let userOp = await smartAccount.buildUserOp([tx1]);
      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await smartAccount.sendUserOp(userOp);
      console.log("userOpHash", userOpResponse);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      toast.success('Claim sent on this transaction: receipt.transactionHash', {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    } catch (err: any) {
      console.error(err);
      console.log(err)
    }
  };

  return(
    <>
    <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    <h2>Farmer Dashboard</h2>
    <button onClick={addClaim}>Claim</button>
    </>
  )
}

export default FarmerDashboard;
