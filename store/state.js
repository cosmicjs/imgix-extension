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
    help: false
  }
}

export default state
