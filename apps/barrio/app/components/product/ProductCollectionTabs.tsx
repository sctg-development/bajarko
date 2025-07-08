import { TabButton } from '@app/components/tabs/TabButton';
import { TabList } from '@app/components/tabs/TabList';
import { Tab } from '@headlessui/react';
import { StoreCollection } from '@medusajs/types';
import { type FC, Fragment } from 'react';

export interface ProductCollectionTabsProps {
  collections: StoreCollection[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
}

export const ProductCollectionTabs: FC<ProductCollectionTabsProps> = ({ collections, ...props }) => {
  if (!collections?.length) return null;

  return (
    <Tab.Group {...props}>
      <TabList>
        <Tab as={Fragment}>{({ selected }) => <TabButton selected={selected}>All</TabButton>}</Tab>

        {collections.map((collection) => (
          <Tab key={collection.id} as={Fragment}>
            {({ selected }) => <TabButton selected={selected}>{collection.title}</TabButton>}
          </Tab>
        ))}
      </TabList>
    </Tab.Group>
  );
};
