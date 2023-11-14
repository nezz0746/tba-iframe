/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import ethereumIcon from "cryptocurrency-icons/svg/icon/eth.svg";
import polygonIcon from "cryptocurrency-icons/svg/icon/matic.svg";
import classNames from "classnames";
import { TbaOwnedNft } from "./page";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

export const Check = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13.25 4.75L6 12L2.75 8.75" />
    </svg>
  );
};


interface ExternalLinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  link?: string;
  className?: string;
}

export function ExternalLink({ link, className, ...rest }: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={link}
      className={classNames("cursor-pointer", className)}
      {...rest}
    >
      <ExternalLinkIcon height={"20px"} width={"20px"} color="#A1A1AA" />
    </a>
  );
}


interface MediaViewerProps {
  url: string;
  isVideo: boolean;
}

export const MediaViewer = ({ url, isVideo = false }: MediaViewerProps) => {
  if (isVideo) {
    let videoUrl = url;
    const ipfs = url.includes("ipfs");
    if (ipfs) {
      videoUrl = url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return (
      <video className="aspect-square rounded-xl object-cover" muted autoPlay={true} loop={true}>
        <source src={videoUrl} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      className="aspect-square rounded-xl object-cover"
      src={url}
      alt="token image"
      width={1080}
      height={1080}
    />
  );
};


export const chainIdToEtherscanUrl: Record<number, string> = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  11155111: "https://sepolia.etherscan.io",
  10: "https://optimistic.etherscan.io",
  420: "https://goerli-optimism.etherscan.io",
  137: "https://polygonscan.com",
  80001: "https://mumbai.polygonscan.com",
};

interface GetEtherscanLinkParams {
  chainId?: number;
  address?: string;
}

export function shortenAddress(address: string): string {
  const start = address.slice(0, 4);
  const end = address.slice(-3);
  return `${start}...${end}`;
}


export const getEtherscanLink = ({ chainId, address }: GetEtherscanLinkParams) => {
  if (!chainId || !address) return undefined;

  const etherscanBaseLink = chainIdToEtherscanUrl[chainId];

  if (!etherscanBaseLink) return undefined;

  const link = `${etherscanBaseLink}/address/${address}`;
  return link;
};


export const chainIdToOpenseaAssetUrl: Record<number, string> = {
  1: "https://opensea.io/assets/ethereum",
  5: "https://testnets.opensea.io/assets/goerli",
  11155111: "https://testnets.opensea.io/assets/sepolia",
  10: "https://opensea.io/assets/optimism",
  420: "https://opensea.io/assets/optimism-goerli",
  137: "https://opensea.io/assets/matic",
  80001: "https://testnets.opensea.io/assets/mumbai",
};


const chainIdToIcon: Record<number, any> = {
  1: ethereumIcon,
  5: ethereumIcon,
  137: polygonIcon,
  80001: polygonIcon,
};

interface Props {
  className?: string;
  account?: string;
  tokens: TbaOwnedNft[];
  title: string;
  chainId: number;
}


export const Panel = ({
  className,
  account,
  tokens,
  title,
  chainId,
}: Props) => {
  const [copied, setCopied] = useState(false);

  const displayedAddress = account;

  const etherscanLink = getEtherscanLink({ chainId, address: account });

  return (
    <div
      className={classNames(
        className,
        "custom-scroll h-full flex flex-col gap-2 space-y-3 overflow-y-auto rounded-t-xl border-t-0 bg-[#272727] px-5 pt-5"
      )}
    >
      <div className="mb-4 flex w-full items-center justify-center">
        <div className="h-[2.5px] w-[34px] bg-[#E4E4E4]"></div>
      </div>
      <h1 className="text-base font-bold uppercase text-white">{title}</h1>

      {account && displayedAddress && (
        <div className="flex items-center justify-start space-x-2">
          <span
            className="inline-block rounded-2xl bg-[#F6F8FA] px-4 py-2 text-xs font-bold text-[#666D74] hover:cursor-pointer"
            onClick={() => {
              const textarea = document.createElement("textarea");
              textarea.textContent = account;
              textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
              document.body.appendChild(textarea);
              textarea.select();

              try {
                document.execCommand("copy"); // Security exception may be thrown by some browsers.
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);

                return;
              } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
              } finally {
                document.body.removeChild(textarea);
              }
            }}
          >
            {copied ? (
              <span>
                <Check />
              </span>
            ) : (
              shortenAddress(displayedAddress)
            )}
          </span>
          <ExternalLink className="h-[20px] w-[20px]" link={etherscanLink} />
        </div>
      )}
        {tokens && tokens.length ? (
          <ul className="custom-scroll grid grid-cols-3 gap-2 overflow-y-auto">
            {tokens.map((t, i) => {
              let media = t?.media[0]?.gateway || t?.media[0]?.raw;
              const isVideo = t?.media[0]?.format === "mp4";
              if (isVideo) {
                media = t?.media[0]?.raw;
              }

              const openseaUrl = `${chainIdToOpenseaAssetUrl[t.chainId]}/${t.contract.address}/${t.tokenId}`;

              return (
                <li key={`${t.contract.address}-${t.tokenId}-${i}`} className="list-none relative">
                  <div className="absolute top-2 right-2">
                    <img
                      {...(chainIdToIcon[t.chainId] ?? {})}
                      className="h-6 w-6"
                    />
                  </div>
                  <a href={openseaUrl} target="_blank" className="cursor-pointer">
                    <MediaViewer url={media} isVideo={isVideo} />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={"h-full"}>
            <p className="text-center text-sm text-gray-500">No collectibles found</p>
          </div>
        )}
    </div>
  );
};
