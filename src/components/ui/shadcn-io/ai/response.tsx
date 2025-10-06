// #2
'use client';

import { cn } from '@/lib/utils';
import type { ComponentProps, HTMLAttributes } from 'react';
import { isValidElement, memo } from 'react';
import ReactMarkdown, { type Options } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock, CodeBlockCopyButton } from './code-block';
import 'katex/dist/katex.min.css';
import hardenReactMarkdown from 'harden-react-markdown';

/* -----------------------------------------------
   1️⃣ STEP 1: Handle DeepSeek-style math syntax
------------------------------------------------ */
// ES2017:=>
function normalizeMathSyntax(text: string): string {
  if (!text || typeof text !== 'string') return text;

  let normalized = text;

  // Convert \\[ ... \\] or \[ ... \] → $$ ... $$
  normalized = normalized.replace(/\\\\?\[([\s\S]*?)\\\\?\]/g, (_, content) => {
    return `$$${content.trim()}$$`;
  });

  // Convert \( ... \) → $ ... $
  normalized = normalized.replace(/\\\(([\s\S]*?)\\\)/g, (_, content) => {
    return `$${content.trim()}$`;
  });

  // Handle malformed / incomplete math blocks
  normalized = normalized.replace(/(\\\[|\\\()/g, match => {
    const closing = match === '\\[' ? '\\]' : '\\)';
    if (!normalized.includes(closing)) {
      return ''; // strip incomplete start
    }
    return match;
  });

  return normalized;
}



/* -----------------------------------------------
   2️⃣ STEP 2: Keep your existing incomplete markdown parser
------------------------------------------------ */
function parseIncompleteMarkdown(text: string): string {
  if (!text || typeof text !== 'string') return text;
  let result = text;

  // (keep your original logic here unchanged)
  // ... (same as before)
  // (omitted for brevity, your current parseIncompleteMarkdown function is perfect)

  return result;
}

const HardenedMarkdown = hardenReactMarkdown(ReactMarkdown);

/* -----------------------------------------------
   3️⃣ STEP 3: Same custom components setup
------------------------------------------------ */
const components: Options['components'] = {
  ol: ({ node, children, className, ...props }) => (
    <ol className={cn('ml-4 list-outside list-decimal', className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={cn('py-1', className)} {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul className={cn('ml-4 list-outside list-disc', className)} {...props}>
      {children}
    </ul>
  ),
  hr: ({ node, className, ...props }) => (
    <hr className={cn('my-6 border-border', className)} {...props} />
  ),
  strong: ({ node, children, className, ...props }) => (
    <span className={cn('font-semibold', className)} {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, className, ...props }) => (
    <a
      className={cn('font-medium text-primary underline', className)}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  ),
  h1: ({ node, children, className, ...props }) => (
    <h1 className={cn('mt-6 mb-2 font-semibold text-3xl', className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, className, ...props }) => (
    <h2 className={cn('mt-6 mb-2 font-semibold text-2xl', className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, className, ...props }) => (
    <h3 className={cn('mt-6 mb-2 font-semibold text-xl', className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, className, ...props }) => (
    <h4 className={cn('mt-6 mb-2 font-semibold text-lg', className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, className, ...props }) => (
    <h5 className={cn('mt-6 mb-2 font-semibold text-base', className)} {...props}>
      {children}
    </h5>
  ),
  h6: ({ node, children, className, ...props }) => (
    <h6 className={cn('mt-6 mb-2 font-semibold text-sm', className)} {...props}>
      {children}
    </h6>
  ),
  blockquote: ({ node, children, className, ...props }) => (
    <blockquote
      className={cn(
        'my-4 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: ({ node, className, children }) => {
    let language = 'javascript';
    if (typeof node?.properties?.className === 'string') {
      language = node.properties.className.replace('language-', '');
    }

    let code = '';
    if (isValidElement(children) && children.props && typeof (children.props as any).children === 'string') {
      code = (children.props as any).children;
    } else if (typeof children === 'string') {
      code = children;
    }

    return (
      <CodeBlock className={cn('my-4 h-auto', className)} code={code} language={language}>
        <CodeBlockCopyButton
          onCopy={() => console.log('Copied code to clipboard')}
          onError={() => console.error('Failed to copy code')}
        />
      </CodeBlock>
    );
  },
};

/* -----------------------------------------------
   4️⃣ STEP 4: Main Response Component
------------------------------------------------ */
export type ResponseProps = HTMLAttributes<HTMLDivElement> & {
  options?: Options;
  children: Options['children'];
  allowedImagePrefixes?: ComponentProps<ReturnType<typeof hardenReactMarkdown>>['allowedImagePrefixes'];
  allowedLinkPrefixes?: ComponentProps<ReturnType<typeof hardenReactMarkdown>>['allowedLinkPrefixes'];
  defaultOrigin?: ComponentProps<ReturnType<typeof hardenReactMarkdown>>['defaultOrigin'];
  parseIncompleteMarkdown?: boolean;
};

export const Response = memo(
  ({
    className,
    options,
    children,
    allowedImagePrefixes,
    allowedLinkPrefixes,
    defaultOrigin,
    parseIncompleteMarkdown: shouldParseIncompleteMarkdown = true,
    ...props
  }: ResponseProps) => {
    // Convert DeepSeek math syntax → standard math syntax
    let processedText =
      typeof children === 'string' ? normalizeMathSyntax(children) : children;

    // Optionally clean incomplete markdown tokens
    if (typeof processedText === 'string' && shouldParseIncompleteMarkdown) {
      processedText = parseIncompleteMarkdown(processedText);
    }

    return (
      <div className={cn('size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0', className)} {...props}>
        <HardenedMarkdown
          allowedImagePrefixes={allowedImagePrefixes ?? ['*']}
          allowedLinkPrefixes={allowedLinkPrefixes ?? ['*']}
          components={components}
          defaultOrigin={defaultOrigin}
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkGfm, remarkMath]}
          {...options}
        >
          {processedText}
        </HardenedMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = 'Response';

