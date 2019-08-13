const bitgener = require('../../lib');

(async () => {
  try {
    const ret = await bitgener({
      data: 'Bitgener',
      type: 'datamatrix',
      output: 'bitgener.svg',
      encoding: 'utf8',
      rectangular: true,
      padding: 0,
      width: 250,
      height: 250,
      original2DSize: false,
      color: '#FFFFFF',
      bgColor: '#F7931A',
      hri: {
        show: true,
        fontFamily: 'Courier New',
        fontSize: 15,
        marginTop: 0,
      },
    });

    console.log(ret);

    // shows
  } catch (e) {
    console.error(e.toString());
  }
})();
