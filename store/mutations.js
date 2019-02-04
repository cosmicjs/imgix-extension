const mutations = {
  SET_COSMIC_SETTINGS: (state, cosmic) => {
    state.settings = {
      ...state.settings,
      cosmic
    }
  },
  SET_IMAGES: (state, images) => {
    state.images = images;
  },
  ADD_IMAGE: (state, image) => {
    state.images.unshift(image);
  },
  SET_LOADING: (state, payload) => {
    state.loading = payload
  },
  SET_HELP_MODAL: (state, payload) => {
    state.modal = {
      help: payload
    }
  },
  OPEN_IMAGE_EDITOR: (state, payload) => {
    state.editorModal = {
      open: true,
      ...payload
    }
  },
  CLOSE_IMAGE_EDITOR: (state) => {
    state.editorModal = {
      ...state.editorModal,
      open: false
    }
  },
  EDIT_IMAGE_OBJECT: (state, payload) => {
    state.images[payload.id] = payload.image;
  }
}

export default mutations
