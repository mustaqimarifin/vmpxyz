import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const slug = req.query.slug.toString()

    if ( req.method === 'POST' ) {
      const newOrUpdatedViews = await prisma.page.upsert( {
        where: { slug },
        create: {
          slug
        },
        update: {
          count: {
            increment: 1
          }
        }
      } );

      return res.status( 200 ).json( {
        total: newOrUpdatedViews.count.toString()
      } );
    }

    if ( req.method === 'GET' ) {
      const views = await prisma.page.findUnique( {
        where: {
          slug
        }
      } );

      return res.status( 200 ).json( { total: views.count.toString() } );
    }
  } catch ( e ) {
    return res.status( 500 ).json( { message: e.message } );
  }
}
