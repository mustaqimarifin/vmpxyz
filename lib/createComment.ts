import prisma from 'lib/prisma'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react'
export default async function createComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession( { req } )
  //const slug = req.query.slug
  const { email } = session.user
  const { slug, text } = req.body

  if ( !session ) {
    return res.status( 403 ).send( 'Unauthorized' )
  }

  if ( req.method === 'POST' ) {
    const newEntry = await prisma.comment.create( {
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

      data: {
        id: nanoid(),
        text,
        page: { connect: { slug } },
        user: { connect: { email } },
      },
    } )

    return res.status( 200 ).json( {
      id: newEntry.id.toString(),
      text: newEntry.text,
      name: newEntry.user.name,
      image: newEntry.user.image,
      slug: newEntry.page.slug,
      created_at: newEntry.created_at.toString(),
    } )
  }

  return res.send( 'Method not allowed.' )
}
