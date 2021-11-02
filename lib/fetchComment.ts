import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

import { getSession } from 'next-auth/react'
export default async function fetchComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = req.query

  if ( !page ) {
    return res.status( 400 ).json( { message: 'Missing parameter.' } )
  }
  // Query the pages table in the database where slug equals the request params slug.
  const comments = await prisma.comment.findMany( {
    where: { page },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      page: {
        select: {
          slug: true
        },
      },
    },

    orderBy: [ { id: 'desc' } ],
    take: 10,
  } )

  if ( req.method === 'GET' ) {
    return res.json(
      comments.map( ( comment ) => ( {
        id: comment.id.toString(),
        name: comment.user.name,
        image: comment.user.image,
        text: comment.text,
        slug: comment.page.slug,
        created_at: comment.created_at.toString(),
      } ) )
    )
  }
}
