// vue-tsc 3.x ainda procura typescript/lib/tsc, que o TS 7 não exporta mais.
// Usa o compilador de compatibilidade TS 6 apenas no typecheck dos SFCs Vue.
const vueTsc = require('vue-tsc')

vueTsc.run(require.resolve('typescript6/lib/tsc'))
