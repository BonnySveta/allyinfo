import { useEffect } from 'react';

export const YandexMetrika = () => {
  useEffect(() => {
    // @ts-ignore
    if (window.ym) return; // чтобы не подключать дважды
    const script = document.createElement('script');
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.async = true;
    document.body.appendChild(script);

    // @ts-ignore
    window.ym = function () {
      // @ts-ignore
      (window.ym.a = window.ym.a || []).push(arguments);
    };
    // @ts-ignore
    window.ym.l = +new Date();

    // @ts-ignore
    window.ym(102332610, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }, []);

  return (
    <noscript>
      <div>
        <img
          src="https://mc.yandex.ru/watch/102332610"
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  );
}; 