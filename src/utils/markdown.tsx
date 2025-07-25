import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

/**
 * Renders Markdown content as styled HTML elements with support for GitHub Flavored Markdown.
 *
 * Applies custom Tailwind CSS classes to various Markdown elements for consistent light and dark theme styling.
 *
 * @param content - The Markdown text to render
 * @returns A React element displaying the rendered and styled Markdown content
 */
export function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node: _node, ...props }) => (
            <h1
              className="mb-4 text-2xl font-bold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2
              className="mb-3 text-xl font-bold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              className="mb-2 text-lg font-semibold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="mb-2 text-gray-700 dark:text-gray-300" {...props} />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul
              className="mb-4 list-inside list-disc space-y-1 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol
              className="mb-4 list-inside list-decimal space-y-1 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          strong: ({ node: _node, ...props }) => (
            <strong
              className="font-bold text-gray-900 dark:text-white"
              {...props}
            />
          ),
          em: ({ node: _node, ...props }) => (
            <em className="italic" {...props} />
          ),
          code: ({ node: _node, ...props }) => (
            <code
              className="rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800"
              {...props}
            />
          ),
          pre: ({ node: _node, ...props }) => (
            <pre
              className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
              {...props}
            />
          ),
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="mb-4 border-l-4 border-gray-300 pl-4 text-gray-600 italic dark:border-gray-600 dark:text-gray-400"
              {...props}
            />
          ),
          a: ({ node: _node, ...props }) => (
            <a className="default underline-animation" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
