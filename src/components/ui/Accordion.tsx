import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AccordionItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultValue?: string[];
  type?: 'single' | 'multiple';
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultValue = [],
  type = 'multiple',
  className,
}) => {
  return (
    <AccordionPrimitive.Root
      type={type as 'multiple'}
      defaultValue={defaultValue}
      className={cn('ddb:flex ddb:flex-col', className)}
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.id}
          value={item.id}
          className="ddb:border-b ddb:border-surface-200 dark:ddb:border-surface-700 last:ddb:border-b-0"
        >
          <AccordionPrimitive.Header className="ddb:flex">
            <AccordionPrimitive.Trigger
              className={cn(
                'ddb:flex ddb:items-center ddb:justify-between ddb:flex-1',
                'ddb:py-3 ddb:px-1 ddb:text-left',
                'ddb:text-sm ddb:font-medium',
                'ddb:text-surface-700 dark:ddb:text-surface-300',
                'hover:ddb:text-surface-900 dark:hover:ddb:text-surface-100',
                'ddb:transition-colors ddb:group'
              )}
            >
              <div className="ddb:flex ddb:items-center ddb:gap-2">
                {item.icon && (
                  <span className="ddb:text-surface-400 group-hover:ddb:text-primary-500 ddb:transition-colors">
                    {item.icon}
                  </span>
                )}
                <span>{item.title}</span>
                {item.badge && (
                  <span className="ddb:px-1.5 ddb:py-0.5 ddb:text-[10px] ddb:font-medium ddb:rounded ddb:bg-primary-100 dark:ddb:bg-primary-900/30 ddb:text-primary-600 dark:ddb:text-primary-400">
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  'ddb:w-4 ddb:h-4 ddb:text-surface-400',
                  'ddb:transition-transform ddb:duration-200',
                  'group-data-[state=open]:ddb:rotate-180'
                )}
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content
            className={cn(
              'ddb:overflow-hidden',
              'data-[state=open]:ddb:animate-accordion-down',
              'data-[state=closed]:ddb:animate-accordion-up'
            )}
          >
            <div className="ddb:pb-3 ddb:pt-1">
              {item.content}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};
