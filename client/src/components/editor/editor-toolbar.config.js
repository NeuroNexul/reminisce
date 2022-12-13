// import hljs from "highlight.js";

import axios from "axios";

var _code_languages = ["plain", "c", "cs", "cpp", "html", "xml", "css", "javascript", "python", "sql", "php", "perl", "ruby", "markdown", "auto"];

var re_weburl = new RegExp(
      "^" +
      // protocol identifier (optional)
      // short syntax // still required
      "(?:(?:(?:https?|ftp):)?\\/\\/)" +
      // user:pass BasicAuth (optional)
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broadcast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
      // host & domain names, may end with dot
      // can be replaced by a shortest alternative
      // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
      "(?:" +
      "(?:" +
      "[a-z0-9\\u00a1-\\uffff]" +
      "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
      ")?" +
      "[a-z0-9\\u00a1-\\uffff]\\." +
      ")+" +
      // TLD identifier name, may end with dot
      "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
      ")" +
      // port number (optional)
      "(?::\\d{2,5})?" +
      // resource path (optional)
      "(?:[/?#]\\S*)?" +
      "$", "i"
);

const EditorToolbarConfig = {
      language: 'en',
      tabSpaces: 4,

      extraPlugins: [
            MentionLinks,
      ],

      toolbar: {
            items: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  'link',
                  'blockQuote',
                  'subscript',
                  'superscript',
                  'removeFormat',
                  '|',
                  'fontBackgroundColor',
                  'fontColor',
                  'fontFamily',
                  'fontSize',
                  'highlight',
                  '|',
                  'alignment',
                  'indent',
                  'outdent',
                  'numberedList',
                  'bulletedList',
                  'todoList',
                  'insertTable',
                  '|',
                  'imageInsert',
                  'mediaEmbed',
                  '|',
                  'code',
                  'codeBlock',
                  '|',
                  'findAndReplace',
                  'horizontalLine',
                  'htmlEmbed',
                  'pageBreak',
                  'specialCharacters',
                  'restrictedEditingException',
                  '|',
                  'textPartLanguage',
                  '|',
                  'undo',
                  'redo'
            ]
      },
      heading: {
            options: [
                  { model: 'paragraph', title: 'Paragraph Text', class: 'ck-heading_paragraph' },
                  { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                  { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                  { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                  { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                  { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                  { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
            ]
      },
      image: {
            toolbar: [
                  'imageStyle:inline',
                  'imageStyle:block',
                  'imageStyle:side',
                  '|',
                  'imageResize:25',
                  'imageResize:50',
                  'imageResize:75',
                  'imageResize:original',
                  '|',
                  'imageTextAlternative',
                  'toggleImageCaption',
                  'linkImage'
            ],
            resizeUnit: '%',
            resizeOptions: [
                  {
                        name: 'imageResize:original',
                        value: null,
                        icon: 'original'
                  },
                  {
                        name: 'imageResize:25',
                        value: '25',
                        icon: 'small'
                  },
                  {
                        name: 'imageResize:50',
                        value: '50',
                        icon: 'medium'
                  },
                  {
                        name: 'imageResize:75',
                        value: '75',
                        icon: 'large'
                  }
            ]
      },
      link: {
            toggleDownloadable: {
                  mode: 'manual',
                  label: 'Downloadable',
                  attributes: {
                        download: 'file'
                  }
            },
            decorators: {
                  openInNewTab: {
                        mode: 'manual',
                        label: 'Open in a new tab',
                        defaultValue: true,			// This option will be selected by default.
                        attributes: {
                              target: '_blank',
                              rel: 'noopener noreferrer'
                        }
                  }
            }
      },
      table: {
            contentToolbar: [
                  'tableColumn',
                  'tableRow',
                  'mergeTableCells',
                  'tableCellProperties',
                  'tableProperties'
            ]
      },
      mediaEmbed: {
            toolbar: [
                  'mediaEmbed',
            ],
            extraProviders: [
                  {
                        name: 'All',
                        // A URL regexp or an array of URL regexps:
                        url: re_weburl,

                        // To be defined only if the media are previewable:
                        html: match => {

                              return (
                                    '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                                    `<iframe src="${match[0]}" ` +
                                    'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                                    'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                                    '</iframe>' +
                                    '</div>'
                              );
                        }
                  },
            ]
      },
      codeBlock: {
            languages: _code_languages.map(_language => {
                  return {
                        language: _language,
                        label: _language === "cs" ? "c#" : _language.toUpperCase()
                  };
            }),
      },
      mention: {
            feeds: [
                  {
                        marker: '@',
                        feed: getUsers,
                        itemRenderer: customItemRenderer
                  },
            ],
      },

};

export default EditorToolbarConfig;

/*
 * This plugin customizes the way mentions are handled in the editor model and data.
 * Instead of a classic <span class="mention"></span>,
 */
function MentionLinks(editor) {

      editor.conversion.for('upcast').elementToAttribute({
            view: {
                  name: 'a',
                  key: 'data-mention',
                  classes: 'mention',
                  attributes: {
                        href: true,
                        'data-user-id': true,
                        'data-user-name': true,
                        'data-user-email': true,
                        'data-user-avatar': true,
                        'data-user-bio': true,
                  }
            },
            model: {
                  key: 'mention',
                  value: viewItem => {

                        const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
                              // Add any other properties that you need.
                              link: viewItem.getAttribute('href'),
                              userId: viewItem.getAttribute('data-user-id'),
                              name: viewItem.getAttribute('data-user-name'),
                              email: viewItem.getAttribute('data-user-email'),
                              avatar: viewItem.getAttribute('data-user-avatar'),
                              bio: viewItem.getAttribute('data-user-bio'),
                        });

                        return mentionAttribute;
                  }
            },
            converterPriority: 'high'
      });

      editor.conversion.for('downcast').attributeToElement({
            model: 'mention',
            view: (modelAttributeValue, { writer }) => {
                  // Do not convert empty attributes (lack of value means no mention).
                  if (!modelAttributeValue) {
                        return;
                  }

                  return writer.createAttributeElement('a', {
                        class: 'mention',
                        'data-user-id': modelAttributeValue.id,
                        'data-mention': modelAttributeValue.email,

                        'data-user-name': modelAttributeValue.name,
                        'data-user-email': modelAttributeValue.email,
                        'data-user-avatar': modelAttributeValue.avatar,
                        'data-user-bio': modelAttributeValue.bio,

                        href: modelAttributeValue.link
                  }, {
                        // Make mention attribute to be wrapped by other attribute elements.
                        priority: 20,
                        // Prevent merging mentions together.
                        id: modelAttributeValue.uid
                  });
            },
            converterPriority: 'high'
      });
}

function getUsers() {
      return new Promise(resolve => {
            axios.post("/api/base/getAllUsers").then(res => {
                  const newData = res.data.data.map(user => {
                        return {
                              ...user,
                              id: `@${user.name}`,
                              link: `/u/${user.email}`,
                        }
                  });
                  resolve(newData);
            });
      });
}

function customItemRenderer(item) {

      const parentElement = document.createElement('span');
      parentElement.classList.add('custom-item');
      parentElement.id = `mention-list-item-id-${item.email}`;
      // Style
      parentElement.style.display = 'block';
      parentElement.style.padding = '5px';
      parentElement.style.position = 'relative';

      const avatarElement = document.createElement('img');
      avatarElement.classList.add('avatar');
      avatarElement.alt = item.name;
      avatarElement.referrerPolicy = 'no-referrer';
      // Style
      avatarElement.style.width = '40px';
      avatarElement.style.height = '40px';
      avatarElement.style.borderRadius = '50%';
      avatarElement.style.position = 'relative';
      avatarElement.style.marginRight = '5px';
      avatarElement.style.display = 'none';
      // Manage Image
      const avatarAltElement = document.createElement('div');
      avatarAltElement.classList.add('avatar');
      avatarAltElement.innerText = String(item.name)[0];
      // Style
      avatarAltElement.style.width = '40px';
      avatarAltElement.style.height = '40px';
      avatarAltElement.style.borderRadius = '50%';
      avatarAltElement.style.position = 'relative';
      avatarAltElement.style.marginRight = '5px';
      avatarAltElement.style.display = 'inline-grid';
      avatarAltElement.style.placeItems = 'center';
      avatarAltElement.style.fontSize = '20px';
      avatarAltElement.style.backgroundColor = `#${((1<<24)*Math.random() | 0).toString(16)}`;
      // Conditions
      const Img = new Image();
      Img.onload = (e) => {
            avatarElement.src = item.avatar;
            avatarAltElement.style.display = 'none';
            avatarElement.style.display = 'inline-grid';
      }
      Img.onerror = (err) => {
            avatarElement.style.display = 'none';
            avatarAltElement.style.display = 'inline-grid';
      }
      Img.referrerPolicy = 'no-referrer';
      Img.src = item.avatar;
      // append
      parentElement.appendChild(avatarElement);
      parentElement.appendChild(avatarAltElement);

      const userElement = document.createElement('span');
      userElement.classList.add('custom-item-username');
      // Style
      userElement.style.display = 'inline-block';
      // append
      parentElement.appendChild(userElement);

      const nameElement = document.createElement('span');
      nameElement.classList.add('custom-item-name');
      nameElement.innerText = item.name;
      // Style
      nameElement.style.fontSize = '14px';
      nameElement.style.fontWeight = 'bold';
      nameElement.style.lineHeight = '1.5';
      nameElement.style.display = 'block';
      // append
      userElement.appendChild(nameElement);

      const emailElement = document.createElement('span');
      emailElement.classList.add('custom-item-email');
      emailElement.textContent = item.email;
      // Style
      emailElement.style.fontSize = '12px';
      emailElement.style.lineHeight = '1';
      emailElement.style.display = 'block';
      // append
      userElement.appendChild(emailElement);

      return parentElement;
}