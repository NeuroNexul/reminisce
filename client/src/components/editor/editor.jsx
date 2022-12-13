import React from 'react'
import { Box, GlobalStyles, useTheme } from '@mui/material'
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import EditorConfig from "./editor-toolbar.config";
import MyUploadAdapter from './uploadAdapter';

export default function RichEditor(props) {

      const theme = useTheme();

      const [editor, setEditor] = React.useState(null)
      const editorRef = React.useRef(null);
      const toolBarRef = React.useRef(null);

      function MyCustomUploadAdapterPlugin(editor) {
            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                  function upload(loader) {
                        return new MyUploadAdapter(loader);
                  }

                  if (typeof props.onFileUpload === 'function') {
                        return props.onFileUpload(loader, (loader) => {
                              return upload(loader);
                        });
                  } else {
                        return upload(loader);
                  }
            };
      }

      React.useEffect(() => {
            const editorElem = editorRef.current;

            if (editorElem && editorElem.nodeType && !editor) {
                  Editor.create(editorElem, {
                        licenseKey: '',
                        ...EditorConfig,
                        data: localStorage.getItem('editorData') || '',
                        extraPlugins: [MyCustomUploadAdapterPlugin, ...EditorConfig.extraPlugins],
                        autosave: {
                              waitingTime: props.autoSaveWaitingTime || 2000,
                              save(editor) {
                                    if (typeof props.onAutoSave === 'function') {
                                          return props.onAutoSave(editor);
                                    }
                              }
                        },
                        wordCount: {
                              onUpdate: stats => {
                                    if (typeof props.onWordCountUpdate === "function") {
                                          props.onWordCountUpdate(stats);
                                    }
                              }
                        },
                  }).then(editor => {
                        setEditor(editor)

                        if (props.setData) {
                              props.setData.current = (data) => {
                                    editor.setData(data);
                              }
                        }

                        if (props.readOnly) {
                              editor.enableReadOnlyMode("sdfgdfgfvrghbtrhrnyvt7y87mcvh78ryt7vchjmgt7hgvtt7m,g87c,x,985ry7vm");
                        } else {
                              // Set a custom container for the toolbar.
                              toolBarRef.current.appendChild(editor.ui.view.toolbar.element);
                              toolBarRef.current.querySelector(".ck-toolbar").classList.add('ck-reset_all');
                        }

                  }).catch(error => {
                        console.error(error);
                  });
            }

      }, [
            editorRef,
            toolBarRef,
            MyCustomUploadAdapterPlugin,
            props.data,
            props.setData,
            props.readOnly,
            props.onAutoSave,
            props.onWordCountUpdate,
            props.onFileUpload,
            props.autoSaveWaitingTime
      ]);

      return (
            <Box sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  backgroundColor: 'background.default',
                  color: 'text.primary',
                  ...props.sx
            }}>
                  <GlobalStyles styles={theme => ({
                        '*': {
                              '&.ck.ck-editor__editable_inline.ck-blurred ::selection': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.getContrastText,
                              },
                              '&.ck.ck-balloon-panel': {
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    '.ck-balloon-rotator': {
                                          '.ck-balloon-rotator__content': {
                                                backgroundColor: theme.palette.background.default,
                                                '.ck.ck-toolbar': {
                                                      backgroundColor: theme.palette.background.default,
                                                      '.ck-on:is(.ck.ck-button,a.ck.ck-button)': {
                                                            backgroundColor: theme.palette.mode === 'dark' ? '#fdfcfc2b' : ''
                                                      }
                                                }
                                          }
                                    }
                              },
                              '.ck.ck-tooltip .ck-tooltip__text': {
                                    backgroundColor: theme.palette.mode === 'dark' ? '#222428' : '#d3d3d3',
                                    color: theme.palette.text.primary,
                                    '&::after': {
                                          borderColor: `transparent transparent ${theme.palette.mode === 'dark' ? '#222428' : '#d3d3d3'} transparent !important`,
                                    }
                              },
                              '&.ck-reset_all :not(.ck-reset_all-excluded *), .ck.ck-reset_all, .ck.ck-form__row.ck-table-form__action-row .ck-button .ck-button__label': {
                                    // backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                              },
                              '&:is(.ck.ck-button,a.ck.ck-button):not(.ck-disabled):hover': {
                                    cursor: 'pointer',
                                    backgroundColor: theme.palette.mode === 'dark' ? '#fdfcfc2b' : ''
                              },
                              '&.ck.ck-balloon-panel[class*=arrow_n]:after': {
                                    borderColor: `transparent transparent ${theme.palette.background.default} transparent`,
                              },
                              '&.ck.ck-balloon-panel[class*=arrow_s]:after': {
                                    borderColor: `${theme.palette.background.default} transparent transparent`,
                              },
                        },
                        'a, .ck.ck-link-actions .ck-button.ck-link-actions__preview .ck-button__label': {
                              color: '#58a6ff',
                              textDecoration: 'none',

                              '&:hover': {
                                    textDecoration: 'underline',
                              }
                        },
                        '#toolbar .ck-toolbar, .ck.ck-dropdown__panel, .ck.ck-input, .ck.ck-list, .ck.ck-labeled-field-view>.ck.ck-labeled-field-view__input-wrapper>.ck.ck-label, .ck.ck-input[readonly]': {
                              backgroundColor: theme.palette.background.default,
                              color: theme.palette.text.primary,
                              '*': {
                                    color: theme.palette.text.primary,
                                    '&:is(.ck.ck-button,a.ck.ck-button)': {
                                          '&:not(.ck-disabled)': {
                                                cursor: 'pointer',
                                                '&:hover, &:active': {
                                                      backgroundColor: theme.palette.mode === 'dark' ? '#fdfcfc2b' : ''
                                                }
                                          }
                                    },
                                    '.ck.ck-splitbutton.ck-splitbutton_open>.ck-button:not(.ck-on):not(.ck-disabled):not(:hover), .ck.ck-splitbutton:hover>.ck-button:not(.ck-on):not(.ck-disabled):not(:hover)': {
                                          backgroundColor: theme.palette.mode === 'dark' ? '#fdfcfc0a' : ''
                                    },
                                    '.ck-on:is(.ck.ck-button,a.ck.ck-button)': {
                                          backgroundColor: theme.palette.mode === 'dark' ? '#fdfcfc2b' : ''
                                    }
                              },
                        },

                        '#editor': {
                              'h2, h3, h4': {
                                    lineHeight: 2,
                              },
                              'ul, ol': {
                                    marginLeft: "30px",
                                    'li': {
                                          lineHeight: 1.3,
                                          fontSize: '14px',
                                          fontWeight: 500,
                                    },
                              },
                              'p': {
                                    lineHeight: 1.3,
                                    fontSize: '14px',
                                    fontWeight: 500,
                              },
                              'a': {
                                    color: '#58a6ff',
                                    textDecoration: 'none',

                                    '&:hover': {
                                          textDecoration: 'underline',
                                    }
                              },
                              '.image>figcaption': {
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,
                                    padding: '0.2em',
                              },
                              'span[lang]': {
                                    display: 'flow-root',
                                    borderRadius: '8px',
                                    position: 'relative',
                                    backgroundColor: theme.palette.background.secondary,
                                    color: theme.palette.text.primary,

                                    'pre': {
                                          width: 'auto',
                                          overflow: 'auto',
                                          whiteSpace: 'nowrap',
                                          borderRadius: '8px',
                                          paddingTop: '20px',
                                          borderColor: theme.palette.mode === 'dark' ? '#202225' : '',
                                          backgroundColor: 'transparent',
                                          color: theme.palette.text.primary,

                                          '&::after': {
                                                display: 'none',
                                          },

                                          'code': {
                                                whiteSpace: 'pre',
                                          },
                                    },

                                    '&::after': {
                                          content: 'attr(lang)',
                                          position: 'absolute',
                                          top: '1px',
                                          left: '10px',
                                          padding: '1.8px 4.8px',
                                          lineHeight: '12px',
                                          borderRadius: '5px',
                                          backgroundColor: theme.palette.background.default,
                                          color: theme.palette.text.primary,
                                          // fontFamily: theme.typography.fontFamily,
                                          fontFamily: 'Helvetica, Arial, Tahoma, Verdana, sans-serif',
                                          fontSize: '11px',
                                          whiteSpace: 'nowrap',
                                          textDecoration: 'none',
                                          textTransform: 'uppercase',
                                    },

                              },
                              '.mention': {
                                    backgroundColor: 'transparent',
                                    position: 'relative',
                                    '&:hover': {
                                          '&::after': {
                                                content: 'attr(data-user-email)',
                                                position: 'absolute',
                                                top: 'calc(100% + 7px)',
                                                left: '0',
                                                padding: '5px',
                                                backgroundColor: theme.palette.mode === 'dark' ? '#222428' : '#d3d3d3',
                                                color: theme.palette.text.primary,
                                                zIndex: '9999',
                                                borderRadius: '5px',
                                          }
                                    },
                              },
                              '.ck-widget.raw-html-embed': {
                                    backgroundColor: theme.palette.background.default,
                                    color: theme.palette.text.primary,

                                    '.raw-html-embed__source[disabled]': {
                                          backgroundColor: theme.palette.background.secondary,
                                          color: theme.palette.text.primary,
                                          WebkitTextFillColor: theme.palette.text.secondary,
                                    },

                                    '.ck.ck-button, a.ck.ck-button': {
                                          color: theme.palette.text.primary,
                                    }
                              },
                              '.ck-widget': {
                                    '&.media': {
                                          maxWidth: '600px',
                                          margin: '0 auto',
                                    },
                              },
                              '.todo-list .todo-list__label>input:before': {
                                    borderColor: theme.palette.text.primary,
                              },
                        },

                        '.ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable)': {
                              border: '1px solid transparent',
                              boxShadow: 'none'
                        },

                        '.ck.ck-list__item': {
                              '.ck-button': {
                                    '.ck-on': {
                                          backgroundColor: theme.palette.mode === 'dark' ? '#fdfcfc2b' : ''
                                    },
                                    '&:hover:not(.ck-disabled)': {
                                          backgroundColor: theme.palette.mode === 'dark' ? '#fdfcfc0a' : ''
                                    }
                              },
                        },
                  })} />

                  <Box sx={{
                        width: '100%',
                        height: '41px',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'row',
                  }}>
                        {props.extraButtons}
                        {!props.readOnly && <Box id="toolbar" ref={toolBarRef} sx={{
                              width: '100%',
                              height: '100%',
                              '*': {
                                    backgroundColor: 'background.default',
                                    color: 'text.primary',
                              },
                              ...props.toolbarStylesSX,
                        }}></Box>}
                  </Box>

                  <Box sx={{
                        width: '100%',
                        height: props.readOnly ? '100%' : 'calc(100% - 41px )',
                        overflow: 'auto',
                        py: props.contentSize ? '10px' : '0px'
                  }}>
                        <div ref={editorRef} id="editor" style={{
                              position: 'relative',
                              width: props.contentSize?.width ?? '100%',
                              margin: '0 auto',
                              height: 'auto',
                              minHeight: props.contentSize?.height ?? '100%',
                              border: props.contentSize ? '1px solid !important' : 'none',
                              borderColor: theme.palette.text.primary,
                              ...props.editorStyles,
                        }} dangerouslySetInnerHTML={{ __html: props.data || '' }}></div>
                  </Box>
            </Box >
      )
}
