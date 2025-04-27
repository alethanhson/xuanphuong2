// Khai báo kiểu cho suppressHydrationWarning
declare namespace JSX {
  interface IntrinsicElements {
    body: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLBodyElement> & {
        suppressHydrationWarning?: boolean;
      },
      HTMLBodyElement
    >;
    html: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHtmlElement> & {
        suppressHydrationWarning?: boolean;
      },
      HTMLHtmlElement
    >;
    div: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement> & {
        suppressHydrationWarning?: boolean;
      },
      HTMLDivElement
    >;
  }
} 