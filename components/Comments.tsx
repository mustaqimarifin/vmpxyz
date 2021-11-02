import { useState, useEffect, useRef, Key } from 'react';
import { format } from 'date-fns';
import { signIn, useSession } from 'next-auth/react';
import useSWR, { useSWRConfig } from 'swr';
import Image from 'next/image';
import fetcher from 'lib/fetcher';
import { Form, FormState } from 'lib/types';
import SuccessMessage from 'components/SuccessMessage';
import ErrorMessage from 'components/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';

function CommentList({ comment, user }) {
  const { data: session } = useSession();

  const { mutate } = useSWRConfig();
  const onDelete = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/comment', {
        method: 'DELETE',
        body: JSON.stringify({ comment }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await mutate('/api/comment');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex w-full p-2  border-gray-300">
        <span className="flex-shrink-0">
          <Image
            src={comment.image}
            alt={comment.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        </span>
        <div className="flex flex-col flex-grow ml-4">
          <div className="flex">
            <span className="font-semibold">{comment.name}</span>
            <span className="ml-auto text-sm">
              {format(new Date(comment.created_at), "d MMM yyyy 'at' h:mm bb")}
              {session?.user && (
                <>
                  <span className="text-gray-200 dark:text-gray-800">/</span>
                  <button
                    className="text-sm text-red-600 dark:text-red-400"
                    onClick={onDelete}
                  >
                    Delete
                  </button>
                </>
              )}
            </span>
          </div>
          <p className="mt-0 text-sm text-gray-800 dark:text-gray-100">
            {comment.text}
          </p>
        </div>
      </div>
      {/*       <div className="flex-grow overflow-y-auto overflow-x-hidden overscroll-contain transition-shadow px-3 sm:px-6 pb-6">
        <div className="flex-shrink-0">
          <Image
            src={comment.user.image}
            alt={comment.user.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <div className="prose dark:prose-dark w-full">{comment.text}</div>
        <div className="flex items-center space-x-3">
          <p className="text-sm text-gray-500">{comment.user.name}</p>
          <span className=" text-gray-200 dark:text-gray-800">/</span>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            {format(new Date(comment.created_at), "d MMM yyyy 'at' h:mm bb")}
          </p>
          {user && comment.user.name === user.name && (
            <>
              <span className="text-gray-200 dark:text-gray-800">/</span>
              <button
                className="text-sm text-red-600 dark:text-red-400"
                onClick={deletecomment}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div> */}
    </>
  );
}

export default function Comments() {
  const [slug, setSlug] = useState(null);
  const { data: session } = useSession();
  const [form, setForm] = useState<FormState>({ state: Form.Initial });
  const inputEl = useRef(null);
  const { mutate } = useSWRConfig();

  const { data: comments } = useSWR(
    () => {
      const query = new URLSearchParams({ slug });
      return `/api/comment?${query.toString()}`;
    },
    fetcher,
    {
      fallbackData: []
    }
  );
  /*   const { data: comments } = useSWR(`/api/comment/${slug}`, fetcher);
  useEffect(() => {
    const slug = () =>
      fetch(`/api/comment/${slug}`, {
        method: 'POST'
      });

    slug();
  }, [slug]); */

  useEffect(() => {
    const slug = window.location.href.substring(
      window.location.href.lastIndexOf('/') + 1
    );
    setSlug(slug);
  }, []);

  const leavecomment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setForm({ state: Form.Loading });

    const res = await fetch('/api/comment', {
      body: JSON.stringify({ slug, text: inputEl.current.value }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    const { error } = await res.json();
    if (error) {
      setForm({
        state: Form.Error,
        message: error
      });
      return;
    }

    inputEl.current.value = '';
    mutate('/api/comment');
    setForm({
      state: Form.Success,
      message: `NOIS!.`
    });
  };

  return (
    <>
      <div className="border border-blue-200 rounded p-6 my-4 w-full dark:border-gray-800 bg-blue-50 dark:bg-blue-opaque">
        <h5 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
          comments
        </h5>
        <p className="my-1 text-gray-800 dark:text-gray-200">
          Share a message for a future visitor of my site.
        </p>
        {!session && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a
            href="/api/auth/signin"
            className="flex items-center justify-center my-4 font-bold h-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded w-28"
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Login
          </a>
        )}
        {session?.user && (
          <form className="relative my-4" onSubmit={leavecomment}>
            <input
              ref={inputEl}
              aria-label="Your message"
              placeholder="Your message..."
              required
              className="pl-4 pr-32 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              className="flex items-center justify-center absolute right-1 top-1 px-4 pt-1 font-medium h-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded w-28"
              type="submit"
            >
              {form.state === Form.Loading ? <LoadingSpinner /> : 'Post'}
            </button>
          </form>
        )}
        {form.state === Form.Error ? (
          <ErrorMessage>{form.message}</ErrorMessage>
        ) : form.state === Form.Success ? (
          <SuccessMessage>{form.message}</SuccessMessage>
        ) : (
          <p className="text-sm text-gray-800 dark:text-gray-200">
            Your information is only used to display your name and reply by
            email.
          </p>
        )}
      </div>
      <div className="mt-4 space-y-8">
        {comments?.map((comment: { id: Key }) => (
          <CommentList
            key={comment.id}
            comment={comment}
            user={session?.user}
          />
        ))}
      </div>
    </>
  );
}
