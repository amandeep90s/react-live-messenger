import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        margin: 0,
        minHeight: '100vh',
      },

      code: {
        fontFamily:
          "source-code-pro, Menlo, Monaco, Consolas, 'Courier New',monospace",
      },
    },
  },
});

export default theme;
