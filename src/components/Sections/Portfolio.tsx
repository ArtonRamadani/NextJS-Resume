import {ArrowTopRightOnSquareIcon} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import Image from 'next/image';
import {FC, memo, MouseEvent, useCallback, useEffect, useRef, useState} from 'react';

import {isMobile} from '../../config';
import {freelancePortfolioItems, portfolioItems, SectionId} from '../../data/data';
import {PortfolioItem} from '../../data/dataDef';
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick';
import Section from '../Layout/Section';

const Portfolio: FC = memo(() => {
  return (
    <Section className="bg-neutral-800" sectionId={SectionId.Portfolio}>
      <div className="flex flex-col gap-y-8">
        <h2 className="self-center text-xl font-bold text-white">Check out some of my freelance work</h2>
        <div className=" w-full columns-2 md:columns-3 lg:columns-3 ">
          {freelancePortfolioItems.map((item, index) => {
            const {title, image} = item;
            return (
              <div className="pb-6" key={`${title}-${index}`}>
                <div
                  className={classNames(
                    `relative h-max w-full overflow-hidden rounded-lg shadow-lg shadow-black/30 lg:shadow-xl `,
                  )}
                  style={{minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    alt={title}
                    className={`h-full w-full ${item?.blur && 'blur'}`}
                    height="900"
                    src={image}
                    width="1000"
                  />
                  <ItemOverlay item={item} />
                </div>
              </div>
            );
          })}
        </div>
        <h2 className="self-center text-xl font-bold text-white">My work at Harrisia</h2>
        <div className=" w-full columns-2 md:columns-3 lg:columns-3">
          {portfolioItems.map((item, index) => {
            const {title, image} = item;
            return (
              <div className="pb-6" key={`${title}-${index}`}>
                <div
                  className={classNames(
                    `min-h-52 flex items-center relative h-max w-full overflow-hidden rounded-lg shadow-lg shadow-black/30 lg:shadow-xl `,
                  )}
                  style={{background: item?.background}}>
                  <Image
                    alt={title}
                    className={`h-full w-full ${item?.blur && 'blur'}`}
                    height="900"
                    src={image}
                    width="1000"
                  />
                  <ItemOverlay item={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
});

Portfolio.displayName = 'Portfolio';
export default Portfolio;

const ItemOverlay: FC<{item: PortfolioItem}> = memo(({item: {url, title, description}}) => {
  const [mobile, setMobile] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Avoid hydration styling errors by setting mobile in useEffect
    if (isMobile) {
      setMobile(true);
    }
  }, []);
  useDetectOutsideClick(linkRef, () => setShowOverlay(false));

  const handleItemClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (mobile && !showOverlay) {
        event.preventDefault();
        setShowOverlay(!showOverlay);
      }
    },
    [mobile, showOverlay],
  );
  console.log('url', url);
  return (
    <>
      {url !== '' ? (
        <a
          className={classNames(
            'absolute inset-0 h-full w-full bg-gray-900 transition-all duration-300',
            {'opacity-0 hover:opacity-80': !mobile},
            showOverlay ? 'opacity-80' : 'opacity-0',
          )}
          href={url}
          onClick={handleItemClick}
          ref={linkRef}
          target="_blank">
          <div className="relative h-full w-full p-4">
            <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto overscroll-contain">
              <h2 className="text-center font-bold text-white opacity-100">{title}</h2>
              <p className="text-xs text-white opacity-100 sm:text-sm">{description}</p>
            </div>
            {url !== '' && (
              <ArrowTopRightOnSquareIcon className="absolute bottom-1 right-1 h-4 w-4 shrink-0 text-white sm:bottom-2 sm:right-2" />
            )}
          </div>
        </a>
      ) : (
        <div
          className={classNames(
            'absolute inset-0 h-full w-full bg-gray-900 transition-all duration-300',
            {'opacity-0 hover:opacity-80': !mobile},
            showOverlay ? 'opacity-80' : 'opacity-0',
          )}
          onClick={handleItemClick}>
          <div className="relative h-full w-full p-4">
            <div className="flex h-full w-full flex-col gap-y-2 overflow-y-auto overscroll-contain">
              <h2 className="text-center font-bold text-white opacity-100">{title}</h2>
              <p className="text-xs text-white opacity-100 sm:text-sm">{description}</p>
            </div>
            {url !== '' && (
              <ArrowTopRightOnSquareIcon className="absolute bottom-1 right-1 h-4 w-4 shrink-0 text-white sm:bottom-2 sm:right-2" />
            )}
          </div>
        </div>
      )}
    </>
  );
});
