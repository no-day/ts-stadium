import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/github';

export const Code = ({
  source,
  fileName,
}: {
  source: string;
  fileName: string;
}) => {
  const patchedSource = `// ${fileName}\n\n${source}`;

  return (
    <Highlight
      {...defaultProps}
      code={patchedSource}
      language="tsx"
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
