import { LoaderFunction, redirect } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }) => {
  const filename = params.filename;
  if (!filename) {
    throw new Response('Filename is required', { status: 400 });
  }

  try {
    const response = await fetch(`/get-image-info/${filename}`);
    if (!response.ok) {
      throw new Response('Failed to fetch image info', {
        status: response.status,
      });
    }

    const data = await response.json();
    return redirect(data.url);
  } catch (error) {
    console.error('Error fetching image info:', error);
    throw new Response('Image not found', { status: 404 });
  }
};
