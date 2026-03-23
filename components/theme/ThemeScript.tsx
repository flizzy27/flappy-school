import Script from "next/script";

export function ThemeScript() {
  const script = `
    (function() {
      var theme = localStorage.getItem('flappy-school-theme');
      var valid = ['dark','light','cyan','purple','green'];
      if (theme && valid.includes(theme)) {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  `;
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
