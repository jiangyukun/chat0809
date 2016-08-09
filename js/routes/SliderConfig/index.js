module.exports = {
  path: 'slider_config',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/SliderConfig.jsx'))
    })
  }
}
