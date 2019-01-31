const state = {
  init: false,
  loading: true,
  progress: false,
  success: {},
  error: {},
  images: [],
  settings: {
    cosmic: {
      slug: '',
      read_key: '',
      write_key: ''
    }
  },
  modal: {
    help: false,
  },
  editorModal: {
    open: false,
    editIndex: -1,
    isEdit: false,
    media: null,
    info: null,
  },
  editorSettings: {
    auto: [
      'compress',
      'enhance',
      'format',
      'redeye'
    ],
    fit: [
      'clamp',
      'clip',
      'crop',
      'facearea',
      'fill',
      'fillmax',
      'max',
      'min',
      'scale'
    ],
    crop: [
      'top',
      'bottom',
      'left',
      'right',
      'faces',
      'edges',
      'entropy'
    ],
    mask: [
      'ellipse',
      'corners'
    ]
  }
}

export default state
