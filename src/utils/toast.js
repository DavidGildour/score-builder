import M from 'materialize-css/dist/js/materialize.min'

export default (text, duration=2000) => {
  M.toast({
    html: text,
    displayLength: duration,
    classes: "info-box rounded"
  })
}