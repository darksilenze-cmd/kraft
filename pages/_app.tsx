// pages/_app.tsx

// Remove this line
// import { TinaEditProvider } from 'tinacms/dist/edit-state';

// ...and replace it with the correct import.
// The exact path depends on your TinaCMS version and setup.
import { TinaEditProvider } from 'tinacms/dist/edit-state';

// The rest of your file remains the same
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TinaEditProvider>
      <Component {...pageProps} />
    </TinaEditProvider>
  );
}
