import { Variants, motion } from "framer-motion";
import { Panel } from "./Panel";
import { TbaOwnedNft } from "./page";

interface Props {
  className?: string;
  isOpen: boolean;
  handleOpenClose: (arg0: boolean) => void;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
}

const variants = {
  closed: { y: "100%", transition: { duration: 0.75 } },
  open: { y: "0", transition: { duration: 0.75 }, height: "85%" },
} as Variants;

export const TokenDetail = ({
  className,
  isOpen,
  handleOpenClose,
  account,
  tokens,
  title,
  chainId,
}: Props) => {
  let currentAnimate = isOpen ? "open" : "closed";

  return (
    <div className={className}>
      <motion.div
        className="absolute left-4 top-4 z-10 rounded-full cursor-pointer p-2 bg-white bg-opacity-50 hover:bg-opacity-80"
        whileHover="hover"
        initial="unHovered"
      >
        <img src="/logo.png" className="h-7 w-7" onClick={( )=> handleOpenClose(!isOpen)}/>
      </motion.div>
      {isOpen && (
        <motion.div
          className={`custom-scroll absolute bottom-0 z-10 w-full max-w-[1080px] overflow-y-auto`}
          animate={currentAnimate}
          variants={variants}
          initial="closed"
        >
          <Panel
            account={account}
            tokens={tokens}
            title={title}
            chainId={chainId}
          />
        </motion.div>
      )}
    </div>
  );
};
