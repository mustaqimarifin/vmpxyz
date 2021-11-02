import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from 'lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession( { req } );

  const { id, userId } = req.query;
  const { name, email } = session.user;

  const comment = await prisma.comment.findUnique( {
    where: {
      id: String( id )
    },

    include: {
      user: {
        select: {
          email: true,
          name: true,

        },
      },
    },
  } );

  if ( req.method === 'GET' ) {
    return res.json( comment

    );
  }



  if ( req.method === 'DELETE' ) {
    await prisma.comment.delete( {
      select: {
        user: true, page: true,
      },
      where: {
        id: String( id )
      },


    } );

    return res.status( 204 ).json( {} );
  }

  return res.send( 'Method not allowed.' );
}
