import { json, LoaderFunction, useLoaderData } from 'remix'
import { Doc, fetchRepoMarkdown } from '~/utils/docCache.server'
import { v8branch } from '../../v8'
import { FaEdit } from 'react-icons/fa'
import { DocTitle } from '~/components/DocTitle'
import { Mdx } from '~/components/Mdx'

export const loader: LoaderFunction = async (context) => {
  const { '*': docsPath } = context.params

  if (!docsPath) {
    throw new Error('Invalid docs path')
  }

  const filePath = `docs/${docsPath}.md`

  const doc = await fetchRepoMarkdown(
    'tanstack/react-table',
    v8branch,
    filePath
  )

  return json(doc, {
    headers: {
      'Cache-Control': 's-maxage=1, stale-while-revalidate=300',
    },
  })
}

export default function RouteReactTableDocs() {
  const doc = useLoaderData() as Doc

  return (
    <div className="p-4 lg:p-6">
      <DocTitle>{doc.mdx.frontmatter.title ?? ''}</DocTitle>
      <div className="h-4" />
      <div className="h-px bg-gray-500 opacity-20" />
      <div className="h-4" />
      <div className="prose prose-gray prose-sm dark:prose-invert max-w-none">
        <Mdx code={doc.mdx.code} />
      </div>
      <hr />
      <div className="py-4">
        <a
          href={`https://github.com/tanstack/react-table/tree/${v8branch}/${doc.filepath}`}
          className="flex items-center gap-2"
        >
          <FaEdit /> Edit on Github
        </a>
      </div>
      <div className="h-24" />
    </div>
  )
}