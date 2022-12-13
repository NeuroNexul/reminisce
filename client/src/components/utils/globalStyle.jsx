import { GlobalStyles } from "@mui/material";
import resizerDark from "../../assets/resizer-dark.svg";
import resizerLight from "../../assets/resizer-light.svg";

export default function (props) {
      return (
            <GlobalStyles styles={(theme) => ({
                  '*': {

                        'a': {
                              textDecoration: 'none',
                              color: 'inherit',
                              '&:hover': {
                                    textDecoration: 'underline',
                              },
                        },

                        scrollbarColor: theme.palette.primary.main,
                        scrollbarWidth: 'auto',

                        '&::selection, &::-moz-selection': {
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                        },

                        '&::-webkit-scrollbar': {
                              width: "10px",
                              height: "10px",
                        },

                        '&::-webkit-scroll-corner': {
                              backgroundColor: 'transparent',
                        },

                        '&::-webkit-scrollbar-thumb': {
                              backgroundColor: theme.palette.scrollbar.thumb,
                              border: '2px solid transparent',
                              borderRadius: '8px',
                              minHeight: '40px',
                              backgroundClip: 'padding-box',
                        },

                        '&::-webkit-scrollbar-track': {
                              backgroundColor: theme.palette.scrollbar.track,
                              border: '1px solid transparent',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              backgroundClip: 'padding-box',
                        },

                        '&::-webkit-scrollbar-corner': {
                              backgroundColor: 'transparent',
                        },

                        '&::-webkit-resizer': {
                              backgroundImage: `url(${theme.palette.mode === 'dark' ? resizerDark : resizerLight})`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'bottom right',
                        },
                  },

                  'html, body, #root': {
                        fontFamily: theme.typography.fontFamily,
                        color: theme.palette.text.primary,
                        backgroundColor: theme.palette.background.default,
                  },

            })} {...props} />
      );
};
