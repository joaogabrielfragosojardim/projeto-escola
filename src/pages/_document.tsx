import Document, { Head, Html, Main, NextScript } from 'next/document';

import { notoSans, notoSerif } from '@/styles/fonts';
import { AppConfig } from '@/utils/AppConfig';

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html
        lang={AppConfig.locale}
        className={`${notoSans.variable} ${notoSerif.variable}`}
      >
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
